/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import inputOutput from './implementation/InputOutput';

export default function(group, element, bpmnFactory, translate, options) {

  const inputOutputEntry = inputOutput(element, bpmnFactory, translate, options);

  group.entries = group.entries.concat(inputOutputEntry.entries);
}
