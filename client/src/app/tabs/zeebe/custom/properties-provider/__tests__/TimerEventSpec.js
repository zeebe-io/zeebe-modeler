import {
  bootstrapModeler,
  inject
} from 'bpmn-js/test/helper';

import {
  triggerValue
} from './helper';

import TestContainer from 'mocha-test-container-support';

import propertiesPanelModule from 'bpmn-js-properties-panel';

import {
  query as domQuery
} from 'min-dom';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '../';

describe('customs - timer-event properties', function() {

  const diagramXML = require('./TimerEvent.bpmn');

  const testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  beforeEach(inject(function(commandStack, propertiesPanel) {

    const undoButton = document.createElement('button');
    undoButton.textContent = 'UNDO';

    undoButton.addEventListener('click', () => {
      commandStack.undo();
    });

    container.appendChild(undoButton);

    propertiesPanel.attachTo(container);
  }));

  describe('of time duration', function() {

    let input, timeDuration;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('TimerEvent_1');
      selection.select(shape);

      const bo = getBusinessObject(shape);
      const timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
      timeDuration = timerDefinition.timeDuration;

      input = getInputField(container, 'camunda-timer-event-duration', 'timerDefinition');

      // when
      triggerValue(input, 'foo', 'change');

    }));

    describe('in the DOM', function() {

      it('should execute', function() {
        // then
        expect(input.value).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        expect(input.value).to.equal('duration');
      }));


      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(input.value).to.equal('foo');
      }));


      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(timeDuration.body).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(timeDuration.body).to.equal('duration');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(timeDuration.body).to.equal('foo');
        }));

      });

    });

  });

});


// helper /////////

const getGeneralTab = (container) => {
  return domQuery('div[data-tab="general"]', container);
};

const getDetailsGroup = (container) => {
  const tab = getGeneralTab(container);
  return domQuery('div[data-group="details"]', tab);
};

const getEntry = (container, entryId) => {
  return domQuery('div[data-entry="' + entryId + '"]', getDetailsGroup(container));
};

const getInputField = (container, entryId, inputName) => {
  const selector = 'input' + (inputName ? '[name="' + inputName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
};