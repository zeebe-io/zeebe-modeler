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
  triggerEvent,
  triggerValue
} from './helper';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import TestContainer from 'mocha-test-container-support';

/* global sinon */

import { is } from 'bpmn-js/lib/util/ModelUtil';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import {
  classes as domClasses,
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import coreModule from 'bpmn-js/lib/core';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '..';
import selectionModule from 'diagram-js/lib/features/selection';
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

import customBehaviorModules from '../../modeling';


const HIDE_CLASS = 'bpp-hidden';

const COLLAPSE_CLASS = 'bpp-collapsible--collapsed';

describe('customs - input output property tab', function() {

  const diagramXML = require('./InputOutput.bpmn');

  const testModules = [
    coreModule,
    modelingModule,
    propertiesPanelModule,
    propertiesProviderModule,
    selectionModule,
    customBehaviorModules
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

  beforeEach(inject(function(propertiesPanel) {
    propertiesPanel.attachTo(container);
  }));


  describe('fetch parameters', function() {

    it('should fetch empty list of input and output parameters', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_empty'),
            bo = getBusinessObject(shape);

      // assume
      expect(getInputParameters(bo).length).to.equal(0);
      expect(getOutputParameters(bo).length).to.equal(0);

      // when
      selection.select(shape);

      // then
      const inputParameterEntries = getInputParameterCollapsibles(container);
      expect(inputParameterEntries.length).to.equal(0);

      const outputParameterEntries = getOutputParameterCollapsibles(container);
      expect(outputParameterEntries.length).to.equal(0);
    }));


    it('should fetch list of input parameters', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1'),
            bo = getBusinessObject(shape);

      // assume
      expect(getInputParameters(bo).length).to.equal(4);

      // when
      selection.select(shape);

      // then
      const inputParameterEntries = getInputParameterCollapsibles(container);
      expect(inputParameterEntries.length).to.equal(4);
    }));


    it('should fetch list of output parameters', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1'),
            bo = getBusinessObject(shape);

      // assume
      expect(getOutputParameters(bo).length).to.equal(4);

      // when
      selection.select(shape);

      // then
      const outputParameterEntries = getOutputParameterCollapsibles(container);
      expect(outputParameterEntries.length).to.equal(4);
    }));

  });


  describe('availability', function() {

    it('should display input and output parameters for ServiceTask', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('ServiceTask_1');

        // when
        selection.select(shape);

        // then
        const inputOutputTab = getInputOutputTab(container),
              inputParameterGroup = getInputParameterGroup(container),
              outputParameterGroup = getOutputParameterGroup(container),
              inputParameterAddButton = getAddInputParameterButton(container),
              outputParameterAddButton = getAddOutputParameterButton(container);

        expect(inputOutputTab).to.exist;
        expect(inputOutputTab.className).not.to.contain(HIDE_CLASS);

        expect(inputParameterGroup).to.exist;
        expect(inputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(inputParameterAddButton).to.exist;

        expect(outputParameterGroup).to.exist;
        expect(outputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(outputParameterAddButton).to.exist;
      }
    ));


    it('should display input and output parameters for SubProcess', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('SubProcess_1');

        // when
        selection.select(shape);

        // then
        const inputOutputTab = getInputOutputTab(container),
              inputParameterGroup = getInputParameterGroup(container),
              outputParameterGroup = getOutputParameterGroup(container),
              inputParameterAddButton = getAddInputParameterButton(container),
              outputParameterAddButton = getAddOutputParameterButton(container);

        expect(inputOutputTab).to.exist;
        expect(inputOutputTab.className).not.to.contain(HIDE_CLASS);

        expect(inputParameterGroup).to.exist;
        expect(inputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(inputParameterAddButton).to.exist;

        expect(outputParameterGroup).to.exist;
        expect(outputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(outputParameterAddButton).to.exist;
      }
    ));


    it('should display input and output parameters for CallActivity', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('CallActivity_1');

        // when
        selection.select(shape);

        // then
        const inputOutputTab = getInputOutputTab(container),
              inputParameterGroup = getInputParameterGroup(container),
              outputParameterGroup = getOutputParameterGroup(container),
              inputParameterAddButton = getAddInputParameterButton(container),
              outputParameterAddButton = getAddOutputParameterButton(container);

        expect(inputOutputTab).to.exist;
        expect(inputOutputTab.className).not.to.contain(HIDE_CLASS);

        expect(inputParameterGroup).to.exist;
        expect(inputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(inputParameterAddButton).to.exist;

        expect(outputParameterGroup).to.exist;
        expect(outputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(outputParameterAddButton).to.exist;
      }
    ));


    it('should display output parameters for ReceiveTask', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('ReceiveTask_1');

        // when
        selection.select(shape);

        // then
        const inputOutputTab = getInputOutputTab(container),
              inputParameterGroup = getInputParameterGroup(container),
              outputParameterGroup = getOutputParameterGroup(container),
              inputParameterAddButton = getAddInputParameterButton(container),
              outputParameterAddButton = getAddOutputParameterButton(container);

        expect(inputOutputTab).to.exist;
        expect(inputOutputTab.className).not.to.contain(HIDE_CLASS);

        expect(inputParameterGroup).to.exist;
        expect(inputParameterGroup.className).to.contain(HIDE_CLASS);
        expect(inputParameterAddButton).not.to.exist;

        expect(outputParameterGroup).to.exist;
        expect(outputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(outputParameterAddButton).to.exist;
      }
    ));


    it('should display output parameters for MessageEvent', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('MessageEvent_1');

        // when
        selection.select(shape);

        // then
        const inputOutputTab = getInputOutputTab(container),
              inputParameterGroup = getInputParameterGroup(container),
              outputParameterGroup = getOutputParameterGroup(container),
              inputParameterAddButton = getAddInputParameterButton(container),
              outputParameterAddButton = getAddOutputParameterButton(container);

        expect(inputOutputTab).to.exist;
        expect(inputOutputTab.className).not.to.contain(HIDE_CLASS);

        expect(inputParameterGroup).to.exist;
        expect(inputParameterGroup.className).to.contain(HIDE_CLASS);
        expect(inputParameterAddButton).not.to.exist;

        expect(outputParameterGroup).to.exist;
        expect(outputParameterGroup.className).not.to.contain(HIDE_CLASS);
        expect(outputParameterAddButton).to.exist;
      }
    ));


    it('should NOT display input and output parameters for Gateway', inject(
      function(selection, elementRegistry) {

        // given
        const shape = elementRegistry.get('Gateway_1');

        // when
        selection.select(shape);

        // then
        const inputOutputTab = getInputOutputTab(container),
              inputParameterGroup = getInputParameterGroup(container),
              outputParameterGroup = getOutputParameterGroup(container),
              inputParameterAddButton = getAddInputParameterButton(container),
              outputParameterAddButton = getAddOutputParameterButton(container);

        expect(inputOutputTab).to.exist;
        expect(inputOutputTab.className).to.contain(HIDE_CLASS);

        expect(inputParameterGroup).to.exist;
        expect(inputParameterGroup.className).to.contain(HIDE_CLASS);
        expect(inputParameterAddButton).not.to.exist;

        expect(outputParameterGroup).to.exist;
        expect(outputParameterGroup.className).to.contain(HIDE_CLASS);
        expect(outputParameterAddButton).not.to.exist;
      }
    ));

  });


  describe('toggle behavior', function() {

    let container;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      container = propertiesPanel._container;
      const shape = elementRegistry.get('ServiceTask_1');

      selection.select(shape);
    }));


    describe('of input parameters', function() {


      it('should initially be collapsed for all', function() {

        // then
        getInputParameterCollapsibles(container).forEach(function(collapsible) {
          expect(collapsible.className).to.contain(COLLAPSE_CLASS);
        });
      });


      it('should uncollapse once clicked on', function() {

        // given
        const idx = 0;

        // when
        clickInputCollapsibleTitle(container, idx);

        // then
        getInputParameterCollapsibles(container).forEach(function(collapsible, i) {
          if (i === idx) {
            expect(collapsible.className).not.to.contain(COLLAPSE_CLASS);
          } else {
            expect(collapsible.className).to.contain(COLLAPSE_CLASS);
          }
        });
      });


      it('should collapse others once clicked on', function() {

        // given
        const idxFirstClick = 0,
              idxSecondClick = 1;

        // when
        clickInputCollapsibleTitle(container, idxFirstClick);
        clickInputCollapsibleTitle(container, idxSecondClick);

        // then
        getInputParameterCollapsibles(container).forEach(function(collapsible, i) {
          if (i === idxSecondClick) {
            expect(collapsible.className).not.to.contain(COLLAPSE_CLASS);
          } else {
            expect(collapsible.className).to.contain(COLLAPSE_CLASS);
          }
        });
      });

    });


    describe('of output parameters', function() {

      it('should initially be collapsed for all', function() {

        // then
        getOutputParameterCollapsibles(container).forEach(function(collapsible) {
          expect(collapsible.className).to.contain(COLLAPSE_CLASS);
        });
      });


      it('should uncollapse once clicked on', function() {

        // given
        const idx = 0;

        // when
        clickOutputCollapsibleTitle(container, idx);

        // then
        getOutputParameterCollapsibles(container).forEach(function(collapsible, i) {
          if (i === idx) {
            expect(collapsible.className).not.to.contain(COLLAPSE_CLASS);
          } else {
            expect(collapsible.className).to.contain(COLLAPSE_CLASS);
          }
        });
      });


      it('should collapse others once clicked on', function() {

        // given
        const idxFirstClick = 0,
              idxSecondClick = 1;

        // when
        clickOutputCollapsibleTitle(container, idxFirstClick);
        clickOutputCollapsibleTitle(container, idxSecondClick);

        // then
        getOutputParameterCollapsibles(container).forEach(function(collapsible, i) {
          if (i === idxSecondClick) {
            expect(collapsible.className).not.to.contain(COLLAPSE_CLASS);
          } else {
            expect(collapsible.className).to.contain(COLLAPSE_CLASS);
          }
        });
      });

    });

  });


  describe('add input parameter', function() {

    let bo, container;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      container = propertiesPanel._container;
      const shape = elementRegistry.get('ServiceTask_empty');

      selection.select(shape);

      bo = getBusinessObject(shape);

      // when
      clickAddInputParameterButton(container);

    }));


    describe('on the business object', function() {

      it('should execute', function() {

        // then
        expect(getInputParameters(bo).length).to.equal(1);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getInputParameters(bo).length).to.equal(0);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getInputParameters(bo).length).to.equal(1);
      }));

    });


    describe('in the DOM', function() {

      it('should execute', function() {

        // then
        expect(getInputParameterCollapsibles(container).length).to.equal(1);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getInputParameterCollapsibles(container).length).to.equal(0);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getInputParameterCollapsibles(container).length).to.equal(1);
      }));

    });

  });


  describe('add output parameter', function() {

    let bo, payloadValue, executedListener;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection, eventBus) {

      // given
      const container = propertiesPanel._container,
            shape = elementRegistry.get('ServiceTask_empty');

      selection.select(shape);

      bo = getBusinessObject(shape);

      executedListener = sinon.spy(function(_, { context }) {
        payloadValue = getBusinessObject(context);
      });

      eventBus.on('commandStack.properties-panel.update-businessobject-list.executed', executedListener);

      // when
      clickAddOutputParameterButton(container);
    }));


    describe('on the business object', function() {

      it('should execute', function() {

        // then
        expect(getOutputParameters(bo).length).to.equal(1);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getOutputParameters(bo).length).to.equal(0);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getOutputParameters(bo).length).to.equal(1);
      }));

    });


    describe('in the DOM', function() {

      it('should execute', function() {

        // then
        expect(getOutputParameterCollapsibles(container).length).to.equal(1);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getOutputParameterCollapsibles(container).length).to.equal(0);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getOutputParameterCollapsibles(container).length).to.equal(1);
      }));

    });


    describe('execute <properties-panel.update-businessobject-list> command', function() {

      it('should emit the command', inject(function() {

        // then
        expect(executedListener).to.have.been.called;
      }));


      it('should emit the payload', inject(function() {

        // then
        expect(payloadValue.element).to.exist;
        expect(is(payloadValue.element, 'bpmn:ServiceTask')).to.be.true;
        expect(payloadValue.objectsToAdd).to.exist;
        expect(payloadValue.objectsToAdd.length).to.equal(1);
        expect(is(payloadValue.objectsToAdd[0], 'zeebe:Output')).to.be.true;
      }));

    });

  });


  describe('delete input parameter', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container,
            shape = elementRegistry.get('ServiceTask_1');

      selection.select(shape);

      bo = getBusinessObject(shape);

      // when
      clickRemoveInputParameterButton(container, 3);

    }));


    describe('on the business object', function() {

      it('should execute', function() {

        // then
        expect(getInputParameters(bo).length).to.equal(3);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getInputParameters(bo).length).to.equal(4);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getInputParameters(bo).length).to.equal(3);
      }));

    });


    describe('in the DOM', function() {

      it('should execute', function() {

        // then
        expect(getInputParameterCollapsibles(container).length).to.equal(3);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getInputParameterCollapsibles(container).length).to.equal(4);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getInputParameterCollapsibles(container).length).to.equal(3);
      }));

    });

  });


  describe('delete output parameter', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container,
            shape = elementRegistry.get('ServiceTask_1');

      selection.select(shape);

      bo = getBusinessObject(shape);

      // when
      clickRemoveOutputParameterButton(container, 3);

    }));


    describe('on the business object', function() {

      it('should execute', function() {

        // then
        expect(getOutputParameters(bo).length).to.equal(3);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getOutputParameters(bo).length).to.equal(4);
      }));


      it('should redo', inject(function(commandStack) {

        // when

        commandStack.undo();
        commandStack.redo();

        // then
        expect(getOutputParameters(bo).length).to.equal(3);
      }));

    });


    describe('in the DOM', function() {

      it('should execute', function() {

        // then
        expect(getOutputParameterCollapsibles(container).length).to.equal(3);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getOutputParameterCollapsibles(container).length).to.equal(4);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getOutputParameterCollapsibles(container).length).to.equal(3);
      }));

    });

  });

  describe('delete IO mapping', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container,
            shape = elementRegistry.get('CallActivity_1');
      selection.select(shape);

      bo = getBusinessObject(shape);

      // assume
      expect(getIOMapping(bo)).to.exist;

      // when
      clickRemoveInputParameterButton(container, 0);
      clickRemoveOutputParameterButton(container, 0);
    }));


    describe('on the business object', function() {

      it('should execute', function() {

        // then
        expect(getIOMapping(bo)).not.to.exist;
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getIOMapping(bo)).to.exist;
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getIOMapping(bo)).not.to.exist;
      }));

    });

  });


  describe('change parameter source', function() {


    describe('input', function() {

      let parameterSourceInput,
          parameter;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

        // given
        const idx = 0;

        const container = propertiesPanel._container;

        const shape = elementRegistry.get('ServiceTask_1');
        selection.select(shape);

        // toggle
        clickInputCollapsibleTitle(container, idx);

        parameterSourceInput = getInputSourceParameter(idx, container);
        parameter = getInputParameters(getBusinessObject(shape))[idx];

        // when
        triggerValue(parameterSourceInput, '= foo', 'change');
      }));


      describe('in the DOM', function() {

        it('should execute', function() {

          // then
          expect(parameterSourceInput.value).to.equal('= foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameterSourceInput.value).to.equal('= inputSourceValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameterSourceInput.value).to.equal('= foo');
        }));


        it('should not allow empty source value', function() {

          // when
          triggerValue(parameterSourceInput, '', 'change');

          // then
          expect(isInvalidInput(parameterSourceInput)).to.be.true;
        });


        it('should not allow values without starting "="', function() {

          // when
          triggerValue(parameterSourceInput, 'invalid value', 'change');

          // then
          expect(isInvalidInput(parameterSourceInput)).to.be.true;
        });


        it('should allow with spaces', function() {

          // when
          triggerValue(parameterSourceInput, '= foo bar', 'change');

          // then
          expect(isInvalidInput(parameterSourceInput)).to.be.false;
        });


        it('should allow FEEL expression', function() {

          // when
          triggerValue(parameterSourceInput, '=if (variable = null) then 1 else variable + 1', 'change');

          // then
          expect(isInvalidInput(parameterSourceInput)).to.be.false;
        });

      });


      describe('on the business object', function() {

        it('should execute', function() {

          // then
          expect(parameter.source).to.equal('= foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameter.source).to.equal('= inputSourceValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameter.source).to.equal('= foo');
        }));

      });

    });


    describe('output', function() {

      let parameterSourceOutput,
          parameter;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

        // given
        const idx = 0,
              container = propertiesPanel._container,
              shape = elementRegistry.get('ServiceTask_1');

        selection.select(shape);

        // toggle
        clickOutputCollapsibleTitle(container, idx);

        parameterSourceOutput = getOutputSourceParameter(idx, container);
        parameter = getOutputParameters(getBusinessObject(shape))[idx];

        // when
        triggerValue(parameterSourceOutput, '= foo', 'change');
      }));


      describe('in the DOM', function() {

        it('should execute', function() {

          // then
          expect(parameterSourceOutput.value).to.equal('= foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameterSourceOutput.value).to.equal('= outputSourceValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameterSourceOutput.value).to.equal('= foo');
        }));


        it('should not allow empty source value', function() {

          // when
          triggerValue(parameterSourceOutput, '', 'change');

          // then
          expect(isInvalidInput(parameterSourceOutput)).to.be.true;
        });


        it('should not allow values without starting "="', function() {

          // when
          triggerValue(parameterSourceOutput, 'invalid value', 'change');

          // then
          expect(isInvalidInput(parameterSourceOutput)).to.be.true;
        });


        it('should allow with spaces', function() {

          // when
          triggerValue(parameterSourceOutput, '= foo bar', 'change');

          // then
          expect(isInvalidInput(parameterSourceOutput)).to.be.false;
        });


        it('should allow FEEL expression', function() {

          // when
          triggerValue(parameterSourceOutput, '=if (variable = null) then 1 else variable + 1', 'change');

          // then
          expect(isInvalidInput(parameterSourceOutput)).to.be.false;
        });

      });


      describe('on the business object', function() {

        it('should execute', function() {

          // then
          expect(parameter.source).to.equal('= foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameter.source).to.equal('= outputSourceValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameter.source).to.equal('= foo');
        }));

      });

    });

  });


  describe('change parameter target', function() {


    describe('input', function() {

      let parameterTargetInput,
          parameter;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

        // given
        const idx = 0,
              container = propertiesPanel._container,
              shape = elementRegistry.get('ServiceTask_1');

        selection.select(shape);

        // toggle
        clickInputCollapsibleTitle(container, idx);

        parameterTargetInput = getInputTargetParameter(idx, container);
        parameter = getInputParameters(getBusinessObject(shape))[idx];

        // when
        triggerValue(parameterTargetInput, 'foo', 'change');
      }));


      describe('in the DOM', function() {

        it('should execute', function() {

          // then
          expect(parameterTargetInput.value).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameterTargetInput.value).to.equal('inputTargetValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameterTargetInput.value).to.equal('foo');
        }));


        it('should validate', function() {

          // when
          triggerValue(parameterTargetInput, '', 'change');

          // then
          expect(isInvalidInput(parameterTargetInput)).to.be.true;
        });


        it('should validate with spaces', function() {

          // when
          triggerValue(parameterTargetInput, 'foo bar', 'change');

          // then
          expect(isInvalidInput(parameterTargetInput)).to.be.true;
        });

      });


      describe('on the business object', function() {

        it('should execute', function() {

          // then
          expect(parameter.target).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameter.target).to.equal('inputTargetValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameter.target).to.equal('foo');
        }));

      });

    });


    describe('output', function() {

      let parameterTargetOutput,
          parameter;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

        // given
        const idx = 0;
        const container = propertiesPanel._container;

        const shape = elementRegistry.get('ServiceTask_1');
        selection.select(shape);

        // toggle
        clickOutputCollapsibleTitle(container, idx);

        parameterTargetOutput = getOutputTargetParameter(idx, container);
        parameter = getOutputParameters(getBusinessObject(shape))[idx];

        // when
        triggerValue(parameterTargetOutput, 'foo', 'change');
      }));


      describe('in the DOM', function() {


        it('should execute', function() {

          // then
          expect(parameterTargetOutput.value).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameterTargetOutput.value).to.equal('outputTargetValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameterTargetOutput.value).to.equal('foo');
        }));


        it('should validate', function() {

          // when
          triggerValue(parameterTargetOutput, '', 'change');

          // then
          expect(isInvalidInput(parameterTargetOutput)).to.be.true;
        });


        it('should validate with spaces', function() {

          // when
          triggerValue(parameterTargetOutput, 'foo bar', 'change');

          // then
          expect(isInvalidInput(parameterTargetOutput)).to.be.true;
        });

      });


      describe('on the business object', function() {

        it('should execute', function() {

          // then
          expect(parameter.target).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(parameter.target).to.equal('outputTargetValue1');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(parameter.target).to.equal('foo');
        }));

      });

    });

  });
});


// helper /////////

const getParameters = (bo, prop) => {
  return getElements(bo, 'zeebe:IoMapping', prop);
};

const getInputParameters = (bo) => {
  return getParameters(bo, 'inputParameters');
};

const getOutputParameters = (bo) => {
  return getParameters(bo, 'outputParameters');
};

const getElements = (bo, type, prop) => {
  const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elems : (elems[0] || {})[prop] || [];
};

const getIOMapping = (bo) => {
  return extensionElementsHelper.getExtensionElements(bo, 'zeebe:IoMapping');
};

const getInputOutputTab = (container) => {
  return domQuery('div[data-tab="input-output"]', container);
};

const getParameterGroup = (type, container) => {
  return domQuery(`div[data-group="${type}"]`, getInputOutputTab(container));
};

const getInputParameterGroup = (container) => {
  return getParameterGroup('input', container);
};

const getOutputParameterGroup = (container) => {
  return getParameterGroup('output', container);
};

const getParameterCollapsibles = (type, container) => {
  return domQueryAll(`div[data-entry^="${type}-parameter-"].bpp-collapsible`, getInputOutputTab(container));
};

const getInputParameterCollapsibles = (container) => {
  return getParameterCollapsibles('input', container);
};

const getOutputParameterCollapsibles = (container) => {
  return getParameterCollapsibles('output', container);
};

const getParameterCollapsibleTitles = (container) => {
  return domQueryAll('label.bpp-collapsible__title', container);
};

const getInputParameterCollapsibleTitles = (container) => {
  return getParameterCollapsibleTitles(getInputParameterGroup(container));
};

const getOutputParameterCollapsibleTitles = (container) => {
  return getParameterCollapsibleTitles(getOutputParameterGroup(container));
};

const getAddButton = (container) => {
  return domQuery('button[data-action="createElement"].bpp-input-output__add', container);
};

const getAddInputParameterButton = (container) => {
  return getAddButton(getInputParameterGroup(container));
};

const getAddOutputParameterButton = (container) => {
  return getAddButton(getOutputParameterGroup(container));
};

const clickAddInputParameterButton = (container) => {
  const addButton = getAddInputParameterButton(container);
  triggerEvent(addButton, 'click');
};

const clickAddOutputParameterButton = (container) => {
  const addButton = getAddOutputParameterButton(container);
  triggerEvent(addButton, 'click');
};

const getRemoveButtons = (container) => {
  return domQueryAll('button[data-action="onRemove"].bpp-collapsible__remove', container);
};

const getRemoveInputParameterButtons = (container) => {
  return getRemoveButtons(getInputParameterGroup(container));
};

const getRemoveOutputParameterButtons = (container) => {
  return getRemoveButtons(getOutputParameterGroup(container));
};

const clickRemoveInputParameterButton = (container, idx) => {
  const removeButtons = getRemoveInputParameterButtons(container);
  triggerEvent(removeButtons[idx], 'click');
};

const clickRemoveOutputParameterButton = (container, idx) => {
  const removeButtons = getRemoveOutputParameterButtons(container);
  triggerEvent(removeButtons[idx], 'click');
};

const clickCollapsibleTitle = (collapsibles, idx) => {
  triggerEvent(collapsibles[idx], 'click');
};

const clickInputCollapsibleTitle = (container, idx) => {
  clickCollapsibleTitle(getInputParameterCollapsibleTitles(container), idx);
};

const clickOutputCollapsibleTitle = (container, idx) => {
  clickCollapsibleTitle(getOutputParameterCollapsibleTitles(container), idx);
};

const getParameter = (idx, paramType, container) => {
  return domQueryAll(`input[name="${paramType}"]`, container)[idx];
};

const getInputParameter = (idx, paramType, container) => {
  return getParameter(idx, paramType, getInputParameterGroup(container));
};

const getOutputParameter = (idx, paramType, container) => {
  return getParameter(idx, paramType, getOutputParameterGroup(container));
};

const getInputSourceParameter = (idx, container) => {
  return getInputParameter(idx, 'source', container);
};

const getOutputSourceParameter = (idx, container) => {
  return getOutputParameter(idx, 'source', container);
};

const getInputTargetParameter = (idx, container) => {
  return getInputParameter(idx, 'target', container);
};

const getOutputTargetParameter = (idx, container) => {
  return getOutputParameter(idx, 'target', container);
};

const isInvalidInput = (node) => {
  return domClasses(node).has('invalid');
};
