/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const AVAILABLE_REPLACE_ELEMENTS = [
  'replace-with-service-task',
  'replace-with-message-intermediate-catch',
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
  'replace-with-message-start',
  'replace-with-timer-start',
  'replace-with-non-interrupting-message-boundary',
  'replace-with-non-interrupting-timer-boundary'
];

export const AVAILABLE_CONTEXTPAD_ENTRIES = [
  'append.end-event',
  'append.gateway',
  'delete',
  'connect',
  'replace'
];