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
