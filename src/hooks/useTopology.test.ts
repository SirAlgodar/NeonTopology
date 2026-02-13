import { renderHook, act } from '@testing-library/react';
import { useTopology } from './useTopology';
import { TopologyNode, TopologyLink } from '../types';

describe('useTopology', () => {
  const initialNodes: TopologyNode[] = [
    { id: 'node1', x: 0, y: 0, type: 'default' },
    { id: 'node2', x: 10, y: 10, type: 'default' }
  ];
  const initialLinks: TopologyLink[] = [];
  const onOptionsChange = jest.fn();

  beforeEach(() => {
    onOptionsChange.mockClear();
  });

  it('should initialize with provided nodes and links', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));
    expect(result.current.nodes).toEqual(initialNodes);
    expect(result.current.links).toEqual(initialLinks);
  });

  it('should add a node', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));
    const newNode: TopologyNode = { id: 'node3', x: 20, y: 20, type: 'default' };

    act(() => {
      result.current.addNode(newNode);
    });

    expect(result.current.nodes).toHaveLength(3);
    expect(result.current.nodes).toContainEqual(newNode);
    expect(onOptionsChange).toHaveBeenCalledWith(expect.objectContaining({ nodes: [...initialNodes, newNode], links: initialLinks }));
  });

  it('should remove a node and connected links', () => {
    const link: TopologyLink = { src: 'node1', dst: 'node2' };
    const { result } = renderHook(() => useTopology({ 
      initialNodes, 
      initialLinks: [link], 
      onOptionsChange 
    }));

    act(() => {
      result.current.removeNode('node1');
    });

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].id).toBe('node2');
    expect(result.current.links).toHaveLength(0); // Link should be removed
  });

  it('should not remove critical nodes', () => {
    const criticalNode: TopologyNode = { id: 'critical', x: 0, y: 0, type: 'default', isCritical: true };
    const { result } = renderHook(() => useTopology({ 
      initialNodes: [criticalNode], 
      initialLinks: [], 
      onOptionsChange 
    }));

    act(() => {
      result.current.removeNode('critical');
    });

    expect(result.current.nodes).toHaveLength(1);
  });

  it('should update a node', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));

    act(() => {
      result.current.updateNode('node1', { x: 100 });
    });

    expect(result.current.nodes.find(n => n.id === 'node1')?.x).toBe(100);
  });

  it('should add a link', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));
    const newLink: TopologyLink = { src: 'node1', dst: 'node2' };

    act(() => {
      result.current.addLink(newLink);
    });

    expect(result.current.links).toHaveLength(1);
    expect(result.current.links).toContainEqual(newLink);
  });

  it('should remove a link', () => {
    const link: TopologyLink = { src: 'node1', dst: 'node2' };
    const { result } = renderHook(() => useTopology({ 
      initialNodes, 
      initialLinks: [link], 
      onOptionsChange 
    }));

    act(() => {
      result.current.removeLink('node1', 'node2');
    });

    expect(result.current.links).toHaveLength(0);
  });

  it('should not add duplicate links', () => {
    const link: TopologyLink = { src: 'node1', dst: 'node2' };
    const { result } = renderHook(() => useTopology({ 
      initialNodes, 
      initialLinks: [link], 
      onOptionsChange 
    }));

    act(() => {
      result.current.addLink(link);
    });

    expect(result.current.links).toHaveLength(1);
  });

  it('should not add self-loop links', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));
    const link: TopologyLink = { src: 'node1', dst: 'node1' };

    act(() => {
      result.current.addLink(link);
    });

    expect(result.current.links).toHaveLength(0);
  });

  it('should prevent cycles', () => {
    const nodes = [
      { id: 'A', x: 0, y: 0, type: 'default' },
      { id: 'B', x: 0, y: 0, type: 'default' },
      { id: 'C', x: 0, y: 0, type: 'default' }
    ];
    const links = [
      { src: 'A', dst: 'B' },
      { src: 'B', dst: 'C' }
    ];
    
    const { result } = renderHook(() => useTopology({ 
      initialNodes: nodes, 
      initialLinks: links, 
      onOptionsChange 
    }));

    // Try to add C -> A (cycle)
    const cycleLink: TopologyLink = { src: 'C', dst: 'A' };
    
    act(() => {
      result.current.addLink(cycleLink);
    });

    expect(result.current.links).toHaveLength(2); // Should still be 2
    expect(result.current.links).not.toContainEqual(cycleLink);
  });

  it('should support undo and redo', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));

    // Initial state
    expect(result.current.nodes).toHaveLength(2);
    
    // Should do nothing if nothing to undo
    act(() => {
      result.current.undo();
    });
    expect(result.current.nodes).toHaveLength(2);

    // Add node
    const newNode: TopologyNode = { id: 'node3', x: 20, y: 20, type: 'default' };
    act(() => {
      result.current.addNode(newNode);
    });
    expect(result.current.nodes).toHaveLength(3);
    expect(result.current.canUndo).toBe(true);

    // Undo
    act(() => {
      result.current.undo();
    });
    expect(result.current.nodes).toHaveLength(2);
    expect(result.current.canRedo).toBe(true);

    // Redo
    act(() => {
      result.current.redo();
    });
    expect(result.current.nodes).toHaveLength(3);
    
    // Should do nothing if nothing to redo
    act(() => {
      result.current.redo(); // already at latest
      result.current.redo(); // nothing more
    });
    expect(result.current.nodes).toHaveLength(3);
  });

  it('should remove links when removing destination node', () => {
    const link: TopologyLink = { src: 'node1', dst: 'node2' };
    const { result } = renderHook(() => useTopology({ 
      initialNodes, 
      initialLinks: [link], 
      onOptionsChange 
    }));

    act(() => {
      result.current.removeNode('node2'); // Remove dst node
    });

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].id).toBe('node1');
    expect(result.current.links).toHaveLength(0);
  });

  it('should generate audit logs', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));

    const newNode: TopologyNode = { id: 'node3', x: 20, y: 20, type: 'default' };
    act(() => {
      result.current.addNode(newNode);
    });

    expect(result.current.auditLogs).toHaveLength(1);
    expect(result.current.auditLogs[0].action).toBe('create');
    expect(result.current.auditLogs[0].targetType).toBe('node');
    expect(result.current.auditLogs[0].targetId).toBe('node3');
  });

  it('should limit audit logs to 100', () => {
    const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));

    // Create 105 logs
    for (let i = 0; i < 105; i++) {
        act(() => {
            result.current.addNode({ id: `node-${i}`, x: 0, y: 0, type: 'default' });
        });
    }

    expect(result.current.auditLogs).toHaveLength(100);
    // The first 5 should be gone, so the first one should be node-5
    expect(result.current.auditLogs[0].targetId).toBe('node-5');
  });

  it('should handle log rotation in undo/redo', () => {
      const { result } = renderHook(() => useTopology({ initialNodes, initialLinks, onOptionsChange }));
      
      // Fill logs
      for (let i = 0; i < 100; i++) {
          act(() => {
              result.current.addNode({ id: `node-${i}`, x: 0, y: 0, type: 'default' });
          });
      }

      // Undo - should add a log and shift
      act(() => {
          result.current.undo();
      });
      
      expect(result.current.auditLogs).toHaveLength(100);
      expect(result.current.auditLogs[99].action).toBe('update'); // Undo action
      
      // Redo - should add a log and shift
      act(() => {
          result.current.redo();
      });
      
      expect(result.current.auditLogs).toHaveLength(100);
      expect(result.current.auditLogs[99].action).toBe('update'); // Redo action
  });
});
