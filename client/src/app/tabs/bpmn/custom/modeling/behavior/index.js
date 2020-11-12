/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import CreateZeebeBoundaryEventBehavior from './CreateZeebeBoundaryEventBehavior';
import CreateZeebeCallActivityBehavior from './CreateZeebeCallActivityBehavior';
import UpdatePropagateAllChildVariablesBehavior from './UpdatePropagateAllChildVariablesBehavior';


export default {
  __init__: [
    'createZeebeBoundaryEventBehavior',
    'createZeebeCallActivityBehavior',
    'updatePropagateAllChildVariablesBehavior'
  ],
  createZeebeBoundaryEventBehavior: [ 'type', CreateZeebeBoundaryEventBehavior ],
  createZeebeCallActivityBehavior: [ 'type', CreateZeebeCallActivityBehavior ],
  updatePropagateAllChildVariablesBehavior: [ 'type', UpdatePropagateAllChildVariablesBehavior ]
};
