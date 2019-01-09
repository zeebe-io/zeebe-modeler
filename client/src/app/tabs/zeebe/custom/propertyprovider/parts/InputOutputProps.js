import inputOutput from './implementation/InputOutput';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import {
  isInputOutputSupported
} from '../helper/InputOutputHelper';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

export default function(group, element, bpmnFactory) {


  function getIoMapping(element) {
    const bo = getBusinessObject(element);
    return (getElements(bo, 'zeebe:IoMapping') || [])[0];
  }

  function getElements(bo, type, prop) {
    const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
    return !prop ? elems : (elems[0] || {})[prop] || [];
  }

  function ensureInputOutputSupported(element) {
    return isInputOutputSupported(element);
  }

  if (ensureInputOutputSupported(element)) {

    group.entries.push(entryFactory.selectBox({
      id: 'io-mapping-outputBehavior',
      label: 'Output Behavior',
      selectOptions: [
        { name: '', value: '' },
        { name: 'MERGE', value: 'merge' },
        { name: 'OVERWRITE', value: 'overwrite' },
        { name: 'NONE', value: 'none' }
      ],
      modelProperty: 'outputBehavior',
      emptyParameter: false,

      get: function(element, node) {
        return (getIoMapping(element, node) || {});
      },

      set: function(element, values, node) {
        const bo = getBusinessObject(element);
        const commands = [];

        // CREATE extensionElemente
        let extensionElements = bo.get('extensionElements');
        if (!extensionElements) {
          extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
          commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
        }
        // create taskDefinition
        let ioMapping = getIoMapping(element);

        if (!ioMapping) {
          ioMapping = elementHelper.createElement('zeebe:IoMapping', {}, extensionElements, bpmnFactory);
          commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            extensionElements,
            'values',
            'extensionElements',
            [ioMapping],
            []
          ));
        }

        commands.push(cmdHelper.updateBusinessObject(element, ioMapping, values));
        return commands;
      }
    }));
  }

  const inputOutputEntry = inputOutput(element, bpmnFactory);
  group.entries = group.entries.concat(inputOutputEntry.entries);
  return {
    getSelectedParameter: inputOutputEntry.getSelectedParameter
  };

}
