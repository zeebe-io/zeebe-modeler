import CustomPaletteProvider from './CustomPaletteProvider';
import CustomReplaceMenuProvider from './CustomReplaceMenuProvider';
import CustomContextPadProvider from './CustomContextPadProvider';

export default {
  __init__: [ 'paletteProvider', 'contextPadProvider', 'replaceMenuProvider' ],
  paletteProvider: [ 'type', CustomPaletteProvider ],
  replaceMenuProvider: [ 'type', CustomReplaceMenuProvider ],
  contextPadProvider: [ 'type', CustomContextPadProvider ]
};
