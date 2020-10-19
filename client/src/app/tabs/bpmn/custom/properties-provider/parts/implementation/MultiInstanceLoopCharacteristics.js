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

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

export default function(element, bpmnFactory, translate) {

  function getProperty(element, propertyName) {
    const loopCharacteristics = getLoopCharacteristics(element),
          zeebeLoopCharacteristics = getZeebeLoopCharacteristics(loopCharacteristics);

    return zeebeLoopCharacteristics && zeebeLoopCharacteristics.get(propertyName);
  }

  function setProperties(element, values) {
    const loopCharacteristics = getLoopCharacteristics(element),
          commands = [];

    // ensure extensionElements
    let extensionElements = loopCharacteristics.get('extensionElements');
    if (!extensionElements) {
      extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, loopCharacteristics, bpmnFactory);
      commands.push(cmdHelper.updateBusinessObject(element, loopCharacteristics, { extensionElements: extensionElements }));
    }

    // ensure zeebe:LoopCharacteristics
    let zeebeLoopCharacteristics = getZeebeLoopCharacteristics(loopCharacteristics);
    if (!zeebeLoopCharacteristics) {
      zeebeLoopCharacteristics = elementHelper.createElement('zeebe:LoopCharacteristics', { }, extensionElements, bpmnFactory);
      commands.push(cmdHelper.addAndRemoveElementsFromList(
        element,
        extensionElements,
        'values',
        'extensionElements',
        [ zeebeLoopCharacteristics ],
        []
      ));
    }

    commands.push(cmdHelper.updateBusinessObject(element, zeebeLoopCharacteristics, values));
    return commands;
  }

  let entries = [];

  // input collection //////////////////////////////////////////////////////////////
  entries.push(entryFactory.textField(translate, {
    id: 'multiInstance-inputCollection',
    label: translate('Input Collection'),
    modelProperty: 'inputCollection',

    get: function(element) {

      return {
        inputCollection: getProperty(element, 'inputCollection')
      };

    },

    set: function(element, values) {
      return setProperties(element, {
        inputCollection: values.inputCollection || undefined
      });
    },

    validate: function(element, values) {
      const loopCharacteristics = getLoopCharacteristics(element),
            zeebeLoopCharacteristics = getZeebeLoopCharacteristics(loopCharacteristics);

      let validation = {};
      if (zeebeLoopCharacteristics) {
        const {
          inputCollection
        } = values;

        if (!inputCollection) {
          validation = {
            inputCollection: 'input collection must not be empty'
          };
        }
      }
      return validation;
    }
  }));

  // input element //////////////////////////////////////////////////////////////////
  entries.push(entryFactory.textField(translate, {
    id: 'multiInstance-inputElement',
    label: translate('Input Element'),
    modelProperty: 'inputElement',

    get: function(element) {

      return {
        inputElement: getProperty(element, 'inputElement')
      };

    },

    set: function(element, values) {
      return setProperties(element, {
        inputElement: values.inputElement || undefined
      });
    }
  }));

  // output collection ////////////////////////////////////////////////////////////
  entries.push(entryFactory.textField(translate, {
    id: 'multiInstance-outputCollection',
    label: translate('Output Collection'),
    modelProperty: 'outputCollection',

    get: function(element) {

      return {
        outputCollection: getProperty(element, 'outputCollection')
      };

    },

    set: function(element, values) {
      return setProperties(element, {
        outputCollection: values.outputCollection || undefined
      });
    },
  }));

  // output element //////////////////////////////////////////////////////
  entries.push(entryFactory.textField(translate, {
    id: 'multiInstance-outputElement',
    label: translate('Output Element'),
    modelProperty: 'outputElement',

    get: function(element) {

      return {
        outputElement: getProperty(element, 'outputElement')
      };

    },

    set: function(element, values) {
      return setProperties(element, {
        outputElement: values.outputElement || undefined
      });
    },
  }));

  return entries;

}

// helper /////////

function getExtensionElements(bo, type, prop) {
  const elements = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elements : (elements[0] || {})[prop] || [];
}

function getZeebeLoopCharacteristics(loopCharacteristics) {
  const extensionElements = getExtensionElements(loopCharacteristics, 'zeebe:LoopCharacteristics');

  return extensionElements && extensionElements[0];
}

function getLoopCharacteristics(element) {
  const bo = getBusinessObject(element);
  return bo.loopCharacteristics;
}
