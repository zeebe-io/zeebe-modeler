module.exports = {
  __init__: [  'paletteProvider', 'customRules', 'contextPadProvider', 'replaceMenuProvider' ],
  elementFactory: [ 'type', require('./CustomElementFactory') ],
  paletteProvider: [ 'type', require('./CustomPalette') ],
  customRules: [ 'type', require('./CustomRules') ],
  replaceMenuProvider: [ 'type', require('./CustomReplaceMenuProvider') ],
  contextPadProvider: [ 'type', require('./CustomContextPadProvider') ]
};
