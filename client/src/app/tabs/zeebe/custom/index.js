import CustomPalette from './CustomPalette';
import CustomReplaceMenuProvider from './CustomReplaceMenuProvider';
import CustomContextPadProvider from './CustomContextPadProvider';

export default {
  __init__: [ 'paletteProvider', 'contextPadProvider', 'replaceMenuProvider' ],
  paletteProvider: [ 'type', CustomPalette ],
  replaceMenuProvider: [ 'type', CustomReplaceMenuProvider ],
  contextPadProvider: [ 'type', CustomContextPadProvider ]
};
