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

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '../';

describe('customs - condition expression properties', function() {

  const diagramXML = require('./SequenceFlow.bpmn');

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

  describe('of conditionExpression', function() {

    describe('creation', function() {

      let bo;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('SequenceFlow_1');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getConditionExpression(bo)).to.be.undefined;

        const input = getInputField(container, 'zeebe-condition', 'condition');

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        expect(getConditionExpression(bo)).to.exist;

      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getConditionExpression(bo)).to.be.undefined;

      }));

      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getConditionExpression(bo)).to.exist;

      }));

    });

    describe('update', function() {

      let input, bo;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('SequenceFlow_2');
        selection.select(shape);

        bo = getBusinessObject(shape);

        input = getInputField(container, 'zeebe-condition', 'condition');

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
          expect(input.value).to.equal('condition');
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
            expect(getConditionExpression(bo).body).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getConditionExpression(bo).body).to.equal('condition');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getConditionExpression(bo).body).to.equal('foo');
          }));

        });

      });
    });

  });

});


// helper /////////

const getConditionExpression = (bo) => {
  return bo.get('conditionExpression');
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