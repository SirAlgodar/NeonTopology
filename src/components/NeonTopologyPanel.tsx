import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, TopologyNode, TopologyLink } from '../types';
import { INITIAL_NODES, INITIAL_LINKS, MOCK_METRICS } from '../constants';
import { TopologyNodeComponent } from './TopologyNode';
import { TopologyLinkComponent } from './TopologyLink';
import { useTopology } from '../hooks/useTopology';
import { Toolbar } from './Toolbar';
import { ContextMenu } from './ContextMenu';
import { IconName } from '@grafana/ui';
import '../styles/neon-topology.css';

interface Props extends PanelProps<PanelOptions> {}

export const NeonTopologyPanel: React.FC<Props> = ({ options, data, width, height, onOptionsChange }) => {
  // Use custom hook for topology management
  const { 
    nodes, links, auditLogs,
    addNode, removeNode, updateNode, 
    addLink, removeLink, 
    undo, redo, canUndo, canRedo 
  } = useTopology({
    initialNodes: options.nodes || INITIAL_NODES,
    initialLinks: options.links || INITIAL_LINKS,
    initialAuditLogs: options.auditLogs,
    onOptionsChange: (newOptions) => {
      // We only update the options, Grafana handles persistence if in edit mode
      // or allows the user to save the dashboard.
      onOptionsChange({ ...options, ...newOptions });
    }
  });

  // Local UI state
  const [zoomScale, setZoomScale] = useState(options.zoomScale || 1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction State
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [localNodes, setLocalNodes] = useState<TopologyNode[]>(nodes);
  
  // Drawing Link State
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartNodeId, setDrawStartNodeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ 
    x: number; 
    y: number; 
    type: 'node' | 'link'; 
    id: string | { src: string; dst: string };
  } | null>(null);

  // Sync local nodes with hook nodes when not dragging
  useEffect(() => {
    if (!dragNodeId) {
      setLocalNodes(nodes);
    }
  }, [nodes, dragNodeId]);

  // Parse metrics
  const metrics = useMemo(() => {
    const map = new Map<string, number>();

    if (!data.series || data.series.length === 0) {
      MOCK_METRICS.forEach(m => map.set(m.name, m.value));
      return map;
    }

    data.series.forEach((s) => {
      const fieldVal = s.fields.find((f) => f.type === 'number');
      const fieldName = s.fields.find((f) => f.name === 'Metric' || f.name === 'Field' || f.type === 'string');
      
      if (fieldVal && fieldName) {
        for (let i = 0; i < fieldVal.values.length; i++) {
          map.set(String(fieldName.values[i]), Number(fieldVal.values[i]));
        }
      } else if (s.name && fieldVal) {
        const lastVal = fieldVal.values[fieldVal.values.length - 1];
        map.set(s.name, Number(lastVal));
      }
    });

    if (map.size === 0) {
      MOCK_METRICS.forEach(m => map.set(m.name, m.value));
    }
    return map;
  }, [data]);

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // If clicking on background and context menu is open, close it
    if (contextMenu) setContextMenu(null);

    // If drawing and clicked background, cancel drawing
    if (isDrawing && drawStartNodeId) {
        setDrawStartNodeId(null);
        return;
    }

    // Start Panning
    setIsPanning(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update mouse pos for drawing line
    if (isDrawing && drawStartNodeId && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate mouse pos relative to zoom stage (need to reverse transform)
        // Actually, let's just keep mousePos in screen coords for the SVG overlay?
        // Or better: calculate local coordinates relative to the panel
        setMousePos({ 
            x: (e.clientX - rect.left - pan.x) / zoomScale, 
            y: (e.clientY - rect.top - pan.y) / zoomScale 
        });
    }

    if (isPanning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragNodeId) {
      const dx = (e.clientX - dragStart.x) / zoomScale;
      const dy = (e.clientY - dragStart.y) / zoomScale;
      
      const dxPercent = (dx / width) * 100;
      const dyPercent = (dy / height) * 100;

      setLocalNodes(prev => prev.map(n => {
        if (n.id === dragNodeId) {
          return { ...n, x: n.x + dxPercent, y: n.y + dyPercent };
        }
        return n;
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
        setIsPanning(false);
    }
    if (dragNodeId) {
      // Commit the new position to history
      const node = localNodes.find(n => n.id === dragNodeId);
      if (node) {
        updateNode(dragNodeId, { x: node.x, y: node.y });
      }
      setDragNodeId(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.1, zoomScale + scaleAmount), 5);
    setZoomScale(newScale);
  };

  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (isDrawing) return; // Don't drag if drawing
    e.stopPropagation();
    e.preventDefault();
    setDragNodeId(nodeId);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (contextMenu) setContextMenu(null);
  }, [isDrawing, contextMenu]);

  const handleNodeClick = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (isDrawing) {
        if (!drawStartNodeId) {
            setDrawStartNodeId(nodeId);
        } else {
            // Finish link
            if (drawStartNodeId !== nodeId) {
                addLink({
                    src: drawStartNodeId,
                    dst: nodeId,
                    type: 'standard'
                });
            }
            setDrawStartNodeId(null);
        }
    }
  }, [isDrawing, drawStartNodeId, addLink]);

  const handleNodeContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
      setContextMenu({
          x: e.clientX,
          y: e.clientY,
          type: 'node',
          id: nodeId
      });
  }, []);

  const handleLinkContextMenu = useCallback((e: React.MouseEvent, link: TopologyLink) => {
      setContextMenu({
          x: e.clientX,
          y: e.clientY,
          type: 'link',
          id: { src: link.src, dst: link.dst }
      });
  }, []);

  const handleAddNode = () => {
      const id = `Node-${Math.floor(Math.random() * 1000)}`;
      addNode({
          id,
          x: 50, // Center
          y: 50,
          type: 'default',
          width: 50,
          height: 50,
          icon: 'fa-cube'
      });
  };

  // Render Helpers
  const renderDraftLine = () => {
      if (!isDrawing || !drawStartNodeId) return null;
      const startNode = localNodes.find(n => n.id === drawStartNodeId);
      if (!startNode) return null;

      const x1 = (startNode.x / 100) * width + (startNode.width || 50) / 2;
      const y1 = (startNode.y / 100) * height + (startNode.height || 50) / 2;
      
      // mousePos is in local zoomed coordinates relative to 0,0 of zoom-stage?
      // No, setMousePos logic above: (e.clientX - rect.left - pan.x) / zoomScale
      // This maps screen pixels to the coordinate space of the zoom-stage content (before scale/translate)
      // So it matches x1/y1 space if x1/y1 are in pixels.
      // x1/y1 are calculated using width/height of the container. 
      // Are width/height affected by zoom? No, they are panel dimensions.
      
      return (
          <line 
            x1={x1} y1={y1} 
            x2={mousePos.x} y2={mousePos.y} 
            stroke="#00d4ff" 
            strokeWidth="2" 
            strokeDasharray="5,5" 
          />
      );
  };

  return (
    <div 
      id="neon-topology-panel"
      ref={containerRef}
      style={{ width, height, overflow: 'hidden', cursor: isDrawing ? 'crosshair' : (isPanning ? 'grabbing' : 'grab') }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-grid"></div>

      <Toolbar 
        onAddNode={handleAddNode}
        isDrawing={isDrawing}
        onToggleDrawing={() => {
            setIsDrawing(!isDrawing);
            setDrawStartNodeId(null);
        }}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {contextMenu && (
          <ContextMenu 
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            items={[
                {
                    label: 'Delete',
                    icon: 'trash-alt' as IconName,
                    destructive: true,
                    onClick: () => {
                        if (contextMenu.type === 'node') {
                            removeNode(contextMenu.id as string);
                        } else {
                            const ids = contextMenu.id as {src: string, dst: string};
                            removeLink(ids.src, ids.dst);
                        }
                    }
                }
            ]}
          />
      )}
      
      <div 
        id="zoom-stage" 
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <svg id="topology-lines" style={{ overflow: 'visible', pointerEvents: 'visible' }}>
            <defs>
                <marker id="arrow-online" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#39ff14" /></marker>
                <marker id="arrow-offline" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#ff0000" /></marker>
                <marker id="arrow-default" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#334155" /></marker>
                <marker id="end-arrow-online" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L5,3 z" fill="#39ff14" /></marker>
                <marker id="end-arrow-offline" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L5,3 z" fill="#ff0000" /></marker>
                <marker id="end-arrow-default" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L5,3 z" fill="#334155" /></marker>
            </defs>
            {links.map((link, i) => {
                const srcNode = localNodes.find(n => n.id === link.src);
                const dstNode = localNodes.find(n => n.id === link.dst);
                if (!srcNode || !dstNode) return null;
                const metricValue = link.metricBind ? metrics.get(link.metricBind) : undefined;
                return (
                    <TopologyLinkComponent
                        key={i}
                        link={link}
                        srcNode={srcNode}
                        dstNode={dstNode}
                        width={width}
                        height={height}
                        metricValue={metricValue}
                        onContextMenu={handleLinkContextMenu}
                    />
                );
            })}
            {renderDraftLine()}
        </svg>

        <div id="nodes-layer" style={{ pointerEvents: 'auto' }}>
            {localNodes.map((node) => {
                const metricValue = node.metricBind ? metrics.get(node.metricBind) : undefined;
                return (
                    <TopologyNodeComponent
                        key={node.id}
                        node={node}
                        width={width}
                        height={height}
                        metricValue={metricValue}
                        onDragStart={handleNodeDragStart}
                        onClick={handleNodeClick}
                        onContextMenu={handleNodeContextMenu}
                        isSelected={node.id === drawStartNodeId}
                    />
                );
            })}
        </div>
      </div>
    </div>
  );
};
