import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NeonTopologyPanel } from './NeonTopologyPanel';
import { PanelProps, FieldType } from '@grafana/data';
import { PanelOptions, TopologyNode, TopologyLink } from '../types';

// Mock constants to have predictable initial state
jest.mock('../constants', () => ({
  INITIAL_NODES: [
    { id: 'Node-1', x: 10, y: 10, type: 'default', width: 50, height: 50 },
    { id: 'Node-2', x: 60, y: 10, type: 'default', width: 50, height: 50 }
  ],
  INITIAL_LINKS: [],
  MOCK_METRICS: []
}));

const mockOptions: PanelOptions = {
  nodes: [
    { id: 'Node-1', x: 10, y: 10, type: 'default', width: 50, height: 50 },
    { id: 'Node-2', x: 60, y: 10, type: 'default', width: 50, height: 50 }
  ],
  links: [],
  zoomScale: 1,
  showChat: false,
  apiKey: '',
};

const mockData: any = {
  series: [],
  state: 'Done',
  timeRange: {} as any,
};

const mockProps: PanelProps<PanelOptions> = {
  data: mockData,
  options: mockOptions,
  id: 1,
  transparent: false,
  width: 600,
  height: 400,
  fieldConfig: {} as any,
  renderCounter: 0,
  title: 'Test Panel',
  onOptionsChange: jest.fn(),
  onChangeTimeRange: jest.fn(),
  onFieldConfigChange: jest.fn(),
  replaceVariables: ((s: string) => s) as any,
  eventBus: {} as any,
  timeZone: 'browser',
  timeRange: {} as any,
};

describe('NeonTopologyPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the panel and initial nodes', () => {
    render(<NeonTopologyPanel {...mockProps} />);
    expect(screen.getByText('Node-1')).toBeInTheDocument();
    expect(screen.getByText('Node-2')).toBeInTheDocument();
  });

  it('adds a node when Add Node button is clicked', () => {
    render(<NeonTopologyPanel {...mockProps} />);
    const addButton = screen.getByText('Add Node');
    fireEvent.click(addButton);
    
    // onOptionsChange should be called with new node
    expect(mockProps.onOptionsChange).toHaveBeenCalled();
    // We expect 3 nodes now (2 initial + 1 new)
    // Note: Since we mock constants, render will show 3 nodes if state updates correctly.
    // However, onOptionsChange update loop depends on parent passing back new options.
    // In test environment, we don't automatically update props.options based on onOptionsChange.
    // But useTopology updates local state 'nodes' independently of options prop changes for the initial render?
    // No, useTopology initializes from options.nodes || INITIAL_NODES.
    // When addNode is called, setNodes is called, so local state updates.
  });

  it('toggles drawing mode', () => {
    render(<NeonTopologyPanel {...mockProps} />);
    const drawButton = screen.getByText('Draw Link');
    fireEvent.click(drawButton);
    expect(screen.getByText('Cancel Link')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel Link'));
    expect(screen.getByText('Draw Link')).toBeInTheDocument();
  });

  it('opens context menu on right click', () => {
    render(<NeonTopologyPanel {...mockProps} />);
    const node = screen.getByText('Node-1');
    fireEvent.contextMenu(node);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('removes node via context menu', () => {
    render(<NeonTopologyPanel {...mockProps} />);
    const node = screen.getByText('Node-1');
    fireEvent.contextMenu(node);
    const deleteBtn = screen.getByText('Delete');
    fireEvent.click(deleteBtn);
    
    expect(mockProps.onOptionsChange).toHaveBeenCalled();
  });

  it('drags a node', () => {
    const { container } = render(<NeonTopologyPanel {...mockProps} />);
    // Find the main panel container
    // Since it's not by role, we use querySelector or assume it's the first div?
    // The panel has id="neon-topology-panel"
    const panel = container.querySelector('#neon-topology-panel');
    if (!panel) throw new Error('Panel not found');

    const node = screen.getByText('Node-1');
    
    // Start drag on node
    fireEvent.mouseDown(node, { clientX: 10, clientY: 10 });
    
    // Move on panel (simulating mouse moving over the panel area)
    fireEvent.mouseMove(panel, { clientX: 100, clientY: 100 });
    
    // End drag on panel
    fireEvent.mouseUp(panel);
    
    // onOptionsChange should be called with updated node position
    expect(mockProps.onOptionsChange).toHaveBeenCalled();
  });

  it('draws a link between nodes', () => {
    const { container } = render(<NeonTopologyPanel {...mockProps} />);
    const panel = container.querySelector('#neon-topology-panel');
    if (!panel) throw new Error('Panel not found');

    // Toggle draw mode
    fireEvent.click(screen.getByText('Draw Link'));
    
    const node1 = screen.getByText('Node-1');
    const node2 = screen.getByText('Node-2');
    
    // Click start node
    fireEvent.click(node1);
    
    // Move on panel (optional, just to test draft line logic if we could check it)
    fireEvent.mouseMove(panel, { clientX: 60, clientY: 10 });
    
    // Click end node
    fireEvent.click(node2);
    
    // onOptionsChange should be called with new link
    expect(mockProps.onOptionsChange).toHaveBeenCalled();
  });

  it('cancels drawing when clicking on background', () => {
    const { container } = render(<NeonTopologyPanel {...mockProps} />);
    const panel = container.querySelector('#neon-topology-panel');
    if (!panel) throw new Error('Panel not found');

    // Toggle draw mode
    fireEvent.click(screen.getByText('Draw Link'));
    
    // Click start node
    const node1 = screen.getByText('Node-1');
    fireEvent.click(node1);
    
    // Click background (panel)
    fireEvent.mouseDown(panel);
    
    // Check if drawing was cancelled - how? 
    // Internal state isn't exposed.
    // But if we click another node now, it should START a new link, not finish the previous one.
    // So let's try to click node 2. If it was cancelled, this click starts a new link (no addLink call).
    // If it wasn't cancelled, this click would finish the link (addLink called).
    
    const node2 = screen.getByText('Node-2');
    fireEvent.click(node2);
    
    expect(mockProps.onOptionsChange).not.toHaveBeenCalled();
  });

  it('pans the view', () => {
    const { container } = render(<NeonTopologyPanel {...mockProps} />);
    const panel = container.querySelector('#neon-topology-panel');
    if (!panel) throw new Error('Panel not found');

    // Start pan
    fireEvent.mouseDown(panel, { clientX: 0, clientY: 0, button: 0 });
    
    // Move pan
    fireEvent.mouseMove(panel, { clientX: 100, clientY: 100 });
    
    // End pan
    fireEvent.mouseUp(panel);
    
    // Panning updates local state 'pan', which affects the transform of #zoom-stage
    // We can check if the style of zoom-stage changed?
    const zoomStage = container.querySelector('#zoom-stage');
    expect(zoomStage).toHaveStyle('transform: translate(100px, 100px) scale(1)');
  });

  it('zooms the view', () => {
    const { container } = render(<NeonTopologyPanel {...mockProps} />);
    const panel = container.querySelector('#neon-topology-panel');
    if (!panel) throw new Error('Panel not found');

    // Zoom in
    fireEvent.wheel(panel, { deltaY: -100 });
    
    const zoomStage = container.querySelector('#zoom-stage');
    // Initial scale is 1. deltaY -100 -> scaleAmount = 0.1 -> newScale = 1.1
    expect(zoomStage).toHaveStyle('transform: translate(0px, 0px) scale(1.1)');
  });

  it('removes link via context menu', () => {
    // Setup with a link
    const link: TopologyLink = { src: 'Node-1', dst: 'Node-2' };
    const propsWithLink = {
      ...mockProps,
      options: {
        ...mockProps.options,
        links: [link]
      }
    };

    render(<NeonTopologyPanel {...propsWithLink} />);
    
    // Find the link element by testId
    const linkElement = screen.getByTestId('link-Node-1-Node-2');
    
    fireEvent.contextMenu(linkElement);
    const deleteBtn = screen.getByText('Delete');
    fireEvent.click(deleteBtn);
    expect(mockProps.onOptionsChange).toHaveBeenCalled();
  });

  it('parses metrics correctly', () => {
    const link: TopologyLink = { 
        src: 'Node-1', 
        dst: 'Node-2',
        metricBind: 'Node-1-Node-2'
    };
    const propsWithMetrics = {
      ...mockProps,
      options: {
        ...mockProps.options,
        links: [link]
      },
      data: {
        ...mockProps.data,
        series: [
          {
            name: 'Node-1-Node-2',
            fields: [
              { name: 'Time', type: 'time', values: [1, 2] },
              { name: 'Value', type: 'number', values: [0, 0] } // Offline
            ],
            length: 2,
          }
        ]
      } as any
    };

    const { container } = render(<NeonTopologyPanel {...propsWithMetrics} />);
    
    // The link should have class 'line-offline' because value is 0
    // We need to find the link path that has the class.
    // TopologyLink renders two paths. The second one has the class.
    const offlineLink = container.querySelector('.line-offline');
    expect(offlineLink).toBeInTheDocument();
  });

  it('parses metrics with Metric field', () => {
    const link: TopologyLink = { 
        src: 'Node-1', 
        dst: 'Node-2',
        metricBind: 'my-metric'
    };
    const propsWithMetrics = {
      ...mockProps,
      options: {
        ...mockProps.options,
        links: [link]
      },
      data: {
        ...mockProps.data,
        series: [
          {
            name: 'Series A', // Ignored if Metric field exists
            fields: [
              { name: 'Time', type: 'time', values: [1, 2] },
              { name: 'Metric', type: 'string', values: ['other-metric', 'my-metric'] },
              { name: 'Value', type: 'number', values: [0, 1] } // 1 is Online
            ],
            length: 2,
          }
        ]
      } as any
    };

    const { container } = render(<NeonTopologyPanel {...propsWithMetrics} />);
    
    // The link should be online (green) because the LAST value for 'my-metric' is what?
    // Wait, the loop iterates all values.
    // for (let i = 0; i < fieldVal.values.length; i++) {
    //   extractedMetrics.push({ name: String(fieldName.values[i]), value: Number(fieldVal.values[i]) });
    // }
    // It pushes ALL points.
    // getMetricValue uses .find().
    // If multiple entries have same name, .find() returns the FIRST one found?
    // extractedMetrics is an array.
    // The loop pushes in order.
    // So if 'my-metric' is at index 1, it is pushed after 'other-metric'.
    // If there are duplicates of 'my-metric', .find() returns the first one in the array.
    // In this case, 'my-metric' appears once.
    // Value is 1 -> Online.
    
    const onlineLink = container.querySelector('.line-online');
    expect(onlineLink).toBeInTheDocument();
  });

  it('uses mock metrics when map is empty', () => {
      const link: TopologyLink = { src: 'Node-1', dst: 'Node-2', metricBind: 'SW01-AGROMAVE: ICMP ping' };
      const props = {
          ...mockProps,
          options: { ...mockProps.options, links: [link] },
          data: { 
              ...mockProps.data, 
              series: [{ name: 'Empty', fields: [{ name: 'Time', type: 'time', values: [1, 2] }] }] 
          } as any 
      };
      
      const { container } = render(<NeonTopologyPanel {...props} />);
      // MOCK_METRICS has value 1 for this metric, so it should be online
      const onlineLink = container.querySelector('.line-online');
      expect(onlineLink).toBeInTheDocument();
  });
});
