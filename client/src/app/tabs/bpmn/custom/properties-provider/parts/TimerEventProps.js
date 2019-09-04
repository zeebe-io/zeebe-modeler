/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import TimerDurationDefinition from './implementation/TimerDurationDefinition';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import TimerEventDefinition from './implementation/TimerEventDefinition';

export default function(group, element, bpmnFactory, options) {

  const timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);
  if (is(element, 'bpmn:StartEvent') && timerEventDefinition) {
    new TimerEventDefinition(group,element,bpmnFactory,timerEventDefinition, [
      { value: 'timeDate', name: 'Date' },
      { value: 'timeCycle', name: 'Cycle' }
    ]);
  } else if (timerEventDefinition && is(element, 'bpmn:BoundaryEvent') && !cancelActivity(element)) {
    new TimerEventDefinition(group,element,bpmnFactory,timerEventDefinition, [
      { value: 'timeDuration', name: 'Duration' },
      { value: 'timeCycle', name: 'Cycle' }
    ]);
  } else if (timerEventDefinition && is(element, 'bpmn:BoundaryEvent') && cancelActivity(element)) {
    new TimerEventDefinition(group,element,bpmnFactory,timerEventDefinition, [
      { value: 'timeDuration', name: 'Duration' }
    ]);
  } else if (timerEventDefinition) {
    new TimerDurationDefinition(group,element,bpmnFactory,timerEventDefinition);
  }
}

function cancelActivity(element) {
  const bo = getBusinessObject(element);
  return bo.cancelActivity;
}

