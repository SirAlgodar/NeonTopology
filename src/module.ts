import { PanelPlugin } from '@grafana/data';
import { NeonTopologyPanel } from './components/NeonTopologyPanel';
import { PanelOptions } from './types';
import { strings } from './locales/en';
import { INITIAL_NODES, INITIAL_LINKS } from './constants';

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
    })
    // Note: 'nodes' and 'links' are not exposed in the UI builder because they are managed
    // interactively by the panel. We just need to ensure they have default values.
    // However, PanelPlugin doesn't let us set defaults for hidden options easily here unless
    // we use .setPanelOptionsDefaults (deprecated) or ensure the component handles undefined.
    // We will handle undefined in the component by falling back to INITIAL_NODES/LINKS.
});
