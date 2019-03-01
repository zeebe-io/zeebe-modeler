/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */
function getTimerDefinitionType(timer) {
  var timeDate = timer.get('timeDate');
  if (typeof timeDate !== 'undefined') {
    return 'timeDate';
  }

  var timeCycle = timer.get('timeCycle');
  if (typeof timeCycle !== 'undefined') {
    return 'timeCycle';
  }

  var timeDuration = timer.get('timeDuration');
  if (typeof timeDuration !== 'undefined') {
    return 'timeDuration';
  }
}

/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @return {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
function createFormalExpression(parent, body, bpmnFactory) {
  body = body || undefined;
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
}

export default class TimerEventDefinition {

  constructor(group, element, bpmnFactory, timerEventDefinition, timerOptions) {

    var selectOptions = timerOptions;

    group.entries.push(entryFactory.selectBox({
      id: 'timer-event-definition-type',
      label: 'Timer Definition Type',
      selectOptions: selectOptions,
      emptyParameter: true,
      modelProperty: 'timerDefinitionType',

      get: function(element, node) {
        return {
          timerDefinitionType: getTimerDefinitionType(timerEventDefinition) || ''
        };
      },

      set: function(element, values) {
        var props = {
          timeDuration: undefined,
          timeDate: undefined,
          timeCycle: undefined
        };

        var newType = values.timerDefinitionType;
        if (values.timerDefinitionType) {
          var oldType = getTimerDefinitionType(timerEventDefinition);

          var value;
          if (oldType) {
            var definition = timerEventDefinition.get(oldType);
            value = definition.get('body');
          }

          props[newType] = createFormalExpression(timerEventDefinition, value, bpmnFactory);
        }

        return cmdHelper.updateBusinessObject(element, timerEventDefinition, props);
      }

    }));

    group.entries.push(entryFactory.textField({
      id: 'timer-event-definition',
      label: 'Timer Definition',
      modelProperty: 'timerDefinition',

      get: function(element, node) {
        var type = getTimerDefinitionType(timerEventDefinition);
        var definition = type && timerEventDefinition.get(type);
        var value = definition && definition.get('body');
        return {
          timerDefinition: value
        };
      },

      set: function(element, values) {
        var type = getTimerDefinitionType(timerEventDefinition);
        var definition = type && timerEventDefinition.get(type);

        if (definition) {
          return cmdHelper.updateBusinessObject(element, definition, {
            body: values.timerDefinition || undefined
          });
        }
      },

      validate: function(element) {
        var type = getTimerDefinitionType(timerEventDefinition);
        var definition = type && timerEventDefinition.get(type);
        if (definition) {
          var value = definition.get('body');
          if (!value) {
            return {
              timerDefinition: 'Must provide a value'
            };
          }
        }
      },

      hidden: function(element) {
        return !getTimerDefinitionType(timerEventDefinition);
      }

    }));
  }
}