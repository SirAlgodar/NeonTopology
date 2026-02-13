import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, TopologyNode, TopologyLink } from '../types';
import { INITIAL_NODES, INITIAL_LINKS, MOCK_METRICS } from '../constants';
import { getMetricValue } from '../utils';
import { TopologyNodeComponent } from './TopologyNode';
import { TopologyLinkComponent } from './TopologyLink';
import '../styles/neon-topology.css';

interface Props extends PanelProps<PanelOptions> {}

export const NeonTopologyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const [nodes, setNodes] = useState<TopologyNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<TopologyLink[]>(INITIAL_LINKS);
  const [zoomScale, setZoomScale] = useState(options.zoomScale || 1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse metrics from Grafana data
  const metrics = useMemo(() => {
    if (!data.series || data.series.length === 0) {
      return MOCK_METRICS;
    }
    
    const extractedMetrics: Array<{ name: string; value: number }> = [];
    
    data.series.forEach((s) => {
      const fieldVal = s.fields.find((f) => f.type === 'number');
      const fieldName = s.fields.find((f) => f.name === 'Metric' || f.name === 'Field' || f.type === 'string');
      
      if (fieldVal && fieldName) {
        for (let i = 0; i < fieldVal.values.length; i++) {
          extractedMetrics.push({ 
            name: String(fieldName.values[i]), 
            value: Number(fieldVal.values[i]) 
          });
        }
      } else if (s.name && fieldVal) {
        const lastVal = fieldVal.values[fieldVal.values.length - 1];
        extractedMetrics.push({ name: s.name || '', value: Number(lastVal) });
      }
    });
    
    return extractedMetrics.length > 0 ? extractedMetrics : MOCK_METRICS;
  }, [data]);

  // Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) {
      return; // Only left click
    }
    setIsPanning(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragNodeId) {
      const dx = (e.clientX - dragStart.x) / zoomScale; // Adjust for zoom
      const dy = (e.clientY - dragStart.y) / zoomScale;
      
      // Convert pixel delta to percentage delta
      const dxPercent = (dx / width) * 100;
      const dyPercent = (dy / height) * 100;

      setNodes(prevNodes => prevNodes.map(n => {
        if (n.id === dragNodeId) {
          return {
            ...n,
            x: n.x + dxPercent,
            y: n.y + dyPercent
          };
        }
        return n;
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDragNodeId(null);
  };

  // Node Dragging logic
  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation(); // Prevent panning
    e.preventDefault(); // Prevent text selection
    setDragNodeId(nodeId);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Basic zoom logic
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.1, zoomScale + scaleAmount), 5);
    setZoomScale(newScale);
  };

  return (
    <div 
      id="neon-topology-panel"
      ref={containerRef}
      style={{ width, height, overflow: 'hidden', cursor: isPanning ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div className="bg-grid"></div>
      
      <div 
        id="zoom-stage" 
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none' // Let events pass through to SVG/Nodes
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
                const srcNode = nodes.find(n => n.id === link.src);
                const dstNode = nodes.find(n => n.id === link.dst);
                if (!srcNode || !dstNode) {
                  return null;
                }

                const metric = getMetricValue(metrics, link.metricBind);

                return (
                    <TopologyLinkComponent
                        key={i}
                        link={link}
                        srcNode={srcNode}
                        dstNode={dstNode}
                        width={width}
                        height={height}
                        metricValue={metric?.value}
                    />
                );
            })}
        </svg>

        <div id="nodes-layer" style={{ pointerEvents: 'auto' }}>
            {nodes.map((node) => {
                const metric = getMetricValue(metrics, node.metricBind);
                return (
                    <TopologyNodeComponent
                        key={node.id}
                        node={node}
                        width={width}
                        height={height}
                        metricValue={metric?.value}
                        onDragStart={handleNodeDragStart}
                    />
                );
            })}
        </div>
      </div>
    </div>
  );
};
