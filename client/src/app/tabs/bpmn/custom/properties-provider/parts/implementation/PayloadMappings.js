import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import {
  getMapping,
  getMappings,
  getPayloadMappings,
  isPayloadMappingsSupported
} from '../../helper/PayloadMappingsHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import extensionElementsEntry from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements';

function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}

function createPayloadMappings(parent, bpmnFactory, properties) {
  return createElement('zeebe:PayloadMappings', parent, bpmnFactory, properties);
}

function createMapping(type, parent, bpmnFactory, properties) {
  return createElement(type, parent, bpmnFactory, properties);
}

function ensurePayloadMappingsSupported(element) {
  return isPayloadMappingsSupported(element);
}

export default function(element, bpmnFactory, options = {}) {
  const idPrefix = options.idPrefix || '';

  const getSelected = (element, node) => {
    const selection = (inputEntry && inputEntry.getSelected(element, node)) || { idx: -1 };
    const parameter = getMapping(element, selection.idx);
    return parameter;
  };

  const result = {
    getSelectedMapping: getSelected
  };

  const entries = result.entries = [];

  if (!ensurePayloadMappingsSupported(element)) {
    return result;
  }

  const newElement = (type, prop, factory) => {

    return (element, extensionElements, value) => {
      const commands = [];

      let payloadMappings = getPayloadMappings(element);
      if (!payloadMappings) {
        const parent = extensionElements;
        payloadMappings = createPayloadMappings(parent, bpmnFactory, {
          mapping: []
        });

        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [payloadMappings],
          []
        ));
      }

      const newElem = createMapping(type, payloadMappings, bpmnFactory, { source: 'sourceValue', target: 'targetValue', type: 'PUT' });
      commands.push(cmdHelper.addElementsTolist(element, payloadMappings, prop, [newElem]));

      return commands;
    };
  };

  const removeElement = (getter, prop) => {
    return (element, extensionElements, value, idx) => {
      const payloadMappings = getPayloadMappings(element);
      const parameter = getter(element, idx);

      const commands = [];
      commands.push(cmdHelper.removeElementsFromList(element, payloadMappings, prop, null, [parameter]));

      const firstLength = payloadMappings.get(prop).length - 1;

      if (!firstLength) {

        commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, payloadMappings));
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

  var inputEntry = extensionElementsEntry(element, bpmnFactory, {
    id: `${idPrefix}inputs`,
    label: 'Input Parameters',
    modelProperty: 'source',
    prefix: 'Input',
    resizable: true,

    createExtensionElement: newElement('zeebe:Mapping', 'mapping'),
    removeExtensionElement: removeElement(getMapping, 'mapping'),

    getExtensionElements: function(element) {
      return getMappings(element);
    },

    setOptionLabelValue: setOptionLabelValue(getMapping)

  });
  entries.push(inputEntry);

  return result;
}
