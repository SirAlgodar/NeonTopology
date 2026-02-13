import { useState, useCallback } from 'react';
import { TopologyNode, TopologyLink, AuditLogEntry } from '../types';

interface TopologyState {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

interface UseTopologyProps {
  initialNodes: TopologyNode[];
  initialLinks: TopologyLink[];
  initialAuditLogs?: AuditLogEntry[];
  onOptionsChange: (options: { nodes: TopologyNode[]; links: TopologyLink[]; auditLogs?: AuditLogEntry[] }) => void;
}

export const useTopology = ({ initialNodes, initialLinks, initialAuditLogs, onOptionsChange }: UseTopologyProps) => {
  const [nodes, setNodes] = useState<TopologyNode[]>(initialNodes);
  const [links, setLinks] = useState<TopologyLink[]>(initialLinks);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs || []);
  const [history, setHistory] = useState<TopologyState[]>([]);
  const [future, setFuture] = useState<TopologyState[]>([]);

  const saveState = useCallback((newNodes: TopologyNode[], newLinks: TopologyLink[], logEntry?: AuditLogEntry) => {
    // Push current state to history
    setHistory(prev => [...prev, { nodes, links }]);
    setFuture([]); // Clear redo stack
    
    // Update state
    setNodes(newNodes);
    setLinks(newLinks);
    
    let newLogs = auditLogs;
    if (logEntry) {
        newLogs = [...auditLogs, logEntry];
        if (newLogs.length > 100) newLogs.shift(); // Limit to 100 logs
        setAuditLogs(newLogs);
    }
    
    // Persist
    onOptionsChange({ nodes: newNodes, links: newLinks, auditLogs: newLogs });
  }, [nodes, links, auditLogs, onOptionsChange]);

  const createLog = (action: AuditLogEntry['action'], targetType: AuditLogEntry['targetType'], targetId: string, details?: string): AuditLogEntry => ({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now(),
    action,
    targetType,
    targetId,
    details
  });

  const hasPath = (start: string, end: string, currentLinks: TopologyLink[]): boolean => {
    const stack = [start];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === end) return true;
      
      if (!visited.has(current)) {
        visited.add(current);
        const neighbors = currentLinks
          .filter(l => l.src === current)
          .map(l => l.dst);
        
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
    return false;
  };

  const addNode = useCallback((node: TopologyNode) => {
    const log = createLog('create', 'node', node.id);
    saveState([...nodes, node], links, log);
  }, [nodes, links, saveState]);

  const removeNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node?.isCritical) {
      console.warn('Cannot remove critical node');
      return;
    }
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newLinks = links.filter(l => l.src !== nodeId && l.dst !== nodeId);
    const log = createLog('delete', 'node', nodeId);
    saveState(newNodes, newLinks, log);
  }, [nodes, links, saveState]);

  const updateNode = useCallback((nodeId: string, changes: Partial<TopologyNode>) => {
    const newNodes = nodes.map(n => n.id === nodeId ? { ...n, ...changes } : n);
    // Don't log every drag update? Or maybe only if specific changes?
    // For now, let's log updates. But dragging calls updateNode frequently?
    // Usually dragging updates local state and only calls updateNode on drag end.
    // In NeonTopologyPanel: handleMouseUp calls updateNode.
    const log = createLog('update', 'node', nodeId, JSON.stringify(changes));
    saveState(newNodes, links, log);
  }, [nodes, links, saveState]);

  const addLink = useCallback((link: TopologyLink) => {
    // Validation
    if (link.src === link.dst) {
      console.warn('Cannot connect node to itself');
      return;
    }
    const exists = links.some(l => l.src === link.src && l.dst === link.dst);
    if (exists) {
      console.warn('Link already exists');
      return;
    }

    if (hasPath(link.dst, link.src, links)) {
      console.warn('Cannot create cycle');
      return;
    }

    const log = createLog('create', 'link', `${link.src}-${link.dst}`);
    saveState(nodes, [...links, link], log);
  }, [nodes, links, saveState]);

  const removeLink = useCallback((src: string, dst: string) => {
    const newLinks = links.filter(l => !(l.src === src && l.dst === dst));
    const log = createLog('delete', 'link', `${src}-${dst}`);
    saveState(nodes, newLinks, log);
  }, [nodes, links, saveState]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    setFuture(prev => [{ nodes, links }, ...prev]);
    setNodes(previous.nodes);
    setLinks(previous.links);
    setHistory(newHistory);
    
    // Log undo?
    const log = createLog('update', 'node', 'undo', 'Reverted last action');
    const newLogs = [...auditLogs, log];
    if (newLogs.length > 100) newLogs.shift();
    setAuditLogs(newLogs);

    onOptionsChange({ nodes: previous.nodes, links: previous.links, auditLogs: newLogs });
  }, [history, nodes, links, auditLogs, onOptionsChange]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setHistory(prev => [...prev, { nodes, links }]);
    setNodes(next.nodes);
    setLinks(next.links);
    setFuture(newFuture);
    
    // Log redo?
    const log = createLog('update', 'node', 'redo', 'Redid last action');
    const newLogs = [...auditLogs, log];
    if (newLogs.length > 100) newLogs.shift();
    setAuditLogs(newLogs);
    
    onOptionsChange({ nodes: next.nodes, links: next.links, auditLogs: newLogs });
  }, [future, nodes, links, auditLogs, onOptionsChange]);

  return {
    nodes,
    links,
    auditLogs,
    addNode,
    removeNode,
    updateNode,
    addLink,
    removeLink,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0
  };
};
