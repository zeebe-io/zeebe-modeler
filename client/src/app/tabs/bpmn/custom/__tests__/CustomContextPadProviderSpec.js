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

import {
  forEach
} from 'min-dash';

import coreModule from 'bpmn-js/lib/core';
import modelingModule from 'bpmn-js/lib/features/modeling';
import paletteModule from 'bpmn-js/lib/features/palette';
import contextPadModule from 'bpmn-js/lib/features/context-pad';
import autoPlaceModule from 'bpmn-js/lib/features/auto-place';

import customModules from '../';

const testModules = [
  coreModule,
  paletteModule,
  contextPadModule,
  customModules,
  modelingModule
];

describe('customs - context-pad', function() {

  describe('expected entries', function() {

    const diagramXML = require('./CustomContextPadProvider.bpmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    function getContextPadEntries(elementId) {
      let entries;

      getBpmnJS().invoke(function(elementRegistry, contextPad) {
        const element = elementRegistry.get(elementId);

        contextPad.open(element, true);

        entries = contextPad._current.entries;
      });

      return Object.keys(entries);
    }

    it('should not provide any entries for labels', function() {
      expect(getContextPadEntries('StartEvent_1_label')).to.be.empty;
    });


    it('should provide entries for StartEvents', function() {

      const eventIds = [ 'StartEvent_1', 'MessageStartEvent_1', 'ErrorStartEvent_1', 'TimerStartEvent_1' ];

      forEach(eventIds, (id) => {
        expect(getContextPadEntries(id)).to.be.eql([
          'append.end-event',
          'append.gateway',
          'append.append-task',
          'append.intermediate-event',
          'replace',
          'append.text-annotation',
          'connect',
          'delete'
        ]);
      });
    });


    it('should provide entries for IntermediateEvents', function() {

      const eventIds = [ 'MessageStartEventNonInterrupting_1', 'TimerStartEventNonInterrupting_1' ];

      forEach(eventIds, (id) => {
        expect(getContextPadEntries(id)).to.be.eql([
          'append.end-event',
          'append.gateway',
          'append.append-task',
          'append.intermediate-event',
          'replace',
          'append.text-annotation',
          'connect',
          'delete'
        ]);
      });
    });


    it('should provide entries for Tasks', function() {

      const taskIds = [ 'Task_1', 'ServiceTask_1', 'ReceiveTask_1' ];

      forEach(taskIds, (id) => {
        expect(getContextPadEntries(id)).to.be.eql([
          'append.end-event',
          'append.gateway',
          'append.append-task',
          'append.intermediate-event',
          'replace',
          'append.text-annotation',
          'connect',
          'delete'
        ]);
      });
    });


    it('should provide entries for SubProcesses', function() {

      const processIds = [ 'SubProcessCollapsed_1', 'SubProcessExpanded_1' ];

      forEach(processIds, (id) => {
        expect(getContextPadEntries(id)).to.be.eql([
          'append.end-event',
          'append.gateway',
          'append.append-task',
          'append.intermediate-event',
          'replace',
          'append.text-annotation',
          'connect',
          'delete'
        ]);
      });
    });


    it('should provide entries for EndEvents', function() {
      expect(getContextPadEntries('EndEvent_1')).to.be.eql([
        'replace',
        'append.text-annotation',
        'connect',
        'delete'
      ]);
    });


    it('should provide entries for ExclusiveGateways', function() {
      expect(getContextPadEntries('ExclusiveGateway_1')).to.be.eql([
        'append.end-event',
        'append.gateway',
        'append.append-task',
        'append.intermediate-event',
        'replace',
        'append.text-annotation',
        'connect',
        'delete'
      ]);
    });


    it('should provide entries for ParallelGateways', function() {
      expect(getContextPadEntries('ParallelGateway_1')).to.be.eql([
        'append.end-event',
        'append.gateway',
        'append.append-task',
        'append.intermediate-event',
        'replace',
        'append.text-annotation',
        'connect',
        'delete'
      ]);
    });


    it('should provide entries for EventBasedGateways', function() {
      expect(getContextPadEntries('EventBasedGateway_1')).to.be.eql([
        'append.message-intermediate-event',
        'append.timer-intermediate-event',
        'replace',
        'append.text-annotation',
        'connect',
        'delete'
      ]);
    });


    it('should provide entries for Groups', function() {
      expect(getContextPadEntries('Group_1')).to.be.eql([
        'append.text-annotation',
        'delete'
      ]);
    });


    it('should provide entries for TextAnnotations', function() {
      expect(getContextPadEntries('TextAnnotation_1')).to.be.eql([
        'delete'
      ]);
    });


    it('should provide entries for Participants', function() {
      expect(getContextPadEntries('Participant_1')).to.be.eql([
        'lane-insert-above',
        'lane-divide-two',
        'lane-divide-three',
        'lane-insert-below',
        'replace',
        'append.text-annotation',
        'connect',
        'delete'
      ]);
    });


    it('should work for Lane', function() {
      expect(getContextPadEntries('Lane_1')).to.be.eql([
        'lane-insert-above',
        'lane-divide-two',
        'lane-divide-three',
        'lane-insert-below',
        'delete'
      ]);
    });


    it('should work for BoundaryEvents', function() {

      const eventIds = [ 'BoundaryEvent_1', 'MessageBoundaryEvent_1' ];

      forEach(eventIds, (id) => {
        expect(getContextPadEntries(id)).to.be.eql([
          'append.end-event',
          'append.gateway',
          'append.append-task',
          'append.intermediate-event',
          'replace',
          'append.text-annotation',
          'connect',
          'delete'
        ]);
      });
    });


    it('should work for EventSubProcesses', function() {
      expect(getContextPadEntries('EventSubProcess_1')).to.be.eql([
        'replace',
        'append.text-annotation',
        'connect',
        'delete'
      ]);
    });
  });


  describe('auto place', function() {
    const diagramXML = require('./diagram.bpmn');

    beforeEach(bootstrapModeler(diagramXML, {
      modules: testModules.concat(autoPlaceModule)
    }));

    it('should trigger', inject(function(elementRegistry, contextPad) {

      // given
      const element = elementRegistry.get('ServiceTask_1');

      contextPad.open(element);

      // mock event
      const event = padEvent('append.append-task');

      // when
      contextPad.trigger('click', event);

      // then
      expect(element.outgoing).to.have.length(1);
    }));
  });


  describe('disabled auto place', function() {

    const diagramXML = require('./diagram.bpmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    it('should default to drag start', inject(function(elementRegistry, contextPad, dragging) {

      // given
      const element = elementRegistry.get('ServiceTask_1');

      contextPad.open(element);

      // mock event
      const event = padEvent('append.append-task');

      // when
      contextPad.trigger('click', event);

      // then
      expect(dragging.context()).to.exist;
    }));


    it('should set source on drag start', inject(function(elementRegistry, contextPad, dragging) {

      // given
      const element = elementRegistry.get('ServiceTask_1');

      contextPad.open(element);

      // mock event
      const event = padEvent('append.append-task');

      // when
      contextPad.trigger('click', event);

      const draggingContext = dragging.context();

      const {
        source
      } = draggingContext.data.context;

      // then
      expect(source).to.eql(element);
    }));
  });
});


// helper //////////

const padEntry = (element, name) => {
  return domQuery('[data-action="' + name + '"]', element);
};

const padEvent = entry => {

  return getBpmnJS().invoke(function(overlays) {

    const target = padEntry(overlays._overlayRoot, entry);

    return {
      target: target,
      preventDefault: () => {},
      clientX: 100,
      clientY: 100
    };
  });
};
