/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import BpmnRules from 'bpmn-js/lib/features/rules/BpmnRules';

import {
  find
} from 'min-dash';

import {
  isLabel
} from 'bpmn-js/lib/util/LabelUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';


import {
  isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';

import {
  getBoundaryAttachment as isBoundaryAttachment
} from 'bpmn-js/lib/features/snapping/BpmnSnappingUtil';

const HIGH_PRIORITY = 15000;

/**
 * Zeebe rule provider that allows to create boundary events with catch events
 *
 * See {@link CustomRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default class CustomRules extends BpmnRules {

  constructor(eventBus) {
    super(eventBus);
  }

  init() {
    super.init();
    this.addRule('shape.attach', HIGH_PRIORITY,(context) => {
      return this.canAttach(
        context.shape,
        context.target,
        null,
        context.position);
    });
  }

  canAttach(elements, target, source, position) {
    function isBoundaryEvent(element) {
      return !isLabel(element) && is(element, 'bpmn:BoundaryEvent');
    }

    /**
   * In Zeebe we treat IntermediateCatchEvents as boundary events too,
   * this must be reflected in the rules.
   */
    function isBoundaryCandidate(element) {
      return isBoundaryEvent(element) || (
        (
          is(element, 'bpmn:IntermediateCatchEvent') ||
          is(element, 'bpmn:IntermediateThrowEvent')
        ) && !element.parent
      );
    }

    function isForCompensation(e) {
      return getBusinessObject(e).isForCompensation;
    }

    function isReceiveTaskAfterEventBasedGateway(element) {
      return (
        is(element, 'bpmn:ReceiveTask') &&
        find(element.incoming, function(incoming) {
          return is(incoming.source, 'bpmn:EventBasedGateway');
        })
      );
    }

    if (!Array.isArray(elements)) {
      elements = [ elements ];
    }

    // disallow appending as boundary event
    if (source) {
      return false;
    }

    // only (re-)attach one element at a time
    if (elements.length !== 1) {
      return false;
    }

    const element = elements[0];

    // do not attach labels
    if (isLabel(element)) {
      return false;
    }

    // only handle boundary events
    if (!isBoundaryCandidate(element)) {
      return false;
    }

    // allow default move operation
    if (!target) {
      return true;
    }

    // disallow drop on event sub processes
    if (isEventSubProcess(target)) {
      return false;
    }

    // only allow drop on non compensation activities
    if (!is(target, 'bpmn:Activity') || isForCompensation(target)) {
      return false;
    }

    // only attach to subprocess border
    if (position && !isBoundaryAttachment(position, target)) {
      return false;
    }

    // do not attach on receive tasks after event based gateways
    if (isReceiveTaskAfterEventBasedGateway(target)) {
      return false;
    }

    return 'attach';
  }
}

CustomRules.$inject = [ 'eventBus' ];