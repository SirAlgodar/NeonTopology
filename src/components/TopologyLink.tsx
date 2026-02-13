import React from 'react';
import { TopologyLink, TopologyNode } from '../types';
import { isStatusOnline } from '../utils';

interface Props {
  link: TopologyLink;
  srcNode: TopologyNode;
  dstNode: TopologyNode;
  width: number;
  height: number;
  metricValue?: number | null;
  onContextMenu: (e: React.MouseEvent, link: TopologyLink) => void;
}

export const TopologyLinkComponent: React.FC<Props> = React.memo(({ link, srcNode, dstNode, width, height, metricValue, onContextMenu }) => {
  const x1 = (srcNode.x / 100) * width + (srcNode.width || 50) / 2;
  const y1 = (srcNode.y / 100) * height + (srcNode.height || 50) / 2;
  const x2 = (dstNode.x / 100) * width + (dstNode.width || 50) / 2;
  const y2 = (dstNode.y / 100) * height + (dstNode.height || 50) / 2;

  const isOnline = metricValue !== undefined && metricValue !== null ? isStatusOnline(metricValue) : true;
  const statusClass = isOnline ? 'line-online' : 'line-offline';

  return (
    <g>
      {/* Invisible thicker line for easier clicking */}
      <path
        data-testid={`link-${link.src}-${link.dst}`}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke="transparent"
        strokeWidth="10"
        fill="none"
        onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onContextMenu(e, link);
        }}
        style={{ cursor: 'pointer' }}
      />
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        className={`connector-line ${statusClass}`}
        markerEnd={`url(#end-arrow-${isOnline ? 'online' : 'offline'})`}
        pointerEvents="none"
      />
    </g>
  );
});

TopologyLinkComponent.displayName = 'TopologyLinkComponent';
