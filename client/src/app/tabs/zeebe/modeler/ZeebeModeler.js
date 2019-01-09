import BpmnModeler from 'bpmn-js/lib/Modeler';

import diagramOriginModule from 'diagram-js-origin';
import minimapModule from 'diagram-js-minimap';

import executableFixModule from './features/executable-fix';
import globalClipboardModule from './features/global-clipboard';

import signavioCompatModule from 'bpmn-js-signavio-compat';

import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '../custom/propertyprovider';

import zeebeModdleExtension from '../custom/zeebe-bpmn-moddle/zeebe';

import zeebeCustoms from '../custom';

import 'bpmn-js-properties-panel/styles/properties.less';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import 'diagram-js-minimap/assets/diagram-js-minimap.css';


export default class ZeebeModeler extends BpmnModeler {

  constructor(options = {}) {

    const {
      moddleExtensions,
      ...otherOptions
    } = options;

    super({
      ...otherOptions,
      moddleExtensions: {
        zeebe: zeebeModdleExtension,
        ...(moddleExtensions || {})
      }
    });
  }
}

const defaultModules = BpmnModeler.prototype._modules;

const extensionModules = [
  diagramOriginModule,
  minimapModule,
  executableFixModule,
  globalClipboardModule,
  signavioCompatModule,
  propertiesPanelModule,
  propertiesProviderModule,
  zeebeModdleExtension,
  zeebeCustoms
];

ZeebeModeler.prototype._modules = [
  ...defaultModules,
  ...extensionModules
];