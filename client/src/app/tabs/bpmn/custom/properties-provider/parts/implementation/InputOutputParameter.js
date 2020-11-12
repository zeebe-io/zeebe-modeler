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

import { query as domQuery } from 'min-dom';


/**
 * Create an input or output mapping entry for a single input or output entry
 * @param {Object} parameter - BusinessObject for the respective paramter (can be 'zeebe:Input' or 'zeebe:Output')
 * @param {Function} translate - translate function.
 * @param {Object} options - Options.
 * @param {string} [options.idPrefix] - preFix used to construct the 'id' of the GUI entries
 * @param {Function} [options.onToggle] - function to be called when collapsible is toggled.
 * @param {Function} [options.onRemove] - function to be called when entry (collapsbile + source + target) is removed
 * @param {string} [options.prop] - moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 *
 * @returns {Object} An Object containing multiple Objects in its `entries` attribute,
 * each representing a properties-panel entry. First entry will always be a collapsible followed
 * by two inputs (one for source and one for target).
 */
export default function(parameter, translate, options = {}) {
  const result = {},
        entries = result.entries = [];

  // heading ////////////////////////////////////////////////////////
  const collapsible = entryFactory.collapsible({
    id: `${options.idPrefix}-collapsible`,
    cssClasses: [ 'bpp-collapsible--with-mapping' ],
    open: false,
    onRemove: options.onRemove,
    onToggle: options.onToggle,
    get: function() {
      return {
        title: parameter.target,

        // In the heading do not show the leading `=` of the FEEL expression
        description: getFormattedTargetValue(parameter.source)
      };
    }
  });

  const isOpen = options.isOpen || collapsible.isOpen;

  result.setOpen = function(value) {
    const entryNode = domQuery(`[data-entry="${collapsible.id}"]`);
    collapsible.setOpen(value, entryNode);
  };

  entries.push(collapsible);

  // parameter target ////////////////////////////////////////////////////////
  entries.push(entryFactory.validationAwareTextField(translate, {
    id: `${options.idPrefix}-parameterTarget`,
    label: getTargetTextInputLabel(translate, options.prop),
    modelProperty: 'target',

    getProperty: function() {
      return parameter.target;
    },

    setProperty: function(element, values) {
      return cmdHelper.updateBusinessObject(element, parameter, values);
    },

    validate: function(element, values) {
      const validation = {},
            targetValue = values.target;

      if (!targetValue) {
        validation.target = getTargetTextInputLabel(translate, options.prop) + ' ' + translate('must not be empty');
      } else if (targetValue.indexOf(' ') >= 0) {
        validation.target = getTargetTextInputLabel(translate, options.prop) + ' ' + translate('must not contain whitespaces');
      }

      return validation;
    },

    hidden: function() {
      return !isOpen();
    }
  }));

  // parameter source ////////////////////////////////////////////////////////
  entries.push(entryFactory.validationAwareTextField(translate, {
    id: `${options.idPrefix}-parameterSource`,
    label: translate('Variable Assignment Value'),
    modelProperty: 'source',

    getProperty: function() {
      return parameter.source;
    },

    setProperty: function(element, values) {
      return cmdHelper.updateBusinessObject(element, parameter, values);
    },

    validate: function(element, value) {
      const validation = {},
            sourceValue = value.source;

      if (!sourceValue) {
        validation.source = translate('Variable Assignment Value must not be empty');
      } else if (!sourceValue.startsWith('=')) {
        validation.source = translate('Variable Assignment Value must be a valid FEEL expression and therefore start with \'=\'');
      }

      return validation;
    },

    hidden: function() {
      return !isOpen();
    }
  }));

  return result;
}


// helper ///////////////////////

/**
 * Get label for the target input text field according to the property that is edited
 * @param {Function} translate translate.
 * @param {string} prop moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 *
 * @returns {string} Label which makes sense in accordance with the provided property.
 */
function getTargetTextInputLabel(translate, prop) {
  if (prop === 'inputParameters') {
    return translate('Local Variable Name');
  }
  if (prop === 'outputParameters') {
    return translate('Process Variable Name');
  }
  return;
}

/**
 * Get formatted target value by removing first character
 * @param {string} targetValue
 *
 * @returns {string} formatted target value
 */
function getFormattedTargetValue(targetValue) {
  return targetValue.substr(1);
}
