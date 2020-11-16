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
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
  escapeHTML
} from 'bpmn-js-properties-panel/lib/Utils';

import {
  query as domQuery
} from 'min-dom';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

export default function(group, element, bpmnFactory, translate) {
  const bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  if (!isConditionalSource(element.source)) {
    return;
  }

  group.entries.push({
    id: 'condition',
    label: translate('Condition expression'),
    html:  // expression
            `<div class="bpp-row">
              <label for="zeebe-condition">
                ${escapeHTML(translate('Condition expression'))}
              </label>
              <div class="bpp-field-wrapper">
                <input id="zeebe-condition" type="text" name="condition" />
                <button class="action-button clear" data-action="clear" data-show="canClear">
                 <span>X</span>
                </button>
              </div>
            </div>`,

    get: function(element, propertyName) {

      // read values from xml:
      const conditionExpression = bo.conditionExpression;

      const values = {};
      let conditionType = '';

      if (conditionExpression) {
        conditionType = 'expression';
        values.condition = conditionExpression.get('body');
      }

      values.conditionType = conditionType;

      return values;
    },

    set: function(element, values, containerElement) {
      const conditionType = 'expression';
      const commands = [];

      const conditionProps = {
        body: undefined
      };

      const condition = values.condition;
      conditionProps.body = condition;

      const update = {
        'conditionExpression': undefined
      };

      if (conditionType) {
        update.conditionExpression = elementHelper.createElement(
          'bpmn:FormalExpression',
          conditionProps,
          bo,
          bpmnFactory
        );

        const source = element.source;

        // if default-flow, remove default-property from source
        if (source.businessObject.default === bo) {
          commands.push(cmdHelper.updateProperties(source, { 'default': undefined }));
        }
      }

      commands.push(cmdHelper.updateBusinessObject(element, bo, update));

      return commands;
    },

    validate: function(element, values) {
      const validationResult = {};

      if (!values.condition && values.conditionType === 'expression') {
        validationResult.condition = 'Must provide a value';
      }

      return validationResult;
    },

    isExpression: function(element, inputNode) {
      const conditionType = domQuery('select[name=conditionType]', inputNode);
      if (conditionType.selectedIndex >= 0) {
        return conditionType.options[conditionType.selectedIndex].value === 'expression';
      }
    },

    clear: function(element, inputNode) {

      // clear text input
      domQuery('input[name=condition]', inputNode).value = '';

      return true;
    },

    canClear: function(element, inputNode) {
      const input = domQuery('input[name=condition]', inputNode);

      return input.value !== '';
    },

    cssClasses: ['bpp-textfield']
  });
}


// helper //////////////////////////

const CONDITIONAL_SOURCES = [
  'bpmn:Activity',
  'bpmn:ExclusiveGateway',
  'bpmn:InclusiveGateway',
  'bpmn:ComplexGateway'
];

function isConditionalSource(element) {
  return isAny(element, CONDITIONAL_SOURCES);
}
