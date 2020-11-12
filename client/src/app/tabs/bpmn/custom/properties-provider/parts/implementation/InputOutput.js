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

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import { query as domQuery } from 'min-dom';

import entryFieldDescription from 'bpmn-js-properties-panel/lib/factory/EntryFieldDescription';

import {
  areOutputParametersSupported,
  areInputParametersSupported,
  createIOMapping,
  createElement as createParameter,
  determineParamGetFunc,
  getInputOutput,
  isInputOutputSupported
} from '../../helper/InputOutputHelper';

import InputOutputParameter from './InputOutputParameter';

import OutputParameterToggle from './OutputParameterToggle';


/**
 * Create an input or output mapping entry (containing multiple sub-entries).
 * @param {Object} element - diagram-js element.
 * @param {Object} bpmnFactory - bpmn-js bpmn-factory.
 * @param {Function} translate - translate function.
 * @param {Object} options - Options.
 * @param {string} [options.type] - moddle (zeebe-bpmn-moddle) type name for the IOMapping.
 * @param {string} [options.prop] - moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 * @param {string} [options.prefix] - prefix to be used when constructing id attribute of HTMLElements.
 *
 * @returns {Object} An Object containing multiple Objects in its `entries` attribute,
 * each representing a properties-panel entry. First entry will always be a heading followed
 * by n input / output parameter entries.
 */
export default function(element, bpmnFactory, translate, options = {}) {
  const result = {
    entries: []
  };

  // Return if given moddle property is not supported for given element
  if (!options.prop ||
      !isInputOutputSupported(element) ||
      (options.prop === 'inputParameters' && !areInputParametersSupported(element)) ||
      (options.prop === 'outputParameters' && !areOutputParametersSupported(element))) {
    return result;
  }

  // Heading ///////////////////////////////////////////////////////////////
  const heading = getParametersHeadingEntry(element, bpmnFactory, {
    type: options.type,
    prop: options.prop,
    prefix: options.prefix
  });
  result.entries = result.entries.concat(heading);

  // Toggle ///////////////////////////////////////////////////////////////////
  const toggle = OutputParameterToggle(element, bpmnFactory, translate, {
    prefix: options.prefix,
    prop: options.prop
  });
  result.entries = result.entries.concat(toggle);

  // Parameters ///////////////////////////////////////////////////////////////
  result.entries = result.entries.concat(getIOMappingEntries(element, bpmnFactory, translate, {
    prefix: options.prefix,
    prop: options.prop
  }));

  return result;
}

/**
 * Create an input or output mapping heading entry.
 * @param {Object} element - diagram-js element.
 * @param {Object} bpmnFactory - bpmn-js bpmn-factory.
 * @param {Object} options - Options.
 * @param {string} [options.type] - moddle (zeebe-bpmn-moddle) type name for the IOMapping.
 * @param {string} [options.prop] - moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 * @param {string} [options.prefix] - prefix to be used when constructing id attribute of HTMLElements.
 *
 * @returns {Object} An Object representing a properties-panel heading entry.
 */
function getParametersHeadingEntry(element, bpmnFactory, options) {
  const entry = {
    id: `${options.prefix}-heading`,
    cssClasses: [ 'bpp-input-output' ],
    html: `<div class="bpp-field-wrapper">
      <button type="button" class="bpp-input-output__add add action-button" data-action="createElement">
      </button><input name="hidden" type="hidden">
      </div>`,
    createElement: function(_, entryNode) {
      const commands = createElement();

      if (commands) {
        scheduleCommands(commands, entryNode);
        return true;
      }
    },

    set: function() {
      const commands = entry._commands;

      if (commands) {
        delete entry._commands;
        return commands;
      }
    }
  };

  return entry;

  function createElement() {
    const commands = [],
          bo = getBusinessObject(element);

    let extensionElements = bo.get('extensionElements');

    if (!extensionElements) {
      extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
      commands.push(cmdHelper.updateBusinessObject(element, bo, { extensionElements: extensionElements }));
    }

    // Get the IOMapping
    let inputOutput = getInputOutput(element);

    if (!inputOutput) {
      const parent = extensionElements;

      inputOutput = createIOMapping(parent, bpmnFactory, {
        inputParameters: [],
        outputParameters: []
      });

      commands.push(cmdHelper.addAndRemoveElementsFromList(
        element,
        extensionElements,
        'values',
        'extensionElements',
        [ inputOutput ],
        []
      ));
    }

    const newElem = createParameter(options.type, inputOutput, bpmnFactory, {
      source: '= source',
      target: 'target'
    });

    commands.push(cmdHelper.addElementsTolist(element, inputOutput, options.prop, [ newElem ]));

    return commands;
  }

  /**
   * Schedule commands to be run with next `set` method call.
   *
   * @param {Array<any>} commands
   * @param {HTMLElement} entryNode
   */
  function scheduleCommands(commands, entryNode) {
    entry._commands = commands;

    // @maxtru, adapted from @barmac: hack to make properties panel call `set`
    const input = domQuery('input[type="hidden"]', entryNode);
    input.value = 1;
  }

}

/**
 * Create a list of Input or Output Mapping properties-panel entries.
 * @param {Object} element - diagram-js element.
 * @param {Object} bpmnFactory - bpmn-js bpmn-factory.
 * @param {Function} translate - translate.
 * @param {Object} options - Options.
 * @param {string} [options.prop] - moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 * @param {string} [options.prefix] - prefix to be used when constructing id attribute of HTMLElements.
 *
 * @returns {Object} An Object representing a properties-panel heading entry.
 */
function getIOMappingEntries(element, bpmnFactory, translate, options) {

  // Get the IOMapping and determine whether we are dealing with input or output parameters
  const inputOutput = getInputOutput(element, false),
        params = determineParamGetFunc(options.prop)(element, false);

  if (!params.length) {
    const description = entryFieldDescription(translate, translate('No Variables defined'));

    return [{
      id: `${options.prefix}-parameter-placeholder`,
      cssClasses: [ 'bpp-input-output-placeholder' ],
      html: description
    }];
  }

  const parameters = params.map(function(param, index) {

    return InputOutputParameter(param, translate,
      {
        idPrefix: `${options.prefix}-parameter-${index}`,
        onRemove: onRemove,
        onToggle: onToggle,
        prop: options.prop
      });

    function onRemove() {
      let commands = [];
      commands.push(cmdHelper.removeElementsFromList(element, inputOutput, options.prop, null, [param]));

      // remove inputOutput if there are no input/output parameters anymore
      if (inputOutput.get('inputParameters').length + inputOutput.get('outputParameters').length === 1) {
        commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, inputOutput));
      }

      return commands;
    }
  });

  // Return only the entries in a flat structure
  const entries = parameters.flatMap(function(entry) {
    return entry.entries;
  });

  return entries;

  /**
   * Close remaining collapsible entries within group.
   *
   * @param {boolean} value
   * @param {HTMLElement} entryNode
   */
  function onToggle(value, entryNode) {
    if (!value) {
      return;
    }

    const currentEntryId = entryNode.dataset.entry;

    // Add closing behavior to the parameters
    parameters.forEach(function(parameter) {

      // Each parameter has 3 entries, the first one always is the collapsbile
      if (parameter.entries[0].id === currentEntryId) {
        return;
      }

      parameter.setOpen(false);
    });
  }
}
