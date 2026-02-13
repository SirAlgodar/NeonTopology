import React from 'react';
import { TopologyNode } from '../types';
import { isStatusOnline } from '../utils';

interface Props {
  node: TopologyNode;
  width: number;
  height: number;
  metricValue?: number | null;
  onDragStart: (e: React.MouseEvent, nodeId: string) => void;
  onClick: (e: React.MouseEvent, nodeId: string) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  isSelected?: boolean;
}

export const TopologyNodeComponent: React.FC<Props> = React.memo(({ node, width, height, metricValue, onDragStart, onClick, onContextMenu, isSelected }) => {
  const isOnline = metricValue !== undefined && metricValue !== null ? isStatusOnline(metricValue) : true;
  const statusClass = isOnline ? 'status-online' : 'status-offline';
  
  const px = (node.x / 100) * width;
  const py = (node.y / 100) * height;

  return (
    <div
      className={`node-card ${statusClass} ${isSelected ? 'selected' : ''}`}
      style={{
        left: px,
        top: py,
        width: node.width,
        height: node.height,
        position: 'absolute',
        boxShadow: isSelected ? '0 0 10px #00d4ff' : undefined
      }}
      onMouseDown={(e) => {
        if (e.button === 0) { // Left click only for drag/select
           // If we are drawing, we might want to handle click instead of drag, 
           // but drag logic usually starts on mouse down. 
           // The parent will decide whether to start drag or handle click.
           // Actually, standard drag starts on mousedown. 
           // Click is mouseup without move.
           onDragStart(e, node.id);
        }
      }}
      onClick={(e) => onClick(e, node.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, node.id);
      }}
    >
      <i className={`node-icon fa ${node.icon || 'fa-network-wired'}`}></i>
      <div className="node-name">{node.id}</div>
    </div>
  );
});

TopologyNodeComponent.displayName = 'TopologyNodeComponent';
