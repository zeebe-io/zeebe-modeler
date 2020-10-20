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
  isInputOutputSupported
} from '../../helper/InputOutputHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import utils from 'bpmn-js-properties-panel/lib/Utils';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

function ensureInputOutputSupported(element) {
  return isInputOutputSupported(element);
}

export default function(element, bpmnFactory, translate, options = {}) {
  const idPrefix = options.idPrefix || '';

  const getSelected = options.getSelectedParameter;

  if (!ensureInputOutputSupported(element)) {
    return [];
  }

  const entries = [];

  const isSelected = (element, node) => {
    return getSelected(element, node);
  };


  // parameter source ////////////////////////////////////////////////////////

  entries.push(entryFactory.validationAwareTextField(translate, {
    id: `${idPrefix}parameterSource`,
    label: translate('Source'),
    modelProperty: 'source',

    getProperty: function(element, node) {
      return (getSelected(element, node) || {}).source;
    },

    setProperty: function(element, values, node) {
      const param = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, param, values);
    },

    validate: function(element, values, node) {
      const bo = getSelected(element, node);

      const validation = {};
      if (bo) {
        const sourceValue = values.source;

        if (!sourceValue) {
          validation.source = translate('Parameter must have a source');
        }
      }

      return validation;
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }
  }));


  // parameter target ////////////////////////////////////////////////////////

  entries.push(entryFactory.validationAwareTextField(translate, {
    id: `${idPrefix}parameterTarget`,
    label: translate('Target'),
    modelProperty: 'target',

    getProperty: function(element, node) {
      return (getSelected(element, node) || {}).target;
    },

    setProperty: function(element, values, node) {
      const param = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, param, values);
    },

    validate: function(element, values, node) {
      const bo = getSelected(element, node);

      const validation = {};
      if (bo) {
        const targetValue = values.target;

        if (targetValue) {
          if (utils.containsSpace(targetValue)) {
            validation.target = translate('Target must not contain spaces');
          }
        }
        else {
          validation.target = translate('Parameter must have a Target');
        }
      }

      return validation;
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }
  }));

  return entries;
}
