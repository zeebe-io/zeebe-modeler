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
  isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  AVAILABLE_REPLACE_ELEMENTS as availableElements,
  AVAILABLE_LOOP_ENTRIES as availableLoopEntries
} from './modeler-options/Options';

export default class CustomReplaceMenuProvider extends ReplaceMenuProvider {

  constructor(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
    super(popupMenu, modeling, moddle, bpmnReplace, rules, translate);
  }

  // For future element support!!
  _createEntries(element, replaceOptions) {
    let options = ReplaceMenuProvider.prototype._createEntries.call(this, element, replaceOptions);
    return options.filter(option => availableElements.indexOf(option.id) != -1);
  }

  getHeaderEntries(element) {

    let headerEntries = [];

    if (
      isAny(element, [ 'bpmn:ReceiveTask', 'bpmn:ServiceTask', 'bpmn:SubProcess' ]) &&
      !isEventSubProcess(element)
    ) {

      const loopEntries = this._getLoopEntries(element);

      headerEntries = loopEntries.filter(
        entry => availableLoopEntries.indexOf(entry.id) != -1
      );
    }

    return headerEntries;
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