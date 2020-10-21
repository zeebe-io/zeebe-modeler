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

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';


function getElements(bo, type, prop) {
  const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elems : (elems[0] || {})[prop] || [];
}

function getParameters(element, prop) {
  const inputOutput = getInputOutput(element);
  return (inputOutput && inputOutput.get(prop)) || [];
}

/**
   * Get a inputOutput from the business object
   *
   * @param {djs.model.Base} element
   *
   * @return {ModdleElement} the inputOutput object
   */
export function getInputOutput(element) {
  const bo = getBusinessObject(element);
  return (getElements(bo, 'zeebe:IoMapping') || [])[0];
}


/**
   * Return all input parameters existing in the business object, and
   * an empty array if none exist.
   *
   * @param  {djs.model.Base} element
   *
   * @return {Array} a list of input parameter objects
   */
export function getInputParameters(element) {
  return getParameters.apply(this, [ element, 'inputParameters' ]);
}

/**
   * Return all output parameters existing in the business object, and
   * an empty array if none exist.
   *
   * @param  {djs.model.Base} element
   *
   * @return {Array} a list of output parameter objects
   */
export function getOutputParameters(element) {
  return getParameters.apply(this, [ element, 'outputParameters' ]);
}

/**
   * Get a input parameter from the business object at given index
   *
   * @param {djs.model.Base} element
   * @param {number} idx
   *
   * @return {ModdleElement} input parameter
   */
export function getInputParameter(element, idx) {
  return getInputParameters(element)[idx];
}

/**
   * Get a output parameter from the business object at given index
   *
   * @param {djs.model.Base} element
   * @param {number} idx
   *
   * @return {ModdleElement} output parameter
   */
export function getOutputParameter(element, idx) {
  return getOutputParameters(element)[idx];
}

/**
   * Returns 'true' if the given element supports inputOutput
   *
   * @param {djs.model.Base} element
   *
   * @return {boolean} a boolean value
   */
export function isInputOutputSupported(element) {
  return areOutputParametersSupported(element) || areInputParametersSupported(element);
}

/**
   * Returns 'true' if the given element supports input parameters
   *
   * @param {djs.model.Base} element
   *
   * @return {boolean} a boolean value
   */
export function areInputParametersSupported(element) {
  return isAny(element, [
    'bpmn:ServiceTask',
    'bpmn:SubProcess',
    'bpmn:CallActivity'
  ]);
}

/**
   * Returns 'true' if the given element supports output parameters
   *
   * @param {djs.model.Base} element
   *
   * @return {boolean} a boolean value
   */
export function areOutputParametersSupported(element) {
  return isAny(element, [
    'bpmn:ServiceTask',
    'bpmn:SubProcess',
    'bpmn:ReceiveTask',
    'bpmn:CallActivity',
    'bpmn:Event'
  ]);
}

export function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}

export function createIOMapping(parent, bpmnFactory, properties) {
  return createElement('zeebe:IoMapping', parent, bpmnFactory, properties);
}

/**
 * Get getter function for IOMapping parameters according to provided property name
 *
 * @param {string} property
 *
 * @returns {Function} Getter function for the IOMapping parameters according to provided property name
 */
export function determineParamGetFunc(property) {
  if (property == 'inputParameters') {
    return getInputParameters;
  }

  if (property == 'outputParameters') {
    return getOutputParameters;
  }
}
