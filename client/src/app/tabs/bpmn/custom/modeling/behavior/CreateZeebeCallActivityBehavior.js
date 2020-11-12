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

import { getCalledElement } from '../helper/CalledElementHelper';

import inherits from 'inherits';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

const HIGH_PRIORITY = 15000;

/**
 * BPMN specific create zeebe call activity behavior
 */
export default function CreateZeebeCallActivityBehavior(
    eventBus, bpmnFactory) {

  CommandInterceptor.call(this, eventBus);

  /**
   * add a zeebe:calledElement extensionElement with
   * propagateAllChildVariables attribute = false when creating
   * a bpmn:callActivity
   */
  this.postExecuted('shape.create', HIGH_PRIORITY, function(context) {
    const {
      shape
    } = context;

    if (!is(shape, 'bpmn:CallActivity')) {
      return;
    }

    const bo = getBusinessObject(shape);

    // Reuse ExtensionElement if existing
    const extensionElements = bo.get('extensionElements') ||
      elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);

    // Ensure we have a calledElement
    let calledElement = getCalledElement(bo);

    if (!calledElement) {
      calledElement = bpmnFactory.create('zeebe:CalledElement', {});
      calledElement.propagateAllChildVariables = false;

      extensionElements.get('values').push(
        calledElement
      );

      bo.extensionElements = extensionElements;

      // Handle existing callActivities
    } else if (!calledElement.hasOwnProperty('propagateAllChildVariables')) {
      calledElement.propagateAllChildVariables = false;
    }

  }, true);
}


CreateZeebeCallActivityBehavior.$inject = [
  'eventBus',
  'bpmnFactory'
];

inherits(CreateZeebeCallActivityBehavior, CommandInterceptor);
