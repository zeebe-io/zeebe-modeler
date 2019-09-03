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
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import multiInstanceLoopCharacteristics from './implementation/MultiInstanceLoopCharacteristics';

export default function(group, element, bpmnFactory, translate) {

  if (!ensureMultiInstanceSupported(element)) {
    return;
  }

  group.entries = group.entries.concat(multiInstanceLoopCharacteristics(element, bpmnFactory, translate));
}

// helpers //////////////

function getLoopCharacteristics(element) {
  const bo = getBusinessObject(element);
  return bo.loopCharacteristics;
}

function ensureMultiInstanceSupported(element) {
  return !!getLoopCharacteristics(element);
}
