export interface TopologyNode {
  id: string;
  x: number;
  y: number;
  type: string;
  width?: number;
  height?: number;
  icon?: string;
  metricBind?: string;
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

export interface PanelOptions {
  nodes?: TopologyNode[];
  links?: TopologyLink[];
  zoomScale: number;
  apiKey?: string;
  showChat: boolean;
}
