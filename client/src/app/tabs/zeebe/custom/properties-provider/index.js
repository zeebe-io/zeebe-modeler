import elementTemplates from 'bpmn-js-properties-panel/lib/provider/camunda/element-templates';

import translate from 'diagram-js/lib/i18n/translate';

import ZeebePropertiesProvider from './ZeebePropertiesProvider';

export default {
  __depends__: [
    elementTemplates,
    translate
  ],
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', ZeebePropertiesProvider ]
};
