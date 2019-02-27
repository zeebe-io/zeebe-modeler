import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';


function getElements(bo, type, prop) {
  const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elems : (elems[0] || {})[prop] || [];
}

/**
 * Get a payloadMappings object from the business object
 *
 * @param {djs.model.Base} element
 *
 * @param {djs.model.Base} props
 *
 * @return {ModdleElement} the payloadMappings object
 */

function getParameters(element, prop) {
  const inputOutput = getPayloadMappings(element);
  return (inputOutput && inputOutput.get(prop)) || [];
}

/**
 * Get a payloadMappings object from the business object
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement} the payloadMappings object
 */
export function getPayloadMappings(element) {
  const bo = getBusinessObject(element);
  return (getElements(bo, 'zeebe:PayloadMappings') || [])[0];
}


/**
 * Return all mappings existing in the business object, and
 * an empty array if none exist.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array} a list of mapping objects
 */
export function getMappings(element) {
  return getParameters.apply(this, [ element, 'mapping' ]);
}

/**
 * Get mappings from the business object at given index
 *
 * @param {djs.model.Base} element
 * @param {number} idx
 *
 * @return {ModdleElement} input parameter
 */
export function getMapping(element, idx) {
  return getMappings(element)[idx];
}

/**
 * Returns 'true' if the given element supports payloadmappings
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
export function isPayloadMappingsSupported(element) {
  return (is(element, 'bpmn:EndEvent'));
}
