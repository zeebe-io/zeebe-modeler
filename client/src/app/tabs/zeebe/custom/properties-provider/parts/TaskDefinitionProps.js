import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import utils from 'bpmn-js-properties-panel/lib/Utils';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

export default function(group, element, bpmnFactory) {

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

  group.entries.push(entryFactory.validationAwareTextField({
    id: 'taskDefinitionType',
    label: 'Type',
    modelProperty: 'type',

    getProperty: function(element, node) {
      return (getTaskDefinition(element, node) || {}).type;
    },

    setProperty: function(element, values, node) {
      const bo = getBusinessObject(element);
      const commands = [];

      // CREATE extensionElements
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

    validate: function(element, values, node) {
      const bo = getTaskDefinition(element, node);
      const validation = {};
      if (bo) {
        const sourceValue = values.source;

        if (sourceValue) {
          if (utils.containsSpace(sourceValue)) {
            validation.source = 'Type must not contain spaces';
          }
        }
        else {
          validation.source = 'ServiceTask must have a type';
        }
      }
      return validation;
    }
  }));

  group.entries.push(entryFactory.validationAwareTextField({
    id: 'taskDefinitionRetries',
    label: 'Retries',
    modelProperty: 'retries',

    getProperty: function(element, node) {
      return (getTaskDefinition(element, node) || {}).retries;
    },

    setProperty: function(element, values, node) {
      const bo = getBusinessObject(element);
      const commands = [];

      // CREATE extensionElements
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

    validate: function(element, values, node) {

      return true;
    }

  }));

}








