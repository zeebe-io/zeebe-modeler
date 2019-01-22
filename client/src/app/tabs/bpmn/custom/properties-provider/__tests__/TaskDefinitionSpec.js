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
import propertiesProviderModule from '../';
import zeebeModdleExtensions from '../../zeebe-bpmn-moddle/zeebe';

describe('customs - task definition properties', function() {

  const diagramXML = require('./Task.bpmn');

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

  describe('of type', function() {

    let bo;

    describe('create', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('Task_1');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getTaskDefinitions(bo)).to.be.undefined;

        const input = getInputField(container, 'camunda-taskDefinitionType', 'type');

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        expect(getTaskDefinitions(bo)).to.exist;

      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getTaskDefinitions(bo)).to.be.undefined;

      }));

      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getTaskDefinitions(bo)).to.exist;

      }));

    });


    describe('update', function() {

      let input, taskDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('Task_2');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        taskDefinition = getTaskDefinitions(bo)[0];

        input = getInputField(container, 'camunda-taskDefinitionType', 'type');

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
          expect(input.value).to.equal('type');
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

            expect(taskDefinition.type).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(taskDefinition.type).to.equal('type');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(taskDefinition.type).to.equal('foo');
          }));

        });

      });

    });

  });


  describe('of retries', function() {

    let bo;

    describe('create', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('Task_1');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getTaskDefinitions(bo)).to.be.undefined;

        const input = getInputField(container, 'camunda-taskDefinitionRetries', 'retries');

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        expect(getTaskDefinitions(bo)).to.exist;

      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getTaskDefinitions(bo)).to.be.undefined;

      }));

      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getTaskDefinitions(bo)).to.exist;

      }));
    });


    describe('update', function() {

      let input, taskDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('Task_2');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        taskDefinition = getTaskDefinitions(bo)[0];

        input = getInputField(container, 'camunda-taskDefinitionRetries', 'retries');

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
          expect(input.value).to.equal('retries');
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

            expect(taskDefinition.retries).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(taskDefinition.retries).to.equal('retries');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(taskDefinition.retries).to.equal('foo');
          }));

        });

      });

    });

  });

});


// helper /////////

const getTaskDefinitions = (bo) => {
  return extensionElementsHelper.getExtensionElements(bo, 'zeebe:TaskDefinition');
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