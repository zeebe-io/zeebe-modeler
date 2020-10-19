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

export default function(group, bpmnFactory, timerEventDefinition, timerOptions, translate) {

  const selectOptions = timerOptions;

  group.entries.push(entryFactory.selectBox(translate, {
    id: 'timer-event-definition-type',
    label: translate('Timer Definition Type'),
    selectOptions: selectOptions,
    emptyParameter: true,
    modelProperty: 'timerDefinitionType',

    get: function(element, node) {
      return {
        timerDefinitionType: getTimerDefinitionType(timerEventDefinition) || ''
      };
    },

    set: function(element, values) {
      const props = {
        timeDuration: undefined,
        timeDate: undefined,
        timeCycle: undefined
      };

      const newType = values.timerDefinitionType;
      if (values.timerDefinitionType) {
        const oldType = getTimerDefinitionType(timerEventDefinition);

        let value;
        if (oldType) {
          const definition = timerEventDefinition.get(oldType);
          value = definition.get('body');
        }

        props[newType] = createFormalExpression(timerEventDefinition, value, bpmnFactory);
      }

      return cmdHelper.updateBusinessObject(element, timerEventDefinition, props);
    }

  }));

  group.entries.push(entryFactory.textField(translate, {
    id: 'timer-event-definition',
    label: translate('Timer Definition'),
    modelProperty: 'timerDefinition',

    get: function(element, node) {
      const type = getTimerDefinitionType(timerEventDefinition);
      const definition = type && timerEventDefinition.get(type);
      const value = definition && definition.get('body');
      return {
        timerDefinition: value
      };
    },

    set: function(element, values) {
      const type = getTimerDefinitionType(timerEventDefinition);
      const definition = type && timerEventDefinition.get(type);

      if (definition) {
        return cmdHelper.updateBusinessObject(element, definition, {
          body: values.timerDefinition || undefined
        });
      }
    },

    validate: function(element) {
      const type = getTimerDefinitionType(timerEventDefinition);
      const definition = type && timerEventDefinition.get(type);
      if (definition) {
        const value = definition.get('body');
        if (!value) {
          return {
            timerDefinition: translate('Must provide a value')
          };
        }
      }
    },

    hidden: function(element) {
      return !getTimerDefinitionType(timerEventDefinition);
    }

  }));
}

// helper //////////

/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */
const getTimerDefinitionType = (timer) => {
  const timeDate = timer.get('timeDate');
  if (typeof timeDate !== 'undefined') {
    return 'timeDate';
  }

  const timeCycle = timer.get('timeCycle');
  if (typeof timeCycle !== 'undefined') {
    return 'timeCycle';
  }

  const timeDuration = timer.get('timeDuration');
  if (typeof timeDuration !== 'undefined') {
    return 'timeDuration';
  }
};

/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @return {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
const createFormalExpression= (parent, body, bpmnFactory) => {
  body = body || undefined;
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
};
