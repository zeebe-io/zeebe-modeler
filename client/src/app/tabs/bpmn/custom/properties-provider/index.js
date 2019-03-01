/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import translate from 'diagram-js/lib/i18n/translate';

import ZeebePropertiesProvider from './ZeebePropertiesProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', ZeebePropertiesProvider ]
};
