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
  classes as domClasses,
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
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

describe('customs - multi instance loop', function() {

  const diagramXML = require('./MultiInstanceLoop.bpmn');

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

  describe('of inputCollection', function() {

    let bo;

    describe('create', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_empty');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getZeebeLoopCharacteristics(bo)).to.be.undefined;

        const input = getInputField(
          container,
          'camunda-multiInstance-inputCollection',
          'inputCollection'
        );

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.inputCollection).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.be.undefined;
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.inputCollection).to.equal('foo');
      }));

    });


    describe('update', function() {

      let input, loopCharacteristics;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_1');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        loopCharacteristics = getZeebeLoopCharacteristics(bo);

        input = getInputField(
          container,
          'camunda-multiInstance-inputCollection',
          'inputCollection'
        );

        // when
        triggerValue(input, 'foo', 'change');
      }));


      describe('in the DOM', function() {

        it('should set input collection field as invalid', function() {

          // when
          triggerValue(input, '', 'change');

          // then
          expect(isInputInvalid(input)).to.be.true;
        });


        it('should execute', function() {

          // then
          expect(input.value).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(input.value).to.equal('inputCollection');
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
            expect(loopCharacteristics.inputCollection).not.to.exist;
          });


          it('should execute', function() {

            // then
            expect(loopCharacteristics.inputCollection).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(loopCharacteristics.inputCollection).to.equal('inputCollection');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(loopCharacteristics.inputCollection).to.equal('foo');
          }));

        });

      });

    });

  });


  describe('of inputElement', function() {

    let bo;

    describe('create', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_empty');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getZeebeLoopCharacteristics(bo)).to.be.undefined;

        const input = getInputField(
          container,
          'camunda-multiInstance-inputElement',
          'inputElement'
        );

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.inputElement).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.be.undefined;
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.inputElement).to.equal('foo');
      }));

    });


    describe('update', function() {

      let input, loopCharacteristics;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_1');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        loopCharacteristics = getZeebeLoopCharacteristics(bo);

        input = getInputField(
          container,
          'camunda-multiInstance-inputElement',
          'inputElement'
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
          expect(input.value).to.equal('inputElement');
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
            expect(loopCharacteristics.inputElement).not.to.exist;
          });


          it('should execute', function() {

            // then
            expect(loopCharacteristics.inputElement).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(loopCharacteristics.inputElement).to.equal('inputElement');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(loopCharacteristics.inputElement).to.equal('foo');
          }));

        });

      });

    });

  });


  describe('of outputCollection', function() {

    let bo;

    describe('create', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_empty');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getZeebeLoopCharacteristics(bo)).to.be.undefined;

        const input = getInputField(
          container,
          'camunda-multiInstance-outputCollection',
          'outputCollection'
        );

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.outputCollection).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.be.undefined;
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.outputCollection).to.equal('foo');
      }));

    });


    describe('update', function() {

      let input, loopCharacteristics;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_1');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        loopCharacteristics = getZeebeLoopCharacteristics(bo);

        input = getInputField(
          container,
          'camunda-multiInstance-outputCollection',
          'outputCollection'
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
          expect(input.value).to.equal('outputCollection');
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
            expect(loopCharacteristics.outputCollection).not.to.exist;
          });


          it('should execute', function() {

            // then
            expect(loopCharacteristics.outputCollection).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(loopCharacteristics.outputCollection).to.equal('outputCollection');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(loopCharacteristics.outputCollection).to.equal('foo');
          }));

        });

      });

    });

  });


  describe('of outputElement', function() {

    let bo;

    describe('create', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_empty');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // assume
        expect(getZeebeLoopCharacteristics(bo)).to.be.undefined;

        const input = getInputField(
          container,
          'camunda-multiInstance-outputElement',
          'outputElement'
        );

        // when
        triggerValue(input, 'foo', 'change');
      }));

      it('should execute', function() {

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.outputElement).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.be.undefined;
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        const loopCharacteristics = getZeebeLoopCharacteristics(bo);

        expect(loopCharacteristics).to.exist;
        expect(loopCharacteristics.outputElement).to.equal('foo');
      }));

    });


    describe('update', function() {

      let input, loopCharacteristics;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('ServiceTask_1');
        selection.select(shape);

        const bo = getBusinessObject(shape);

        loopCharacteristics = getZeebeLoopCharacteristics(bo);

        input = getInputField(
          container,
          'camunda-multiInstance-outputElement',
          'outputElement'
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
          expect(input.value).to.equal('outputElement');
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
            expect(loopCharacteristics.outputElement).not.to.exist;
          });


          it('should execute', function() {

            // then
            expect(loopCharacteristics.outputElement).to.equal('foo');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(loopCharacteristics.outputElement).to.equal('outputElement');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(loopCharacteristics.outputElement).to.equal('foo');
          }));

        });

      });

    });

  });

});


// helper /////////

const getZeebeLoopCharacteristics = (bo) => {

  const extensions = extensionElementsHelper.getExtensionElements(
    bo.loopCharacteristics,
    'zeebe:LoopCharacteristics'
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

function isInputInvalid(node) {
  return domClasses(node).has('invalid');
}