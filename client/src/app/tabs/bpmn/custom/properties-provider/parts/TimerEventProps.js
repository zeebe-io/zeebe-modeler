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

import timerEventDefinitionImpl from './implementation/TimerEventDefinition';

import timerDurationDefinitionImpl from './implementation/TimerDurationDefinition';

export default function(group, element, bpmnFactory) {

  const timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);

  const timerOptions = getTimerOptions(element);

  if (!timerEventDefinition) {
    return;
  }

  if (!timerOptions.length) {
    return timerDurationDefinitionImpl(group, bpmnFactory, timerEventDefinition);
  }

  timerEventDefinitionImpl(group, bpmnFactory, timerEventDefinition, timerOptions);
}

// helper //////////

const cancelActivity = (element) => {
  const bo = getBusinessObject(element);
  return bo.cancelActivity;
};

const getTimerOptions = (element) => {
  let timerOptions = [];

  if (is(element, 'bpmn:BoundaryEvent')) {

    timerOptions = [
      ...timerOptions,
      { value: 'timeDuration', name: 'Duration' }
    ];

    if (!cancelActivity(element)) {
      timerOptions = [
        ...timerOptions,
        { value: 'timeCycle', name: 'Cycle' }
      ];
    }
  }

  if (is(element, 'bpmn:StartEvent')) {
    timerOptions = [
      ...timerOptions,
      { value: 'timeDate', name: 'Date' },
      { value: 'timeCycle', name: 'Cycle' }
    ];
  }

  return timerOptions;
};

