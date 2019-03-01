/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '../';
import zeebeModdleExtensions from '../../zeebe-bpmn-moddle/zeebe';

describe('customs - message properties', function() {

  const diagramXML = require('./Message.bpmn');

  const testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  const moddleExtensions = {
    zeebe: zeebeModdleExtensions
  };

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules,
    moddleExtensions
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

  describe('on ReceiveTask', function() {

    describe('of correlationKey', function() {

      let input, subscriptionDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('MessageTask_1');
        selection.select(shape);

        const bo = getBusinessObject(shape).messageRef;

        subscriptionDefinition = getSubscriptionDefinitions(bo)[0];

        input = getInputField(
          container, 'camunda-message-element-subscription', 'correlationKey');

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
          expect(input.value).to.equal('subscription');
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

            expect(subscriptionDefinition.correlationKey).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(subscriptionDefinition.correlationKey).to.equal('subscription');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(subscriptionDefinition.correlationKey).to.equal('foo');
          }));

        });

      });

    });

  });

  describe('on IntermediateEvent', function() {

    describe('of correlationKey', function() {

      let input, subscriptionDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('MessageEvent_1');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        const messageEventDefinition =
          eventDefinitionHelper.getMessageEventDefinition(bo);

        const messageRef = messageEventDefinition.messageRef;

        subscriptionDefinition = getSubscriptionDefinitions(messageRef)[0];

        input = getInputField(
          container, 'camunda-message-element-subscription', 'correlationKey');

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
          expect(input.value).to.equal('subscription');
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

            expect(subscriptionDefinition.correlationKey).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(subscriptionDefinition.correlationKey).to.equal('subscription');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(subscriptionDefinition.correlationKey).to.equal('foo');
          }));

        });

      });

    });

  });

});


// helper /////////

const getSubscriptionDefinitions = (bo) => {
  return extensionElementsHelper.getExtensionElements(bo, 'zeebe:Subscription');
};

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