/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

export const AVAILABLE_REPLACE_ELEMENTS = [
  'replace-with-service-task',
  'replace-with-message-intermediate-catch',
  'replace-with-timer-intermediate-catch',
  'replace-with-none-start',
  'replace-with-none-end',
  'replace-with-conditional-flow',
  'replace-with-default-flow',
  'replace-with-sequence-flow',
  'replace-with-parallel-gateway',
  'replace-with-exclusive-gateway',
  'replace-with-collapsed-subprocess',
  'replace-with-expanded-subprocess',
  'replace-with-timer-boundary',
  'replace-with-message-boundary',
  'replace-with-event-based-gateway',
  'replace-with-receive-task',
  'replace-with-task',
  'replace-with-message-start',
  'replace-with-timer-start',
  'replace-with-none-intermediate-throw',
  'replace-with-none-intermediate-throwing', // only for StartEvent
  'replace-with-non-interrupting-message-boundary',
  'replace-with-non-interrupting-timer-boundary',
  'replace-with-error-boundary',
  'replace-with-error-end',
  'replace-with-event-subprocess',
  'replace-with-subprocess',
  'replace-with-error-start',
  'replace-with-non-interrupting-message-start',
  'replace-with-non-interrupting-timer-start',
  'replace-with-expanded-pool',
  'replace-with-collapsed-pool',
  'replace-with-call-activity'
];

export const AVAILABLE_CONTEXTPAD_ENTRIES = [
  'append.message-intermediate-event',
  'append.timer-intermediate-event',
  'append.append-task',
  'append.intermediate-event',
  'append.text-annotation',
  'append.end-event',
  'append.gateway',
  'delete',
  'connect',
  'replace',
  'lane-insert-above',
  'lane-divide-two',
  'lane-divide-three',
  'lane-insert-below'
];

export const AVAILABLE_LOOP_ENTRIES = [
  'toggle-parallel-mi',
  'toggle-sequential-mi'
];

export const AVAILABLE_PALETTE_ENTRIES = [
  'hand-tool',
  'lasso-tool',
  'space-tool',
  'global-connect-tool',
  'tool-separator',
  'create.start-event',
  'create.intermediate-event',
  'create.end-event',
  'create.exclusive-gateway',
  'create.task',
  'create.subprocess-expanded',
  'create.participant-expanded',
  'create.group'
];
