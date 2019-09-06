/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 15000;

/**
 * BPMN specific create zeebe boundary event behavior
 */
export default function CreateZeebeBoundaryEventBehavior(
    eventBus, elementFactory, bpmnFactory) {

  CommandInterceptor.call(this, eventBus);

  /**
   * replace intermediate catch event with boundary event when
   * attaching it to a shape
   */
  this.preExecute('shape.create', HIGH_PRIORITY, function(context) {
    const {
      shape,
      host
    } = context;

    const businessObject = getBusinessObject(shape);

    let attrs = {
      cancelActivity: true
    };

    let newBusinessObject,
        hostBusinessObject,
        boundaryEvent,
        eventDefinitions;

    if (!host || !is(shape, 'bpmn:IntermediateCatchEvent')) {
      return;
    }

    hostBusinessObject = getBusinessObject(host);

    attrs = {
      attachedToRef: hostBusinessObject,
      ...attrs
    };

    eventDefinitions = businessObject.eventDefinitions;

    newBusinessObject = bpmnFactory.create('bpmn:BoundaryEvent', attrs);

    boundaryEvent = {
      type: 'bpmn:BoundaryEvent',
      businessObject: newBusinessObject,
    };

    if (eventDefinitions && eventDefinitions[0]) {
      boundaryEvent = {
        ...boundaryEvent,
        eventDefinitionType: eventDefinitions[0].$type
      };
    }

    context.shape = elementFactory.createShape(boundaryEvent);

  }, true);
}


CreateZeebeBoundaryEventBehavior.$inject = [
  'eventBus',
  'elementFactory',
  'bpmnFactory'
];

inherits(CreateZeebeBoundaryEventBehavior, CommandInterceptor);
