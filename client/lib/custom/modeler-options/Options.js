'use strict';

var AVAILABLE_REPLACE_ELEMENTS = [
  'replace-with-service-task',
  'replace-with-none-start',
  'replace-with-none-end',
  'replace-with-conditional-flow',
  'replace-with-default-flow',
  'replace-with-sequence-flow'
];

var AVAILABLE_CONTEXTPAD_ENTRIES = [
  'append.end-event',
  'append.gateway',
  'delete',
  'connect',
  'replace'
];

module.exports.AVAILABLE_REPLACE_ELEMENTS = AVAILABLE_REPLACE_ELEMENTS;

module.exports.AVAILABLE_CONTEXTPAD_ENTRIES = AVAILABLE_CONTEXTPAD_ENTRIES;	