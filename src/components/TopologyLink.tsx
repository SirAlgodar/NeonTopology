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
}

export const TopologyLinkComponent: React.FC<Props> = React.memo(({ link, srcNode, dstNode, width, height, metricValue }) => {
  const x1 = (srcNode.x / 100) * width;
  const y1 = (srcNode.y / 100) * height;
  const x2 = (dstNode.x / 100) * width;
  const y2 = (dstNode.y / 100) * height;

  const isOnline = metricValue !== undefined && metricValue !== null ? isStatusOnline(metricValue) : true;
  const statusClass = isOnline ? 'line-online' : 'line-offline';

  return (
    <path
      d={`M ${x1} ${y1} L ${x2} ${y2}`}
      className={`connector-line ${statusClass}`}
      markerEnd={`url(#end-arrow-${isOnline ? 'online' : 'offline'})`}
    />
  );
});

TopologyLinkComponent.displayName = 'TopologyLinkComponent';
