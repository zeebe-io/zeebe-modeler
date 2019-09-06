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


  it('should create start event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.start-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:StartEvent')).to.be.true;
  }));


  it('should create end task', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.end-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:EndEvent')).to.be.true;
  }));


  it('should create service task', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.service-task');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:ServiceTask')).to.be.true;
  }));


  it('should create receive task', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.receive-task');

    // then
    const context = dragging.context(),
          elements = context.data.elements;

    expect(elements).to.exist;
    expect(is(elements[0], 'bpmn:ReceiveTask')).to.be.true;
  }));


  it('should create subprocess (expanded)', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.subprocess-expanded');

    // then
    const context = dragging.context(),
          elements = context.data.elements,
          element = elements[0],
          bo = getBusinessObject(element);

    expect(element).to.exist;
    expect(is(element, 'bpmn:SubProcess')).to.be.true;
    expect(bo.di.isExpanded).to.be.true;
  }));


  it('should intermediate catch message event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.intermediate-catch-message-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements,
          element = elements[0],
          bo = getBusinessObject(element),
          eventDefinitions = bo.eventDefinitions;

    expect(element).to.exist;
    expect(is(element, 'bpmn:IntermediateCatchEvent')).to.be.true;
    expect(eventDefinitions).to.exist;
    expect(eventDefinitions[0].$type).to.equal('bpmn:MessageEventDefinition');
  }));


  it('should intermediate catch timer event', inject(function(dragging) {

    // when
    triggerPaletteEntry('create.intermediate-catch-timer-event');

    // then
    const context = dragging.context(),
          elements = context.data.elements,
          element = elements[0],
          bo = getBusinessObject(element),
          eventDefinitions = bo.eventDefinitions;

    expect(element).to.exist;
    expect(is(element, 'bpmn:IntermediateCatchEvent')).to.be.true;
    expect(eventDefinitions).to.exist;
    expect(eventDefinitions[0].$type).to.equal('bpmn:TimerEventDefinition');
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