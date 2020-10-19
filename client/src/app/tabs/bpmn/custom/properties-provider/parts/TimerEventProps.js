/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';

import timerEventDefinitionImpl from './implementation/TimerEventDefinition';

import timerDurationDefinitionImpl from './implementation/TimerDurationDefinition';

export default function(group, element, bpmnFactory, translate) {

  const timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);

  const timerOptions = getTimerOptions(element);

  if (!timerEventDefinition) {
    return;
  }

  if (!timerOptions.length) {
    return timerDurationDefinitionImpl(group, bpmnFactory, timerEventDefinition, translate);
  }

  timerEventDefinitionImpl(group, bpmnFactory, timerEventDefinition, timerOptions, translate);
}


// helper //////////

const cancelActivity = (element) => {
  const bo = getBusinessObject(element);
  return bo.cancelActivity;
};

const isInterrupting = (element) => {
  const bo = getBusinessObject(element);
  return bo.isInterrupting !== false;
};

const getTimerOptions = (element) => {
  let timerOptions = [];

  const isStartEvent = is(element, 'bpmn:StartEvent');
  const isBoundaryEvent = is(element, 'bpmn:BoundaryEvent');

  const hasEventSubprocessParent = isEventSubProcess(element.parent);

  if (isBoundaryEvent || hasEventSubprocessParent) {
    timerOptions = [
      ...timerOptions,
      { value: 'timeDuration', name: 'Duration' }
    ];

    if (!cancelActivity(element) && !(hasEventSubprocessParent && isInterrupting(element))) {
      timerOptions = [
        ...timerOptions,
        { value: 'timeCycle', name: 'Cycle' }
      ];
    }
  }

  if (isStartEvent && !hasEventSubprocessParent) {
    timerOptions = [
      ...timerOptions,
      { value: 'timeDate', name: 'Date' },
      { value: 'timeCycle', name: 'Cycle' }
    ];
  }

  return timerOptions;
};
