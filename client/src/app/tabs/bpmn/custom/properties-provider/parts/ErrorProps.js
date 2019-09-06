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

import error from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/ErrorEventDefinition';

export default function(group, element, bpmnFactory, translate) {

  const errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(element);

  if (errorEventDefinition) {
    error(group, element, bpmnFactory, errorEventDefinition, translate);
  }

}
