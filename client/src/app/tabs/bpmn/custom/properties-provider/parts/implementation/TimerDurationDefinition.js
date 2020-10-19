/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';


/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @return {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
function createFormalExpression(parent, body = undefined, bpmnFactory) {
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
}

export default function(group, bpmnFactory, timerEventDefinition, translate) {
  group.entries.push(entryFactory.textField(translate, {
    id: 'timer-event-duration',
    label: translate('Timer Duration'),
    modelProperty: 'timerDefinition',

    get: function(element, node) {
      const type = 'timeDuration';
      const definition = type && timerEventDefinition.get(type);
      const value = definition && definition.get('body');
      return {
        timerDefinition: value
      };
    },

    set: function(element, values) {
      const type = 'timeDuration';
      let definition = type && timerEventDefinition.get(type);
      const commands = [];

      if (!definition) {
        definition = createFormalExpression(timerEventDefinition, {}, bpmnFactory);
        commands.push(cmdHelper.updateBusinessObject(element, timerEventDefinition, { 'timeDuration': definition }));
      }

      if (definition) {
        commands.push(cmdHelper.updateBusinessObject(element, definition, {
          body: values.timerDefinition || undefined
        }));
        return commands;
      }
    },

    validate: function(element) {
      const type = 'timeDuration';
      const definition = type && timerEventDefinition.get(type);
      if (definition) {
        const value = definition.get('body');
        if (!value) {
          return {
            timerDefinition: translate('Must provide a value')
          };
        }
      }
    }
  }));


}
