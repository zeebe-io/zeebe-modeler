import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

const getElements = (bo, type, prop) => {
  const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elems : (elems[0] || {})[prop] || [];
};

const getParameters = (element, prop) => {
  const inputOutput = getInputOutput(element);
  return (inputOutput && inputOutput.get(prop)) || [];
};

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
  return areOutputParametersSupported(element) || areOutputParametersSupported(element);
}

/**
   * Returns 'true' if the given element supports input parameters
   *
   * @param {djs.model.Base} element
   *
   * @return {boolean} a boolean value
   */
export function areInputParametersSupported(element) {
  const bo = getBusinessObject(element);
  return (is(bo, 'bpmn:ServiceTask') || is(bo, 'bpmn:SubProcess'));
}

/**
   * Returns 'true' if the given element supports output parameters
   *
   * @param {djs.model.Base} element
   *
   * @return {boolean} a boolean value
   */
export function areOutputParametersSupported(element) {
  const bo = getBusinessObject(element);
  if (is(bo, 'bpmn:ServiceTask') || is(bo, 'bpmn:SubProcess') || is(bo, 'bpmn:ReceiveTask'))
    return true;

  const messageEventDefinition = eventDefinitionHelper.getMessageEventDefinition(element);
  return messageEventDefinition;
}


