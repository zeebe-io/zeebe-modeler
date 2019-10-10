/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import {
  bootstrapModeler,
  getBpmnJS,
  inject
} from 'bpmn-js/test/helper';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  createMoveEvent
} from 'diagram-js/lib/features/mouse/Mouse';

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

  it('should provide zeebe related entries', inject(function(canvas) {

    // when
    const paletteElement = domQuery('.djs-palette', canvas._container);
    const entries = domQueryAll('.entry', paletteElement);

    // then
    expect(entries.length).to.equal(12);
  }));


  it('should activate hand tool', inject(function(dragging) {

    // when
    triggerPaletteEntry('hand-tool');

    // then
    const context = dragging.context(),
          prefix = context.prefix;

    expect(prefix).to.equal('hand');
  }));


  it('should activate lasso tool', inject(function(dragging) {

    // when
    triggerPaletteEntry('lasso-tool');

    // then
    const context = dragging.context(),
          prefix = context.prefix;

    expect(prefix).to.equal('lasso.selection');
  }));


  it('should activate space tool', inject(function(dragging) {

    // when
    triggerPaletteEntry('space-tool');

    // then
    const context = dragging.context(),
          prefix = context.prefix;

    expect(prefix).to.equal('spaceTool.selection');
  }));


  it('should activate global-connect tool', inject(function(dragging) {

    // when
    triggerPaletteEntry('global-connect-tool');

    // then
    const context = dragging.context(),
          prefix = context.prefix;

    expect(prefix).to.equal('global-connect');
  }));


  it('should create start event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.start-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:StartEvent')).to.be.true;
  }));


  it('should create intermediate event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.intermediate-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:IntermediateThrowEvent')).to.be.true;
  }));


  it('should create end event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.end-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:EndEvent')).to.be.true;
  }));


  it('should create exclusive gateway', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.exclusive-gateway');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:ExclusiveGateway')).to.be.true;
  }));


  it('should create task', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.task');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:Task')).to.be.true;
  }));


  it('should create subprocess with start event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.subprocess-expanded');

    // then
    const context = dragging.context(),
          elements = context.data.elements,
          subProcess = elements[0],
          startEvent = elements[1],
          bo = getBusinessObject(subProcess);

    expect(subProcess).to.exist;
    expect(is(subProcess, 'bpmn:SubProcess')).to.be.true;
    expect(bo.di.isExpanded).to.be.true;

    expect(startEvent).to.exist;
    expect(is(startEvent, 'bpmn:StartEvent')).to.be.true;
  }));


  it('should create participant', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.participant-expanded');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(is(elements[0], 'bpmn:Participant')).to.be.true;
  }));


  it('should create group', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.group');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(is(elements[0], 'bpmn:Group')).to.be.true;
  }));

});

// helper //////////

function triggerPaletteEntry(id) {
  getBpmnJS().invoke(function(palette) {
    var entry = palette.getEntries()[ id ];

    if (entry && entry.action && entry.action.click) {
      entry.action.click(createMoveEvent(0, 0));
    }
  });
}