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
  triggerValue,
  triggerEvent,
  selectedByOption
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
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

describe('customs - error properties', function() {

  const diagramXML = require('./Error.bpmn');

  const testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  const moddleExtensions = {
    zeebe: zeebeModdleExtensions
  };

  let container, errorEventDefinition;

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

  describe('get', function() {

    describe('Error boundary event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('BoundaryErrorEvent');
        selection.select(shape);

        let bo = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(bo);

      }));

      describe('should get the Error Name', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');

        });

        it('in the DOM', function() {

          expect(field.value).to.equal('Error2');

        });


        it('on the business object', function() {

          expect(errorEventDefinition.errorRef.name).to.equal('Error2');

        });

      });


      describe('should get the Error Code', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

        });

        it('in the DOM', function() {

          expect(field.value).to.equal('code2');

        });


        it('on the business object', function() {

          expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

        });

      });

    });


    describe('Error start event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('StartErrorEvent');
        selection.select(shape);

        let bo = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(bo);

      }));

      describe('should get the Error Name', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');

        });

        it('in the DOM', function() {

          expect(field.value).to.equal('Error1');

        });


        it('on the business object', function() {

          expect(errorEventDefinition.errorRef.name).to.equal('Error1');

        });

      });


      describe('should get the Error Code', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

        });

        it('in the DOM', function() {

          expect(field.value).to.equal('code1');

        });


        it('on the business object', function() {

          expect(errorEventDefinition.errorRef.errorCode).to.equal('code1');

        });

      });

    });


    describe('Error end event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('ErrorEndEvent');
        selection.select(shape);

        let bo = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(bo);

      }));

      describe('should get the Error Name', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');

        });

        it('in the DOM', function() {

          expect(field.value).to.equal('Error3');

        });


        it('on the business object', function() {

          expect(errorEventDefinition.errorRef.name).to.equal('Error3');

        });

      });


      describe('should get the Error Code', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

        });

        it('in the DOM', function() {

          expect(field.value).to.equal('code3');

        });


        it('on the business object', function() {

          expect(errorEventDefinition.errorRef.errorCode).to.equal('code3');

        });

      });

    });

  });


  describe('set', function() {

    describe('Error boundary event', function() {

      describe('should set the Error Name', function() {

        let field;

        beforeEach(inject(function(elementRegistry, selection) {

          let item = elementRegistry.get('BoundaryErrorEvent');
          selection.select(item);

          let businessObject = item.businessObject;
          errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

          field = getInputField(container, 'camunda-error-element-name', 'name');

          triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('FOO');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(errorEventDefinition.errorRef.name).to.equal('FOO');

          }));

        });

      });


      describe('should set the Error Code', function() {

        let errorEventDefinition, field;

        beforeEach(inject(function(elementRegistry, selection) {

          let item = elementRegistry.get('BoundaryErrorEvent');
          selection.select(item);

          let businessObject = item.businessObject;
          errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

          triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('FOO');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('FOO');

          }));

        });

      });

    });


    describe('Error start event', function() {

      describe('should set the Error Name', function() {

        let field;

        beforeEach(inject(function(elementRegistry, selection) {

          let item = elementRegistry.get('StartErrorEvent');
          selection.select(item);

          let businessObject = item.businessObject;
          errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

          field = getInputField(container, 'camunda-error-element-name', 'name');

          triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('FOO');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(errorEventDefinition.errorRef.name).to.equal('FOO');

          }));

        });

      });


      describe('should set the Error Code', function() {

        let errorEventDefinition, field;

        beforeEach(inject(function(elementRegistry, selection) {

          let item = elementRegistry.get('StartErrorEvent');
          selection.select(item);

          let businessObject = item.businessObject;
          errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

          triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('FOO');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('FOO');

          }));

        });

      });

    });


    describe('Error end event', function() {

      describe('should set the Error Name', function() {

        let field;

        beforeEach(inject(function(elementRegistry, selection) {

          let item = elementRegistry.get('ErrorEndEvent');
          selection.select(item);

          let businessObject = item.businessObject;
          errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

          field = getInputField(container, 'camunda-error-element-name', 'name');

          triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('FOO');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(errorEventDefinition.errorRef.name).to.equal('FOO');

          }));

        });

      });


      describe('should set the Error Code', function() {

        let errorEventDefinition, field;

        beforeEach(inject(function(elementRegistry, selection) {

          let item = elementRegistry.get('ErrorEndEvent');
          selection.select(item);

          let businessObject = item.businessObject;
          errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

          triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('FOO');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.equal('FOO');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('FOO');

          }));

        });

      });

    });

  });


  describe('remove', function() {

    describe('Error boundary event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('BoundaryErrorEvent');
        selection.select(shape);

        let businessObject = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

      }));

      describe('should remove the Error Name', function() {

        let field, button;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');
          button = getClearButton(container, 'error-element-name');

          triggerEvent(button, 'click');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).is.empty;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).is.empty;

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.be.undefined;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.name).to.be.undefined;

          }));

        });

      });


      describe('should remove the Error Code', function() {

        let field, button;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');
          button = getClearButton(container, 'error-element-code');

          triggerEvent(button, 'click');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).is.empty;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).is.empty;

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.be.undefined;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.be.undefined;

          }));

        });

      });

    });


    describe('Error start event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('StartErrorEvent');
        selection.select(shape);

        let businessObject = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

      }));

      describe('should remove the Error Name', function() {

        let field, button;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');
          button = getClearButton(container, 'error-element-name');

          triggerEvent(button, 'click');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).is.empty;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).is.empty;

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.be.undefined;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.name).to.be.undefined;

          }));

        });

      });


      describe('should remove the Error Code', function() {

        let field, button;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');
          button = getClearButton(container, 'error-element-code');

          triggerEvent(button, 'click');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).is.empty;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).is.empty;

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.be.undefined;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.be.undefined;

          }));

        });

      });

    });


    describe('Error end event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('ErrorEndEvent');
        selection.select(shape);

        let businessObject = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

      }));

      describe('should remove the Error Name', function() {

        let field, button;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');
          button = getClearButton(container, 'error-element-name');

          triggerEvent(button, 'click');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).is.empty;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).is.empty;

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.be.undefined;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.name).to.be.undefined;

          }));

        });

      });


      describe('should remove the Error Code', function() {

        let field, button;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');
          button = getClearButton(container, 'error-element-code');

          triggerEvent(button, 'click');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).is.empty;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).is.empty;

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.be.undefined;

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.be.undefined;

          }));

        });

      });

    });

  });


  describe('switch', function() {

    describe('Error boundary event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('BoundaryErrorEvent');
        selection.select(shape);

        let businessObject = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

        let selectField = getSelectField(container, 'event-definitions-error', 'selectedElement');
        selectedByOption(selectField, 'Error_1scwdln');
        triggerEvent(selectField, 'change');

      }));

      describe('should switch the Error Name', function() {

        let field;

        beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

          field = getInputField(container, 'camunda-error-element-name', 'name');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('Error1');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('Error1');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.equal('Error1');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error1');

          }));

        });

      });


      describe('should switch the Error Code', function() {

        let field;

        beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('code1');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('code1');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.equal('code1');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code1');

          }));

        });

      });

    });


    describe('Error start event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('StartErrorEvent');
        selection.select(shape);

        let businessObject = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

        let selectField = getSelectField(container, 'event-definitions-error', 'selectedElement');
        selectedByOption(selectField, 'Error_0slq64n');
        triggerEvent(selectField, 'change');

      }));

      describe('should switch the Error Name', function() {

        let field;

        beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

          field = getInputField(container, 'camunda-error-element-name', 'name');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('Error2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('Error2');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          }));

        });

      });


      describe('should switch the Error Code', function() {

        let field;

        beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('code2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('code2');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code1');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          }));

        });

      });

    });


    describe('Error end event', function() {

      beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

        container = propertiesPanel._container;

        let shape = elementRegistry.get('ErrorEndEvent');
        selection.select(shape);

        let businessObject = getBusinessObject(shape);
        errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(businessObject);

        let selectField = getSelectField(container, 'event-definitions-error', 'selectedElement');
        selectedByOption(selectField, 'Error_0slq64n');
        triggerEvent(selectField, 'change');

      }));

      describe('should switch the Error Name', function() {

        let field;

        beforeEach(function() {

          field = getInputField(container, 'camunda-error-element-name', 'name');

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('Error2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('Error3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('Error2');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.name).to.equal('Error2');

          }));

        });

      });


      describe('should switch the Error Code', function() {

        let field;

        beforeEach(inject(function(elementRegistry, propertiesPanel, selection) {

          field = getInputField(container, 'camunda-error-element-code', 'errorCode');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {

            expect(field.value).to.equal('code2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(field.value).to.equal('code3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(field.value).to.equal('code2');

          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          });


          it('should undo', inject(function(commandStack) {

            commandStack.undo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code3');

          }));


          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();
            expect(errorEventDefinition.errorRef.errorCode).to.equal('code2');

          }));

        });

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

const getClearButton = (container, selector) => {
  return domQuery('div[data-entry=' + selector + '] button[data-action=clear]', container);
};

const getSelectField = (container, entryId, selectName) => {
  var selector = 'select' + (selectName ? '[name="' + selectName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
};
