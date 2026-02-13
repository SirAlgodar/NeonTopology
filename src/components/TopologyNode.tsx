import React from 'react';
import { TopologyNode } from '../types';
import { isStatusOnline } from '../utils';

interface Props {
  node: TopologyNode;
  width: number;
  height: number;
  metricValue?: number | null;
  onDragStart: (e: React.MouseEvent, nodeId: string) => void;
}

export const TopologyNodeComponent: React.FC<Props> = React.memo(({ node, width, height, metricValue, onDragStart }) => {
  const isOnline = metricValue !== undefined && metricValue !== null ? isStatusOnline(metricValue) : true;
  const statusClass = isOnline ? 'status-online' : 'status-offline';
  
  const px = (node.x / 100) * width;
  const py = (node.y / 100) * height;

  return (
    <div
      className={`node-card ${statusClass}`}
      style={{
        left: px,
        top: py,
        width: node.width,
        height: node.height,
        position: 'absolute'
      }}
      onMouseDown={(e) => onDragStart(e, node.id)}
    >
      <i className={`node-icon fa ${node.icon || 'fa-network-wired'}`}></i>
      <div className="node-name">{node.id}</div>
    </div>
  );
});

TopologyNodeComponent.displayName = 'TopologyNodeComponent';
