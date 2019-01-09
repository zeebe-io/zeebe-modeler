import {
  bootstrapModeler,
  inject
} from 'bpmn-js/test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import coreModule from 'bpmn-js/lib/core';
import modelingModule from 'bpmn-js/lib/features/modeling';
import contextPadModule from 'bpmn-js/lib/features/context-pad';
import paletteModule from 'bpmn-js/lib/features/palette';

import customModules from '../';

const testModules = [
  coreModule,
  paletteModule,
  contextPadModule,
  customModules,
  modelingModule
];

describe('customs - palette', function() {

  const diagramXML = require('./diagram.bpmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  it('should provide zeebe related entries', inject(function(canvas, palette) {

    // when
    const paletteElement = domQuery('.djs-palette', canvas._container);
    const entries = domQueryAll('.entry', paletteElement);

    // then
    expect(entries.length).to.equal(13);

  }));


});