export interface TopologyNode {
  id: string;
  x: number;
  y: number;
  type: string;
  width?: number;
  height?: number;
  icon?: string;
  metricBind?: string;
  isCritical?: boolean; // New: prevents removal
}

export interface Breakpoint {
    x: number;
    y: number;
}

export interface TopologyLink {
  src: string;
  dst: string;
  style?: string;
  type?: string;
  metricBind?: string;
  metricBindSec?: string;
  isP2P?: boolean;
  labelPosPrimary?: number;
  labelPosSecondary?: number;
  breakpoints?: Breakpoint[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: 'create' | 'update' | 'delete';
  targetType: 'node' | 'link';
  targetId: string;
  details?: string;
  user?: string; // Optional user info if available
}

export interface PanelOptions {
  nodes: TopologyNode[]; // Changed to required
  links: TopologyLink[]; // Changed to required
  auditLogs?: AuditLogEntry[]; // New: audit logs
  zoomScale: number;
  apiKey?: string;
  showChat: boolean;
}
