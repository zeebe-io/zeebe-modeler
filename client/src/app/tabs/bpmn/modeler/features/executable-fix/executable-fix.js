/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

/**
 * Fix bpmn:Process#isExecutable to always be set to either
 * true or false after edit.
 *
 * This is an initializer that may be passed to a modules
 * __init__ block.
 *
 * @param {EventBus} eventBus
 */
function fixIsExecutable(eventBus) {

  function fixIfProcess(element) {

    // exclude labels
    if (element.labelTarget) {
      return;
    }

    var bo = getBusinessObject(element);

    if (is(bo, 'bpmn:Participant')) {
      bo = bo.processRef;
    }

    if (is(bo, 'bpmn:Process')) {
      bo.isExecutable = !!bo.isExecutable;
    }
  }

  eventBus.on([ 'shape.added', 'root.added' ], function(event) {
    fixIfProcess(event.element);
  });

  eventBus.on('elements.changed', function(event) {

    var elements = event.elements;

    elements.forEach(function(element) {
      fixIfProcess(element);
    });

  });
}

fixIsExecutable.$inject = [ 'eventBus' ];

module.exports = fixIsExecutable;