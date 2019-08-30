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
  bootstrapModeler,
  getBpmnJS,
  insertCSS,
} from 'bpmn-js-properties-panel/test/helper';

import {
  attr as domAttr,
  query as domQuery,
  queryAll as domQueryAll

} from 'min-dom';


insertCSS('diagram-js.css', require('bpmn-js/dist/assets/diagram-js.css'));
insertCSS('bpmn-embedded.css', require('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'));

insertCSS('diagram-js-testing.css',
  '.test-container .result { height: auto; }' +
  '.bpp-container { height: 400px !important; }' +
  ' div.test-container {height: auto}'
);


/**
 * Bootstrap a modeler instance.
 *
 * Before a modeler instance is bootstrapped any previous
 * existing modeler instance is destroyed, if it exists.
 *
 * Due to the fact that (almost) each test case bootstrap a new
 * modeler instance, destroying of an previous modeler instance
 * is necessary to speed the test execution up.
 */
bootstrapModeler = (diagram, options, locals) => {
  return function(done) {
    const previousInstance = getBpmnJS();

    if (previousInstance) {
      const container = previousInstance._container.parentNode;

      container.parentNode.removeChild(container);

      previousInstance.destroy();
    }
    return bootstrapModeler(diagram, options, locals).apply(this, [ done ]);
  };
};

/**
 * Overwrites the existing global bootstrapModeler().
 */
global.bootstrapModeler = bootstrapModeler;

/**
 * Triggers a change event
 *
 * @param element on which the change should be triggered
 * @param eventType type of the event (e.g. click, change, ...)
 */
export function triggerEvent(element, eventType) {

  let evt;

  eventType = eventType || 'change';

  if (document.createEvent) {
    try {

      // Chrome, Safari, Firefox
      evt = new MouseEvent((eventType), {
        view: window,
        bubbles: true,
        cancelable: true
      });
    } catch (e) {

      // IE 11, PhantomJS (wat!)
      evt = document.createEvent('MouseEvent');

      evt.initEvent((eventType), true, true);
    }
    return element.dispatchEvent(evt);
  } else {

    // Welcome IE
    evt = document.createEventObject();

    return element.fireEvent('on' + eventType, evt);
  }
}

/**
 * Set the new value to the given element.
 *
 * @param element on which the change should be triggered
 * @param value new value for the element
 * @param eventType (optional) type of the event (e.g. click, change, ...)
 * @param cursorPosition (optional) position ot the cursor after changing
 *                                  the value
 */
export function triggerValue(element, value, eventType, cursorPosition) {
  if (typeof eventType == 'number') {
    cursorPosition = eventType;
    eventType = null;
  }

  element.focus();

  if (domAttr(element, 'contenteditable')) {
    element.innerText = value;
  } else {
    element.value = value;
  }

  if (cursorPosition) {
    element.selectionStart = cursorPosition;
    element.selectionEnd = cursorPosition;
  }

  triggerEvent(element, eventType);
}

export function triggerInput(element, value) {
  element.value = value;

  triggerEvent(element, 'input');

  element.focus();
}

export function triggerKeyEvent(element, event, code) {
  let e = document.createEvent('Events');

  if (e.initEvent) {
    e.initEvent(event, true, true);
  }

  e.keyCode = code;
  e.which = code;

  element.dispatchEvent(e);
}


/**
 * Select a form field with the specified index in the DOM
 *
 * @param  {number} index
 * @param  {DOMElement} container
 */
export function triggerFormFieldSelection(index, container) {
  let formFieldSelectBox = domQuery(
    'select[name=selectedExtensionElement]',
    container
  );

  formFieldSelectBox.options[index].selected = 'selected';
  triggerEvent(formFieldSelectBox, 'change');
}

/**
 *  Select the option with the given value
 *
 *  @param element contains the options
 *  @param optionValue value which should be selected
 */
export function selectedByOption(element, optionValue) {

  const options = domQueryAll('option', element);

  for (let i = 0; i< options.length; i++) {

    const option = options[i];

    if (option.value === optionValue) {
      element.selectedIndex = i;
      break;
    }
  }
}

/**
 * PhantomJS Speciality
 * @param element
 * @returns {*}
 */
export function selectedByIndex(element) {
  if (!element) {
    return null;
  }

  return element.options[element.selectedIndex];
}