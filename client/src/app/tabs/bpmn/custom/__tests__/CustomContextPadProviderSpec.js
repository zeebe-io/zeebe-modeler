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

  describe('available entries', function() {

    const diagramXML = require('./diagram.bpmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    function expectContextPadEntries(elementOrId, expectedEntries) {

      getBpmnJS().invoke(function(elementRegistry, contextPad) {

        const element = typeof elementOrId === 'string' ? elementRegistry.get(elementOrId) : elementOrId;

        contextPad.open(element, true);

        const entries = contextPad._current.entries;

        expectedEntries.forEach(function(name) {

          if (name.charAt(0) === '!') {
            name = name.substring(1);

            expect(entries).not.to.have.property(name);
          } else {
            expect(entries).to.have.property(name);
          }
        });
      });
    }

    it('should provide ServiceTask entries', inject(function() {

      expectContextPadEntries('ServiceTask_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);

    }));


    it('should provide MessageTask entries', inject(function() {

      expectContextPadEntries('MessageTask_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide SubProcess entries', inject(function() {

      expectContextPadEntries('SubProcess_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide TimerEvent entries', inject(function() {

      expectContextPadEntries('TimerEvent_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide MessageEvent entries', inject(function() {

      expectContextPadEntries('MessageEvent_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide StartEvent entries', inject(function() {

      expectContextPadEntries('StartEvent_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide EndEvent entries', inject(function() {

      expectContextPadEntries('EndEvent_1', [
        'connect',
        'replace',
        '!append.end-event',
        '!append.gateway',
        '!append.append-service-task',
        '!append.append-send-task',
        '!append.append-message-event',
        '!append.append-timer-event'
      ]);
    }));


    it('should provide EventBasedGateway entries', inject(function() {

      expectContextPadEntries('EventBasedGateway_1', [
        'connect',
        'replace',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide ExclusiveGateway entries', inject(function() {

      expectContextPadEntries('ExclusiveGateway_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));


    it('should provide ParallelGateway entries', inject(function() {

      expectContextPadEntries('ParallelGateway_1', [
        'connect',
        'replace',
        'append.end-event',
        'append.gateway',
        'append.append-service-task',
        'append.append-send-task',
        'append.append-message-event',
        'append.append-timer-event'
      ]);
    }));

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
      const event = padEvent('append.append-service-task');

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
      const event = padEvent('append.append-service-task');

      // when
      contextPad.trigger('click', event);

      // then
      expect(dragging.context()).to.exist;
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