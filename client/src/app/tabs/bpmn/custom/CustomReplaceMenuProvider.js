/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';

import {
  bind,
  find,
  filter
} from 'min-dash';

import {
  isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  AVAILABLE_REPLACE_ELEMENTS as availableReplaceElements,
  AVAILABLE_LOOP_ENTRIES as availableLoopEntries
} from './modeler-options/Options';

export default class CustomReplaceMenuProvider extends ReplaceMenuProvider {

  constructor(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
    super(popupMenu, modeling, moddle, bpmnReplace, rules, translate);

    this.defaultEntries = bind(super.getEntries, this);
  }

  getHeaderEntries(element) {

    let headerEntries = [];

    if (
      isAny(element, [
        'bpmn:Task',
        'bpmn:ReceiveTask',
        'bpmn:ServiceTask',
        'bpmn:SubProcess',
        'bpmn:CallActivity'
      ]) && !isEventSubProcess(element)
    ) {

      const loopEntries = this._getLoopEntries(element);

      headerEntries = filter(
        loopEntries,
        entry => availableLoopEntries.indexOf(entry.id) !== -1
      );
    }

    return headerEntries;
  }

  getEntries(element) {
    const entries = this.defaultEntries(element);

    const filteredEntries = filter(
      entries,
      entry => find(availableReplaceElements, a => a === entry.id)
    );

    return filteredEntries;
  }
}

CustomReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];
