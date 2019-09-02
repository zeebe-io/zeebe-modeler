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
  query as domQuery
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

describe('customs - replaceMenu', function() {

  const diagramXML = require('./diagram.bpmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  it('should contain options for StartEvent', inject(function(
      popupMenu, elementRegistry) {

    // given
    const startEvent = elementRegistry.get('StartEvent_1');

    openPopup(startEvent);

    const endEventEntry = queryEntry(popupMenu, 'replace-with-none-end'),
          messageStartEntry = queryEntry(popupMenu, 'replace-with-message-start'),
          timerStartEntry = queryEntry(popupMenu, 'replace-with-timer-start');

    // then
    expect(endEventEntry).to.exist;
    expect(messageStartEntry).to.exist;
    expect(timerStartEntry).to.exist;

  }));


  it('should contain options for EndEvent', inject(function(
      popupMenu, elementRegistry) {

    // given
    const endEvent = elementRegistry.get('EndEvent_1');

    openPopup(endEvent);

    const startEventEntry = queryEntry(popupMenu, 'replace-with-none-start');

    // then
    expect(startEventEntry).to.exist;

  }));


  it('should contain options for TimerEvent', inject(function(
      popupMenu, elementRegistry) {

    // given
    const timerEvent = elementRegistry.get('TimerEvent_1');

    openPopup(timerEvent);

    const startEventEntry = queryEntry(popupMenu, 'replace-with-none-start'),
          endEventEntry = queryEntry(popupMenu, 'replace-with-none-end'),
          messageEventEntry = queryEntry(popupMenu, 'replace-with-message-intermediate-catch');


    // then
    expect(startEventEntry).to.exist;
    expect(endEventEntry).to.exist;
    expect(messageEventEntry).to.exist;

  }));


  it('should contain options for MessageEvent', inject(function(
      popupMenu, elementRegistry) {

    // given
    const timerEvent = elementRegistry.get('MessageEvent_1');

    openPopup(timerEvent);

    const startEventEntry = queryEntry(popupMenu, 'replace-with-none-start'),
          endEventEntry = queryEntry(popupMenu, 'replace-with-none-end'),
          timerEventEntry = queryEntry(popupMenu, 'replace-with-timer-intermediate-catch');

    // then
    expect(startEventEntry).to.exist;
    expect(endEventEntry).to.exist;
    expect(timerEventEntry).to.exist;

  }));


  it('should contain options for MessageTask', inject(function(
      popupMenu, elementRegistry) {

    // given
    const messageTask = elementRegistry.get('MessageTask_1');

    openPopup(messageTask);

    const serviceTaskEntry = queryEntry(popupMenu, 'replace-with-service-task'),
          collapsedSubProcessEntry = queryEntry(popupMenu, 'replace-with-collapsed-subprocess'),
          expandedSubProcessEntry = queryEntry(popupMenu, 'replace-with-expanded-subprocess'),
          sequentialMultiInstanceEntry = queryEntry(popupMenu, 'toggle-parallel-mi'),
          parallelMultiInstanceEntry = queryEntry(popupMenu, 'toggle-sequential-mi');

    // then
    expect(serviceTaskEntry).to.exist;
    expect(collapsedSubProcessEntry).to.exist;
    expect(expandedSubProcessEntry).to.exist;
    expect(sequentialMultiInstanceEntry).to.exist;
    expect(parallelMultiInstanceEntry).to.exist;

  }));


  it('should contain options for ServiceTask', inject(function(
      popupMenu, elementRegistry) {

    // given
    const serviceTask = elementRegistry.get('ServiceTask_1');

    openPopup(serviceTask);

    const receiveTaskEntry = queryEntry(popupMenu, 'replace-with-receive-task'),
          collapsedSubProcessEntry = queryEntry(popupMenu, 'replace-with-collapsed-subprocess'),
          expandedSubProcessEntry = queryEntry(popupMenu, 'replace-with-expanded-subprocess'),
          sequentialMultiInstanceEntry = queryEntry(popupMenu, 'toggle-parallel-mi'),
          parallelMultiInstanceEntry = queryEntry(popupMenu, 'toggle-sequential-mi');

    // then
    expect(collapsedSubProcessEntry).to.exist;
    expect(expandedSubProcessEntry).to.exist;
    expect(receiveTaskEntry).to.exist;
    expect(sequentialMultiInstanceEntry).to.exist;
    expect(parallelMultiInstanceEntry).to.exist;

  }));


  it('should contain options for EventBasedGateway', inject(function(
      popupMenu, elementRegistry) {

    // given
    const eventBasedGateway = elementRegistry.get('EventBasedGateway_1');

    openPopup(eventBasedGateway);

    const exclusiveGatewayEntry = queryEntry(popupMenu, 'replace-with-exclusive-gateway'),
          parallelGatewayEntry = queryEntry(popupMenu, 'replace-with-parallel-gateway');

    // then
    expect(exclusiveGatewayEntry).to.exist;
    expect(parallelGatewayEntry).to.exist;

  }));


  it('should contain options for ParallelGateway', inject(function(
      popupMenu, elementRegistry) {

    // given
    const parallelGateway = elementRegistry.get('ParallelGateway_1');

    openPopup(parallelGateway);

    const exclusiveGatewayEntry = queryEntry(popupMenu, 'replace-with-exclusive-gateway'),
          eventBasedGatewayEntry = queryEntry(popupMenu, 'replace-with-event-based-gateway');

    // then
    expect(exclusiveGatewayEntry).to.exist;
    expect(eventBasedGatewayEntry).to.exist;

  }));


  it('should contain options for Exclusive', inject(function(
      popupMenu, elementRegistry) {

    // given
    const exclusiveGateway = elementRegistry.get('ExclusiveGateway_1');

    openPopup(exclusiveGateway);

    const parallelGatewayEntry = queryEntry(popupMenu, 'replace-with-parallel-gateway'),
          eventBasedGatewayEntry = queryEntry(popupMenu, 'replace-with-event-based-gateway');

    // then
    expect(parallelGatewayEntry).to.exist;
    expect(eventBasedGatewayEntry).to.exist;

  }));


  it('should contain options for (collapsed) SubProcess', inject(function(
      popupMenu, elementRegistry) {

    // given
    const subProcess = elementRegistry.get('SubProcess_1');

    openPopup(subProcess);

    const receiveTaskEntry = queryEntry(popupMenu, 'replace-with-receive-task'),
          serviceTaskEntry = queryEntry(popupMenu, 'replace-with-service-task'),
          expandedSubProcessEntry = queryEntry(popupMenu, 'replace-with-expanded-subprocess'),
          sequentialMultiInstanceEntry = queryEntry(popupMenu, 'toggle-parallel-mi'),
          parallelMultiInstanceEntry = queryEntry(popupMenu, 'toggle-sequential-mi');

    // then
    expect(serviceTaskEntry).to.exist;
    expect(expandedSubProcessEntry).to.exist;
    expect(receiveTaskEntry).to.exist;
    expect(sequentialMultiInstanceEntry).to.exist;
    expect(parallelMultiInstanceEntry).to.exist;

  }));


  it('should contain options for (expanded) SubProcess', inject(function(
      popupMenu, elementRegistry) {

    // given
    const subProcess = elementRegistry.get('SubProcess_2');

    openPopup(subProcess);

    const collapsedSubProcessEntry = queryEntry(popupMenu, 'replace-with-collapsed-subprocess'),
          sequentialMultiInstanceEntry = queryEntry(popupMenu, 'toggle-parallel-mi'),
          parallelMultiInstanceEntry = queryEntry(popupMenu, 'toggle-sequential-mi');

    // then
    expect(collapsedSubProcessEntry).to.exist;
    expect(sequentialMultiInstanceEntry).to.exist;
    expect(parallelMultiInstanceEntry).to.exist;

  }));

});


// helper //////////

const queryEntry = (popupMenu, id) => {
  return domQuery('[data-id="' + id + '"]', popupMenu._current.container);
};

const openPopup = (element, offset) => {
  offset = offset || 100;

  getBpmnJS().invoke(function(popupMenu) {

    popupMenu.open(element, 'bpmn-replace', {
      x: element.x + offset, y: element.y + offset
    });

  });
};