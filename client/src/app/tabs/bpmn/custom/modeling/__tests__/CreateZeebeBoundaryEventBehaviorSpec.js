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
  inject
} from 'bpmn-js/test/helper';

import modelingModule from 'bpmn-js/lib/features/modeling';
import coreModule from 'bpmn-js/lib/core';
import contextPadModule from 'bpmn-js/lib/features/context-pad';
import paletteModule from 'bpmn-js/lib/features/palette';

import customModelingModule from '..';
import customModules from '../../';

describe('features/modeling/behavior - create boundary events', function() {

  const testModules = [
    coreModule,
    contextPadModule,
    paletteModule,
    modelingModule,
    customModelingModule,
    customModules
  ];

  const processDiagramXML = require('./process-empty.bpmn');

  beforeEach(bootstrapModeler(processDiagramXML, { modules: testModules }));

  it('should execute on attach', inject(function(canvas, elementFactory, modeling, bpmnFactory) {

    // given
    const messageEventDefinition = bpmnFactory.create('bpmn:MessageEventDefinition');

    const messageIntermediateCatchEvent = bpmnFactory.create('bpmn:IntermediateCatchEvent', {
      eventDefinitions: [ messageEventDefinition ]
    });

    const intermediateEvent = elementFactory.create('shape', {
      id: messageIntermediateCatchEvent.id,
      businessObject: messageIntermediateCatchEvent
    });

    const rootElement = canvas.getRootElement(),
          task = elementFactory.createShape({ type: 'bpmn:Task' });

    modeling.createShape(task, { x: 100, y: 100 }, rootElement);

    // when
    const newEvent = modeling.createShape(intermediateEvent, { x: 50 + 15, y: 100 }, task, { attach: true });

    // then
    expect(newEvent.type).to.equal('bpmn:BoundaryEvent');
    expect(newEvent.businessObject.attachedToRef).to.equal(task.businessObject);
    expect(newEvent.businessObject.eventDefinitions[0]).to.not.be.null;
  }));


  it('should execute on attach (without event definition)', inject(
    function(canvas, elementFactory, modeling, bpmnFactory) {

      // given
      const messageIntermediateCatchEvent = bpmnFactory.create('bpmn:IntermediateCatchEvent');

      const intermediateEvent = elementFactory.create('shape', {
        id: messageIntermediateCatchEvent.id,
        businessObject: messageIntermediateCatchEvent
      });

      const rootElement = canvas.getRootElement(),
            task = elementFactory.createShape({ type: 'bpmn:Task' });

      modeling.createShape(task, { x: 100, y: 100 }, rootElement);

      // when
      const newEvent = modeling.createShape(intermediateEvent, { x: 50 + 15, y: 100 }, task, { attach: true });

      // then
      expect(newEvent.type).to.equal('bpmn:BoundaryEvent');
      expect(newEvent.businessObject.attachedToRef).to.equal(task.businessObject);
      expect(newEvent.businessObject.eventDefinitions).to.be.undefined;
    }
  ));


  it('should NOT execute on drop', inject(function(canvas, elementFactory, modeling) {

    // given
    const rootElement = canvas.getRootElement(),
          subProcess = elementFactory.createShape({ type: 'bpmn:SubProcess', isExpanded: true }),
          intermediateEvent = elementFactory.createShape({ type: 'bpmn:IntermediateCatchEvent' });

    modeling.createShape(subProcess, { x: 300, y: 200 }, rootElement);

    // when
    const newEvent = modeling.createShape(intermediateEvent, { x: 300, y: 200 }, subProcess);

    // then
    expect(newEvent).to.exist;
    expect(newEvent.type).to.equal('bpmn:IntermediateCatchEvent');
  }));

});