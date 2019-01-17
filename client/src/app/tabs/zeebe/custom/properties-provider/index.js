import translate from 'diagram-js/lib/i18n/translate';

import ZeebePropertiesProvider from './ZeebePropertiesProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', ZeebePropertiesProvider ]
};
