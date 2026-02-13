import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NeonTopologyPanel } from './NeonTopologyPanel';
import { PanelProps, FieldType } from '@grafana/data';
import { PanelOptions } from '../types';

const mockOptions: PanelOptions = {
  zoomScale: 1,
  showChat: false,
  apiKey: '',
};

const mockData: any = {
  series: [
    {
      name: 'test-series',
      fields: [
        { name: 'Metric', type: FieldType.string, values: { get: (i: number) => 'Bits received', length: 1 } },
        { name: 'Value', type: FieldType.number, values: { get: (i: number) => 1, length: 1 } },
      ],
      length: 1,
    },
  ],
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
  it('renders the panel', () => {
    render(<NeonTopologyPanel {...mockProps} />);
    expect(screen.getByText('BORDA')).toBeInTheDocument();
  });
});
