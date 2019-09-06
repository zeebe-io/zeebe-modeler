/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import {
  areOutputParametersSupported,
  getInputOutput,
  isInputOutputSupported,
  getInputParameter,
  getInputParameters,
  getOutputParameter,
  getOutputParameters,
  areInputParametersSupported
} from '../../helper/InputOutputHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import extensionElementsEntry from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements';

function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}

function createInputOutput(parent, bpmnFactory, properties) {
  return createElement('zeebe:IoMapping', parent, bpmnFactory, properties);
}

function createParameter(type, parent, bpmnFactory, properties) {
  return createElement(type, parent, bpmnFactory, properties);
}

function ensureInputOutputSupported(element) {
  return isInputOutputSupported(element);
}

function ensureOutParameterSupported(element) {
  return areOutputParametersSupported(element);
}

function ensureInputParameterSupported(element) {
  return areInputParametersSupported(element);
}

export default function(element, bpmnFactory, options = {}) {
  const idPrefix = options.idPrefix || '';

  let inputEntry, outputEntry;

  const getSelected = (element, node) => {
    let selection = (inputEntry && inputEntry.getSelected(element, node)) || { idx: -1 };

    let parameter = getInputParameter(element, selection.idx);
    if (!parameter && outputEntry) {
      selection = outputEntry.getSelected(element, node);
      parameter = getOutputParameter(element, selection.idx);
    }
    return parameter;
  };

  const result = {
    getSelectedParameter: getSelected
  };

  const entries = result.entries = [];

  if (!ensureInputOutputSupported(element)) {
    return result;
  }

  const newElement = (type, prop, factory) => {

    return (element, extensionElements, value) => {
      const commands = [];

      let inputOutput = getInputOutput(element);
      if (!inputOutput) {
        const parent = extensionElements;
        inputOutput = createInputOutput(parent, bpmnFactory, {
          inputParameters: [],
          outputParameters: []
        });

        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [ inputOutput ],
          []
        ));
      }

      const newElem = createParameter(type, inputOutput, bpmnFactory, { source: 'sourceValue', target: 'targetValue' });
      commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [ newElem ]));

      return commands;
    };
  };

  const removeElement = (getter, prop, otherProp) => {
    return (element, extensionElements, value, idx) => {
      const inputOutput = getInputOutput(element);
      const parameter = getter(element, idx);

      const commands = [];
      commands.push(cmdHelper.removeElementsFromList(element, inputOutput, prop, null, [ parameter ]));

      const firstLength = inputOutput.get(prop).length-1;
      const secondLength = (inputOutput.get(otherProp) || []).length;

      if (!firstLength && !secondLength) {

        commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, inputOutput));
      }

      return commands;
    };
  };

  const setOptionLabelValue = getter => {
    return (element, node, option, property, value, idx) => {
      const parameter = getter(element, idx);

      option.text = `${value} : ${parameter['target']}`;
    };
  };


  // input parameters ///////////////////////////////////////////////////////////////
  if (ensureInputParameterSupported(element)) {
    inputEntry = extensionElementsEntry(element, bpmnFactory, {
      id: `${idPrefix}inputs`,
      label: 'Input Parameters',
      modelProperty: 'source',
      prefix: 'Input',
      resizable: true,

      createExtensionElement: newElement('zeebe:Input', 'inputParameters'),
      removeExtensionElement: removeElement(getInputParameter, 'inputParameters', 'outputParameters'),

      getExtensionElements: function(element) {
        return getInputParameters(element);
      },

      onSelectionChange: function(element, node, event, scope) {
        outputEntry && outputEntry.deselect(element, node);
      },

      setOptionLabelValue: setOptionLabelValue(getInputParameter)

    });
    entries.push(inputEntry);
  }


  // output parameters ///////////////////////////////////////////////////////

  if (ensureOutParameterSupported(element)) {
    outputEntry = extensionElementsEntry(element, bpmnFactory, {
      id: `${idPrefix}outputs`,
      label: 'Output Parameters',
      modelProperty: 'source',
      prefix: 'Output',
      resizable: true,

      createExtensionElement: newElement('zeebe:Output', 'outputParameters'),
      removeExtensionElement: removeElement(getOutputParameter, 'outputParameters', 'inputParameters'),

      getExtensionElements: function(element) {
        return getOutputParameters(element);
      },

      onSelectionChange: function(element, node, event, scope) {
        if (inputEntry)
          inputEntry.deselect(element, node);
      },

      setOptionLabelValue: setOptionLabelValue(getOutputParameter)

    });
    entries.push(outputEntry);
  }

  return result;
}
