/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import {
  getCalledElement,
  isPropagateAllChildVariables
} from '../../../modeling/helper/CalledElementHelper';


/**
 * Create an input or output mapping entry for a single input or output entry
 * @param {Function} translate - translate function.
 * @param {Object} options - Options.
 * @param {string} [options.idPrefix] - preFix used to construct the 'id' of the GUI entries
 * @param {string} [options.prop] - moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 *
 * @returns {Object} An Object containing multiple Objects in its `entries` attribute,
 * each representing a properties-panel entry. First entry will always be a collapsible followed
 * by two inputs (one for source and one for target).
 */
export default function(element, bpmnFactory, translate, options = {}) {
  if (!(is(element, 'bpmn:CallActivity') &&
     options.prop === 'outputParameters')) {
    return [];
  }

  const toggle = entryFactory.toggleSwitch(translate, {
    id: `${options.prefix}-propagate-all-toggle`,
    label: translate('Propagate all Child Process Variables'),
    modelProperty: 'propagateAllChildVariables',
    labelOn: translate('On'),
    labelOff: translate('Off'),
    descriptionOn: translate('All variables from the child process instance will be propagated to the parent process instance'),
    descriptionOff: translate('Only variables defined via output mappings will be propagated from the child to the parent process instance'),
    isOn: () => {
      return isPropagateAllChildVariables(element);
    },
    get: () => {
      return { propagateAllChildVariables: isPropagateAllChildVariables(element) };
    },
    set: function(element, values) {
      let commands = [];

      const propagateAllChildVariables = values.propagateAllChildVariables || false;

      commands.push(setCalledElementProperties(element, bpmnFactory, { propagateAllChildVariables }));

      return commands;
    },
    hidden: function() {
      return false;
    }
  });

  return toggle;

}


// helper //////////////////////////

function setCalledElementProperties(element, bpmnFactory, values) {
  const businessObject = getBusinessObject(element),
        commands = [];

  // ensure extensionElements
  let extensionElements = businessObject.get('extensionElements');
  if (!extensionElements) {
    extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, businessObject, bpmnFactory);
    commands.push(cmdHelper.updateBusinessObject(element, businessObject, { extensionElements: extensionElements }));
  }

  // ensure zeebe:calledElement
  let calledElement = getCalledElement(businessObject);
  if (!calledElement) {
    calledElement = elementHelper.createElement('zeebe:CalledElement', { }, extensionElements, bpmnFactory);
    commands.push(cmdHelper.addAndRemoveElementsFromList(
      element,
      extensionElements,
      'values',
      'extensionElements',
      [ calledElement ],
      []
    ));
  }

  // update properties
  commands.push(cmdHelper.updateBusinessObject(element, calledElement, values));
  return commands;
}
