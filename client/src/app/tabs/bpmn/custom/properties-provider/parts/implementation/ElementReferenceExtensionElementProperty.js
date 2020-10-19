/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

/**
 * Create an entry to modify a property of an element which
 * is referenced by a event definition.
 *
 * @param  {djs.model.Base} element
 * @param  {ModdleElement} definition
 * @param  {BpmnFactory} bpmnFactory
 * @param  {Function} translate
 * @param  {Object} options
 * @param  {string} options.id the id of the entry
 * @param  {string} options.label the label of the entry
 * @param  {string} options.referenceProperty the name of referencing property
 * @param  {string} options.modelProperty the name of property to modify
 * @param  {string} options.extensionElement the name of the extensionElement to modify
 * @param  {string} options.shouldValidate a flag indicate whether to validate or not
 *
 * @return {Array<Object>} return an array containing the entries
 */
export default function(element, definition, bpmnFactory, translate, options) {

  const id = options.id || 'element-property';
  const label = options.label;
  const referenceProperty = options.referenceProperty;
  const modelProperty = options.modelProperty || 'name';
  const extensionElementKey = options.extensionElement || 'zeebe:Subscription';
  const shouldValidate = options.shouldValidate || false;


  function getElements(bo, type, prop) {
    const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
    return !prop ? elems : (elems[0] || {})[prop] || [];
  }

  function getExtensionElement(element) {
    const bo = getBusinessObject(element);
    return (getElements(bo, extensionElementKey) || [])[0];
  }

  const entry = entryFactory.textField(translate, {
    id: id,
    label: label,
    modelProperty: modelProperty,

    get: function(element, node) {
      const reference = definition.get(referenceProperty);
      const props = {};
      props[modelProperty] = reference && (getExtensionElement(reference) || {})[modelProperty];
      return props;
    },

    set: function(element, values, node) {

      const reference = definition.get(referenceProperty);
      const bo = getBusinessObject(reference);
      reference.businessObject = bo;
      const commands = [];
      let extensionElements = bo.get('extensionElements');
      if (!extensionElements) {
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
        commands.push(cmdHelper.updateProperties(reference, { extensionElements: extensionElements }));
      }

      let extensionElement = getExtensionElement(reference);

      if (!extensionElement) {
        extensionElement = elementHelper.createElement(extensionElementKey, { }, extensionElements, bpmnFactory);
        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [ extensionElement ],
          []
        ));
      }

      commands.push(cmdHelper.updateBusinessObject(element, extensionElement, values));
      return commands;
    },

    hidden: function(element, node) {
      return !definition.get(referenceProperty);
    }
  });

  if (shouldValidate) {
    entry.validate = (element, values, node) => {
      const reference = definition.get(referenceProperty);
      if (reference && !values[modelProperty]) {
        const validationErrors = {};
        validationErrors[modelProperty] = 'Must provide a value';
        return validationErrors;
      }
    };
  }

  return [ entry ];
}
