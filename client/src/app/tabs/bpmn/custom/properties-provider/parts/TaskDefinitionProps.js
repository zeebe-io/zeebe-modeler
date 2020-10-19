/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

export default function(group, element, bpmnFactory, translate) {

  if (!is(element, 'bpmn:ServiceTask')) {
    return;
  }

  function getElements(bo, type, prop) {
    const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
    return !prop ? elems : (elems[0] || {})[prop] || [];
  }

  function getTaskDefinition(element) {
    const bo = getBusinessObject(element);
    return (getElements(bo, 'zeebe:TaskDefinition') || [])[0];
  }

  group.entries.push(entryFactory.validationAwareTextField(translate, {
    id: 'taskDefinitionType',
    label: translate('Type'),
    modelProperty: 'type',

    getProperty: function(element, node) {
      return (getTaskDefinition(element) || {}).type;
    },

    setProperty: function(element, values, node) {
      const bo = getBusinessObject(element);
      const commands = [];

      // create extensionElements
      let extensionElements = bo.get('extensionElements');
      if (!extensionElements) {
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
        commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
      }

      // create taskDefinition
      let taskDefinition = getTaskDefinition(element);

      if (!taskDefinition) {
        taskDefinition = elementHelper.createElement('zeebe:TaskDefinition', { }, extensionElements, bpmnFactory);
        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [ taskDefinition ],
          []
        ));
      }

      commands.push(cmdHelper.updateBusinessObject(element, taskDefinition, values));
      return commands;
    },

    validate: function(element, values) {
      const bo = getTaskDefinition(element);
      let validation = {};
      if (bo) {
        const {
          type
        } = values;

        if (!type) {
          validation = {
            type: translate('ServiceTask must have a type')
          };
        }

      }
      return validation;
    }
  }));

  group.entries.push(entryFactory.textField(translate, {
    id: 'taskDefinitionRetries',
    label: translate('Retries'),
    modelProperty: 'retries',

    get: function(element) {
      return {
        retries: (getTaskDefinition(element) || {}).retries
      };
    },

    set: function(element, values) {
      const bo = getBusinessObject(element);
      const commands = [];

      // create extensionElements
      let extensionElements = bo.get('extensionElements');
      if (!extensionElements) {
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
        commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
      }

      // create taskDefinition
      let taskDefinition = getTaskDefinition(element);

      if (!taskDefinition) {
        taskDefinition = elementHelper.createElement('zeebe:TaskDefinition', { }, extensionElements, bpmnFactory);
        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [ taskDefinition ],
          []
        ));
      }

      commands.push(cmdHelper.updateBusinessObject(element, taskDefinition, values));
      return commands;
    }

  }));

}
