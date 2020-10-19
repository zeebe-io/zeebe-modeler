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
  assign,
  find,
  forEach
} from 'min-dash';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import entryFactory from 'bpmn-js-properties-panel/lib//factory/EntryFactory';

import elementHelper from 'bpmn-js-properties-panel/lib//helper/ElementHelper';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib//helper/ExtensionElementsHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib//helper/CmdHelper';

import utils from 'bpmn-js-properties-panel/lib//Utils';

function generatePropertyId() {
  return utils.nextId('Header_');
}

/**
 * Get all zeebe:header objects for a specific business object
 *
 * @param  {ModdleElement} parent
 *
 * @return {Array<ModdleElement>} a list of zeebe:header objects
 */
function getPropertyValues(parent) {
  const properties = parent && getPropertiesElement(parent);
  if (properties && properties.values) {
    return properties.values;
  }
  return [];
}

/**
 * Get all zeebe:Header object for a specific business object
 *
 * @param  {ModdleElement} parent
 *
 * @return {ModdleElement} a zeebe:Headers object
 */
function getPropertiesElement(element) {
  if (!isExtensionElements(element)) {
    return element.properties;
  }
  else {
    return getPropertiesElementInsideExtensionElements(element);
  }
}

/**
 * Get first camunda:Properties object for a specific bpmn:ExtensionElements
 * business object.
 *
 * @param {ModdleElement} extensionElements
 *
 * @return {ModdleElement} a camunda:Properties object
 */
function getPropertiesElementInsideExtensionElements(extensionElements) {
  return find(extensionElements.values, elem => {
    return is(elem, 'zeebe:TaskHeaders');
  });
}

/**
 * Returns true, if the given business object is a bpmn:ExtensionElements.
 *
 * @param {ModdleElement} element
 *
 * @return {boolean} a boolean value
 */
function isExtensionElements(element) {
  return is(element, 'bpmn:ExtensionElements');
}

/**
 * Create a camunda:property entry using tableEntryFactory
 *
 * @param  {djs.model.Base} element
 * @param  {BpmnFactory} bpmnFactory
 * @param  {Function} translate
 * @param  {Object} options
 * @param  {string} options.id
 * @param  {Array<string>} options.modelProperties
 * @param  {Array<string>} options.labels
 * @param  {function} options.getParent Gets the parent business object
 * @param  {function} options.show Indicate when the entry will be shown, should return boolean
 *
 * @returns {Object} a tableEntry object
 */
export default function(element, bpmnFactory, translate, options) {

  const getParent = options.getParent;

  const modelProperties = options.modelProperties, createParent = options.createParent;

  const bo = getBusinessObject(element);

  if (!is(element, 'bpmn:ServiceTask')) {
    return;
  }


  assign(options, {
    addLabel: translate('Add Header'),
    getElements: function(element, node) {
      const parent = getParent(element, node, bo);
      return getPropertyValues(parent);
    },
    addElement: function(element, node) {
      const commands = [];
      let parent = getParent(element, node, bo);

      if (!parent && typeof createParent === 'function') {
        const result = createParent(element, bo);
        parent = result.parent;
        commands.push(result.cmd);
      }

      let properties = getPropertiesElement(parent);
      if (!properties) {
        properties = elementHelper.createElement('zeebe:TaskHeaders', {}, parent, bpmnFactory);

        if (!isExtensionElements(parent)) {
          commands.push(cmdHelper.updateBusinessObject(element, parent, { 'taskHeaders': properties }));
        }
        else {
          commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            parent,
            'values',
            'extensionElements',
            [ properties ],
            []
          ));
        }
      }

      const propertyProps = {};
      forEach(modelProperties, prop => {
        propertyProps[prop] = undefined;
      });

      // create id if necessary
      if (modelProperties.indexOf('id') >= 0) {
        propertyProps.id = generatePropertyId();
      }

      const property = elementHelper.createElement('zeebe:Header', propertyProps, properties, bpmnFactory);
      commands.push(cmdHelper.addElementsTolist(element, properties, 'values', [ property ]));

      return commands;
    },
    updateElement: function(element, value, node, idx) {
      const parent = getParent(element, node, bo), property = getPropertyValues(parent)[idx];

      forEach(modelProperties, prop => {
        value[prop] = value[prop] || undefined;
      });

      return cmdHelper.updateBusinessObject(element, property, value);
    },
    validate: function(element, value, node, idx) {

      // validate id if necessary
      if (modelProperties.indexOf('id') >= 0) {

        const parent = getParent(element, node, bo), properties = getPropertyValues(parent), property = properties[idx];

        if (property) {

          // check if id is valid
          const validationError = utils.isIdValid(property, value.id);

          if (validationError) {
            return { id: validationError };
          }
        }
      }
    },
    removeElement: function(element, node, idx) {
      const commands = [], parent = getParent(element, node, bo), properties = getPropertiesElement(parent), propertyValues = getPropertyValues(parent), currentProperty = propertyValues[idx];

      commands.push(cmdHelper.removeElementsFromList(element, properties, 'values', null, [ currentProperty ]));

      if (propertyValues.length === 1) {

        // remove camunda:properties if the last existing property has been removed
        if (!isExtensionElements(parent)) {
          commands.push(cmdHelper.updateBusinessObject(element, parent, { headers: undefined }));
        }
        else {
          forEach(parent.values, value => {
            if (is(value, 'zeebe:TaskHeaders')) {
              commands.push(extensionElementsHelper.removeEntry(bo, element, value));
            }
          });
        }
      }

      return commands;
    }
  });

  return entryFactory.table(translate, options);
}
