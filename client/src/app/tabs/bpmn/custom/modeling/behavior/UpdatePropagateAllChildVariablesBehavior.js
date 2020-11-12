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

import inherits from 'inherits';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import {
  getCalledElement,
  isPropagateAllChildVariables
} from '../helper/CalledElementHelper';

import {
  getInputParameters,
  getOutputParameters,
  getInputOutput
} from '../../properties-provider/helper/InputOutputHelper';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

const HIGH_PRIORITY = 15000;


/**
 * UpdatePropagateAllChildVariablesBehavior reacts to either (1) toggling on propagateAllChildVariables
 * when there are outputParameters present or (2) to adding outputParameters when
 * propagateAllChildVariables is set to true.
 * It will ensure that the propagateAllChildVariables attribute on calledElement
 * extensionElements for callActivities is always consistent with outputParameter mappings
 */
export default function UpdatePropagateAllChildVariablesBehavior(
    eventBus) {

  CommandInterceptor.call(this, eventBus);

  // Behavior when toggling propagateAllChildVariables /////////////////////////
  /**
   * remove outputParameters from zeebe:IoMapping when setting propgateAlLChildVariables
   * to true in the proeprties panel
   */
  this.executed('properties-panel.update-businessobject' , HIGH_PRIORITY, function(context) {
    const {
      element,
      properties
    } = context;

    // (1) Don't execute this behavior if we are not in a call activity or not
    // have properties to update or not update the propagateAllChildVariables
    // to false
    if (!is(element, 'bpmn:CallActivity') ||
        !properties ||
        !!properties.propagateAllChildVariables === false) {
      return;
    }

    // (2) Check whether we have outputParameters
    const outputParameters = getOutputParameters(element),
          inputParameters = getInputParameters(element);

    if (!outputParameters ||
      outputParameters.length === 0) {
      return;
    }

    // (3) Store old outputParameters and remove them
    context.oldOutputParameters = outputParameters;

    const inputOutput = getInputOutput(element);
    inputOutput.outputParameters = [];

    // (4) if we also have no inputParameters, store IOMapping and remove it
    if (!inputParameters || inputParameters.length === 0) {
      const extensionElements = getBusinessObject(element).extensionElements;
      context.oldExtensionElements = extensionElements.values;

      extensionElements.values = extensionElements.values.filter(ele => ele.$type !== 'zeebe:IoMapping');
    }
  }, true);

  // Revert behavior when toggling propagateAllChildVariables //////////////////
  this.reverted('properties-panel.update-businessobject', HIGH_PRIORITY, function(context) {
    const {
      element,
      oldOutputParameters,
      oldExtensionElements
    } = context;

    // (1) Only intercept the revert, if the behavior became active
    if (oldOutputParameters) {

      // (2) If we removed the IOMapping, bring it back first
      if (oldExtensionElements) {
        const extensionElements = getBusinessObject(element).extensionElements;

        extensionElements.values = oldExtensionElements;
      }

      // (3) Bring back the outputParameters
      const inputOutput = getInputOutput(element);
      inputOutput.outputParameters = oldOutputParameters;
    }
  }, true);


  // Behavior when adding outputParameters ////////////////////////////////////
  /**
   * un-toggle propgateAlLChildVariables when adding output parameters
   */
  this.executed('properties-panel.update-businessobject-list' , HIGH_PRIORITY, function(context) {
    const {
      element,
      objectsToAdd
    } = context;


    // (1) Exit if we are not in a CallActivity, not adding an OutputParameter or not
    // having set propagateAllChildVariables to false
    if (!is(element, 'bpmn:CallActivity') ||
     !objectsToAdd ||
     objectsToAdd.length === 0 ||
     objectsToAdd.filter(obj => is(obj, 'zeebe:Output')).length === 0 ||
    isPropagateAllChildVariables(element) === false) {
      return;
    }

    // (2) Store the old propAllChildVariables value and update it then
    const bo = getBusinessObject(element),
          calledElement = getCalledElement(bo);

    context.oldPropagateAllChildVariables = true;

    calledElement.propagateAllChildVariables = false;
  }, true);

  // Revert behavior when adding outputParmaeters ////////////////////////////////////
  this.reverted('properties-panel.update-businessobject-list' , HIGH_PRIORITY, function(context) {
    const {
      element,
      oldPropagateAllChildVariables
    } = context;

    // (1) Only intercept the revert, if the behavior became active
    if (oldPropagateAllChildVariables) {
      const bo = getBusinessObject(element),
            calledElement = getCalledElement(bo);

      calledElement.propagateAllChildVariables = oldPropagateAllChildVariables;
    }
  }, true);


}


UpdatePropagateAllChildVariablesBehavior.$inject = [
  'eventBus'
];


inherits(UpdatePropagateAllChildVariablesBehavior, CommandInterceptor);
