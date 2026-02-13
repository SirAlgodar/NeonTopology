import { PanelPlugin } from '@grafana/data';
import { NeonTopologyPanel } from './components/NeonTopologyPanel';
import { PanelOptions } from './types';
import { strings } from './locales/en';

export const plugin = new PanelPlugin<PanelOptions>(NeonTopologyPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      path: 'showChat',
      name: strings.panelOptions.showChat.name,
      description: strings.panelOptions.showChat.description,
      defaultValue: true,
    })
    .addNumberInput({
      path: 'zoomScale',
      name: strings.panelOptions.zoomScale.name,
      description: strings.panelOptions.zoomScale.description,
      defaultValue: 1,
    })
    .addTextInput({
        path: 'apiKey',
        name: strings.panelOptions.apiKey.name,
        description: strings.panelOptions.apiKey.description,
        settings: {
            inputType: 'password',
        }
    });
});
