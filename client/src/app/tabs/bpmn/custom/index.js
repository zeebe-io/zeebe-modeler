/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import CustomPaletteProvider from './CustomPaletteProvider';
import CustomReplaceMenuProvider from './CustomReplaceMenuProvider';
import CustomContextPadProvider from './CustomContextPadProvider';
import CustomRules from './CustomRules';

export default {
  __init__: [ 'bpmnRules','paletteProvider', 'contextPadProvider', 'replaceMenuProvider'],
  bpmnRules: [ 'type', CustomRules ],
  paletteProvider: [ 'type', CustomPaletteProvider ],
  replaceMenuProvider: [ 'type', CustomReplaceMenuProvider ],
  contextPadProvider: [ 'type', CustomContextPadProvider ],
};
