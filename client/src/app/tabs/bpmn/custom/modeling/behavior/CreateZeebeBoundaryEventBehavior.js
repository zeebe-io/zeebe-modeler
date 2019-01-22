import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 15000;

/**
 * BPMN specific create zeebe boundary event behavior
 */
export default function CreateZeebeBoundaryEventBehavior(
    eventBus, modeling, elementFactory,
    bpmnFactory) {

  CommandInterceptor.call(this, eventBus);

  /**
   * replace intermediate catch event with boundary event when
   * attaching it to a shape
   */

  this.preExecute('shape.create',HIGH_PRIORITY, function(context) {
    const shape = context.shape,
          host = context.host;

    let businessObject,
        boundaryEvent;

    const attrs = {
      cancelActivity: true
    };

    if (host && is(shape, 'bpmn:IntermediateCatchEvent')) {
      attrs.attachedToRef = host.businessObject;

      businessObject = bpmnFactory.create('bpmn:BoundaryEvent', attrs);

      if (shape.businessObject.eventDefinitions && shape.businessObject.eventDefinitions[0]) {
        boundaryEvent = {
          type: 'bpmn:BoundaryEvent',
          businessObject: businessObject,
          eventDefinitionType: shape.businessObject.eventDefinitions[0].$type
        };

      } else {
        boundaryEvent = {
          type: 'bpmn:BoundaryEvent',
          businessObject: businessObject
        };

      }

      context.shape = elementFactory.createShape(boundaryEvent);
    }
  }, true);
}


CreateZeebeBoundaryEventBehavior.$inject = [
  'eventBus',
  'modeling',
  'elementFactory',
  'bpmnFactory'
];

inherits(CreateZeebeBoundaryEventBehavior, CommandInterceptor);
