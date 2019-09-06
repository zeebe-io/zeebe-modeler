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
  isString
} from 'min-dash';

import coreModule from 'bpmn-js/lib/core';
import modelingModule from 'bpmn-js/lib/features/modeling';
import contextPadModule from 'bpmn-js/lib/features/context-pad';
import paletteModule from 'bpmn-js/lib/features/palette';

import customModules from '../';

const testModules = [
  coreModule,
  paletteModule,
  contextPadModule,
  modelingModule,
  customModules
];

describe('customs - rules', function() {

  describe('event create', function() {

    const diagramXML = require('./diagram.bpmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    it('should attach IntermediateThrowEvent to Task', inject(function(elementFactory) {

      // given
      const eventShape = elementFactory.createShape({
        type: 'bpmn:IntermediateThrowEvent'
      });

      // then
      expectCanAttach([ eventShape ], 'ServiceTask_1', {
        attach: 'attach'
      });
    }));


    it('should attach MessageEvent to Task', inject(function(elementFactory, bpmnFactory) {

      // given
      const messageEventDefinition = bpmnFactory.create('bpmn:MessageEventDefinition');

      const messageIntermediateCatchEvent = bpmnFactory.create('bpmn:IntermediateCatchEvent', {
        eventDefinitions: [ messageEventDefinition ]
      });

      const eventShape = elementFactory.createShape({
        id: messageIntermediateCatchEvent.id,
        businessObject: messageIntermediateCatchEvent
      });

      // then
      expectCanAttach([ eventShape ], 'ServiceTask_1', {
        attach: 'attach'
      });

    }));


    it('should attach TimerEvent to Task', inject(function(elementFactory, bpmnFactory) {

      // given
      const timerEventDefinition = bpmnFactory.create('bpmn:TimerEventDefinition');

      const timerIntermediateCatchEvent = bpmnFactory.create('bpmn:IntermediateCatchEvent', {
        eventDefinitions: [ timerEventDefinition ]
      });

      const eventShape = elementFactory.createShape({
        id: timerIntermediateCatchEvent.id,
        businessObject: timerIntermediateCatchEvent
      });

      // then
      expectCanAttach([ eventShape ], 'ServiceTask_1', {
        attach: 'attach'
      });

    }));


    it('should NOT attach non-boundary to Task', inject(function(elementFactory) {

      // given
      const taskShape = elementFactory.createShape({
        type: 'bpmn:ReceiveTask'
      });

      // then
      expectCanAttach([ taskShape ], 'ServiceTask_1', {
        attach: false
      });
    }));


    it('should NOT attach multiple at a time to Task', inject(function(elementFactory) {

      // given
      const eventShape1 = elementFactory.createShape({
        type: 'bpmn:IntermediateThrowEvent'
      });

      const eventShape2 = elementFactory.createShape({
        type: 'bpmn:IntermediateThrowEvent'
      });

      // then
      expectCanAttach([ eventShape1, eventShape2 ], 'ServiceTask_1', {
        attach: false
      });
    }));


    it('should NOT attach label to Task', inject(function(elementFactory) {

      // given
      const labelElement = elementFactory.createShape({
        type: 'bpmn:FlowNode',
        labelTarget: {}
      });

      // then
      expectCanAttach([ labelElement ], 'ServiceTask_1', {
        attach: false
      });
    }));


    it('should NOT attach to non compensation activity', inject(function(elementFactory) {

      // given
      const eventShape = elementFactory.createShape({
        type: 'bpmn:IntermediateThrowEvent'
      });

      // then
      expectCanAttach([ eventShape ], 'MessageEvent_1', {
        attach: false
      });
    }));


    it('should NOT attach to ReceiveTask after EventBasedGateway ', inject(function(elementFactory) {

      // given
      const eventShape = elementFactory.createShape({
        type: 'bpmn:IntermediateThrowEvent'
      });

      // then
      expectCanAttach([ eventShape ], 'MessageTask_2', {
        attach: false
      });
    }));


    it('should NOT attach BoundaryEvent to EventSubProcess ', inject(function(elementFactory) {

      // given
      const eventShape = elementFactory.createShape({
        type: 'bpmn:BoundaryEvent'
      });

      // then
      expectCanAttach([ eventShape ], 'EventSubProcess1', {
        attach: false
      });
    }));


  });

});


// helper //////////

/**
 * Retrieve element, resolving an ID with
 * the actual element.
 */
const get = (element) => {

  let actualElement;

  if (isString(element)) {
    actualElement = getBpmnJS().invoke(function(elementRegistry) {
      return elementRegistry.get(element);
    });

    if (!actualElement) {
      throw new Error('element #' + element + ' not found');
    }

    return actualElement;
  }

  return element;
};

const expectCanAttach = (elements, target, rules) => {

  let results = {};

  getBpmnJS().invoke(function(bpmnRules) {

    target = get(target);

    if ('attach' in rules) {
      results.attach = bpmnRules.canAttach(elements, target);
    }
  });

  expect(results).to.eql(rules);
};
