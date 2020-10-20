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

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '..';
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

describe('customs - call activity', function() {

  const diagramXML = require('./CallActivity.bpmn');

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


  describe('of processId', function() {

    let bo;

    describe('create', function() {

      function changeInputValue(value) {
        const input = getInputField(
          container,
          'camunda-callActivity-processId',
          'processId'
        );

        triggerValue(input, value, 'change');
      }

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('CallActivity_empty');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getCalledElement(bo)).to.be.undefined;
      }));

      it('should fail', function() {

        // when
        changeInputValue('123');

        // then
        const calledElement = getCalledElement(bo);

        expect(calledElement).to.exist;
        expect(calledElement.processId).to.be.undefined;
      });

      it('should execute', function() {

        // when
        changeInputValue('foo');

        // then
        const calledElement = getCalledElement(bo);

        expect(calledElement).to.exist;
        expect(calledElement.processId).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        changeInputValue('foo');
        commandStack.undo();

        // then
        const calledElement = getCalledElement(bo);

        expect(calledElement).to.be.undefined;
      }));


      it('should redo', inject(function(commandStack) {

        // when
        changeInputValue('foo');

        commandStack.undo();
        commandStack.redo();

        // then
        const calledElement = getCalledElement(bo);

        expect(calledElement).to.exist;
        expect(calledElement.processId).to.equal('foo');
      }));

    });


    describe('update', function() {

      let input, calledElement;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('CallActivity_1');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        calledElement = getCalledElement(bo);

        input = getInputField(
          container,
          'camunda-callActivity-processId',
          'processId'
        );

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
          expect(input.value).to.equal('processId');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(input.value).to.equal('foo');
        }));


        describe('on the business object', function() {

          it('should remove', function() {

            // when
            triggerValue(input, '', 'change');

            // then
            expect(calledElement.processId).not.to.exist;
          });


          it('should execute', function() {

            // then
            expect(calledElement.processId).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(calledElement.processId).to.equal('processId');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(calledElement.processId).to.equal('foo');
          }));

        });

      });

    });

  });

});


// helper /////////

const getCalledElement = (bo) => {

  const extensions = extensionElementsHelper.getExtensionElements(
    bo,
    'zeebe:CalledElement'
  );
  return (extensions || [])[0];
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