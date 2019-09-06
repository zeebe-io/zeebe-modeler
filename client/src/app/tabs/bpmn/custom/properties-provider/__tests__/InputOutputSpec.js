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

import propertiesPanelModule from 'bpmn-js-properties-panel';

import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '..';
import zeebeModdleExtensions from '../../zeebe-bpmn-moddle/zeebe';

describe('customs - input output property tab', function() {

  const diagramXML = require('./InputOutput.bpmn');

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

  it('should fetch empty list of input and output parameters', inject(function(propertiesPanel, selection, elementRegistry) {

    // given
    const shape = elementRegistry.get('ServiceTask_empty');
    const bo = getBusinessObject(shape);

    // assume
    expect(getInputParameters(bo).length).to.equal(0);
    expect(getOutputParameters(bo).length).to.equal(0);

    // when
    selection.select(shape);

    // then
    const inputsSelection = getInputParameterSelect(propertiesPanel._container);
    expect(inputsSelection.options.length).to.equal(0);

    const outputsSelection = getOutputParameterSelect(propertiesPanel._container);
    expect(outputsSelection.options.length).to.equal(0);
  }));


  it('should fetch list of input parameters', inject(function(propertiesPanel, selection, elementRegistry) {

    // given
    const shape = elementRegistry.get('ServiceTask_1');
    const bo = getBusinessObject(shape);

    // assume
    expect(getInputParameters(bo).length).to.equal(4);

    // when
    selection.select(shape);

    // then
    const inputsSelection = getInputParameterSelect(propertiesPanel._container);
    expect(inputsSelection.options.length).to.equal(4);
  }));


  it('should fetch list of output parameters', inject(function(propertiesPanel, selection, elementRegistry) {

    // given
    const shape = elementRegistry.get('ServiceTask_1');
    const bo = getBusinessObject(shape);

    // assume
    expect(getOutputParameters(bo).length).to.equal(4);

    // when
    selection.select(shape);

    // then
    const outputsSelection = getOutputParameterSelect(propertiesPanel._container);
    expect(outputsSelection.options.length).to.equal(4);
  }));


  describe('property controls', function() {

    let container;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      container = propertiesPanel._container;
      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);

    }));

    describe('of input parameters', function() {

      it('should fetch source property', function() {

        // when
        selectInputParameter(0, container);

        // then
        expect(getParameterSourceInput(container).value).to.equal('inputSourceValue1');
      });


      it('should fetch target property', function() {

        // when
        selectInputParameter(0, container);

        // then
        expect(getParameterTargetInput(container).value).to.equal('inputTargetValue1');
      });

    });


    describe('of output parameters', function() {

      it('should fetch source property', function() {

        // when
        selectOutputParameter(0, container);

        // then
        expect(getParameterSourceInput(container).value).to.equal('outputSourceValue1');
      });


      it('should fetch target property', function() {

        // when
        selectOutputParameter(0, container);

        // then
        expect(getParameterTargetInput(container).value).to.equal('outputTargetValue1');
      });

    });

  });


  describe('add input parameter', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container;

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

      let inputSelectBox;

      beforeEach(inject(function(propertiesPanel) {
        inputSelectBox = getInputParameterSelect(propertiesPanel._container);
      }));


      it('should execute', function() {

        // then
        expect(inputSelectBox.options.length).to.equal(1);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(inputSelectBox.options.length).to.equal(0);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(inputSelectBox.options.length).to.equal(1);
      }));

    });

  });


  describe('add output parameter', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_empty');
      selection.select(shape);

      bo = getBusinessObject(shape);

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

      let outputSelectBox;

      beforeEach(inject(function(propertiesPanel) {
        outputSelectBox = getOutputParameterSelect(propertiesPanel._container);
      }));


      it('should execute', function() {

        // then
        expect(outputSelectBox.options.length).to.equal(1);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(outputSelectBox.options.length).to.equal(0);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(outputSelectBox.options.length).to.equal(1);
      }));

    });

  });


  describe('select input parameter', function() {

    let container;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);
    }));

    it('should nothing be selected', function() {

      // then
      expect(getInputParameterSelect(container).selectedIndex).to.equal(-1);
    });


    it('should select input parameter', function() {

      // when
      selectInputParameter(2, container);

      // then
      expect(getInputParameterSelect(container).selectedIndex).to.equal(2);
      expect(getParameterSourceInput(container).value).to.equal('inputSourceValue3');
    });


    it('should deselect input parameter', function() {

      // when
      selectOutputParameter(2, container);

      // then
      expect(getInputParameterSelect(container).selectedIndex).to.equal(-1);
    });

  });


  describe('select output parameter', function() {

    let container;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);
    }));

    it('should nothing be selected', function() {

      // then
      expect(getOutputParameterSelect(container).selectedIndex).to.equal(-1);
    });


    it('should select output parameter', function() {

      // when
      selectOutputParameter(2, container);

      // then
      expect(getOutputParameterSelect(container).selectedIndex).to.equal(2);
      expect(getParameterSourceInput(container).value).to.equal('outputSourceValue3');
    });


    it('should deselect output parameter', function() {

      // when
      selectInputParameter(2, container);

      // then
      expect(getOutputParameterSelect(container).selectedIndex).to.equal(-1);
    });

  });


  describe('delete input parameter', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);

      bo = getBusinessObject(shape);

      selectInputParameter(3, container);

      // when
      clickRemoveInputParameterButton(container);

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

      let inputSelectBox;

      beforeEach(inject(function(propertiesPanel) {
        inputSelectBox = getInputParameterSelect(propertiesPanel._container);
      }));


      it('should execute', function() {

        // then
        expect(inputSelectBox.options.length).to.equal(3);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(inputSelectBox.options.length).to.equal(4);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(inputSelectBox.options.length).to.equal(3);
      }));

    });

  });


  describe('delete output parameter', function() {

    let bo;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);

      bo = getBusinessObject(shape);

      selectOutputParameter(3, container);

      // when
      clickRemoveOutputParameterButton(container);

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

      let outputSelectBox;

      beforeEach(inject(function(propertiesPanel) {
        outputSelectBox = getOutputParameterSelect(propertiesPanel._container);
      }));


      it('should execute', function() {

        // then
        expect(outputSelectBox.options.length).to.equal(3);
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(outputSelectBox.options.length).to.equal(4);
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(outputSelectBox.options.length).to.equal(3);
      }));

    });

  });


  describe('change parameter source', function() {

    let parameterSourceInput,
        parameter;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);

      // select first parameter
      selectInputParameter(0, container);

      parameterSourceInput = getParameterSourceInput(container);
      parameter = getInputParameters(getBusinessObject(shape))[0];

      // when
      triggerValue(parameterSourceInput, 'foo', 'change');
    }));


    describe('in the DOM', function() {

      it('should execute', function() {

        // then
        expect(parameterSourceInput.value).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(parameterSourceInput.value).to.equal('inputSourceValue1');
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(parameterSourceInput.value).to.equal('foo');
      }));


      it('should validate', function() {

        // when
        triggerValue(parameterSourceInput, '', 'change');

        // then
        expect(domClasses(parameterSourceInput).has('invalid')).to.be.true;
      });


      it('should validate with spaces', function() {

        // when
        triggerValue(parameterSourceInput, 'foo bar', 'change');

        // then
        expect(domClasses(parameterSourceInput).has('invalid')).to.be.true;
      });

    });


    describe('on the business object', function() {

      it('should execute', function() {

        // then
        expect(parameter.source).to.equal('foo');
      });


      it('should undo', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(parameter.source).to.equal('inputSourceValue1');
      }));


      it('should redo', inject(function(commandStack) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(parameter.source).to.equal('foo');
      }));

    });

  });


  describe('change parameter target', function() {

    let parameterTargetInput,
        parameter;

    beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const container = propertiesPanel._container;

      const shape = elementRegistry.get('ServiceTask_1');
      selection.select(shape);

      // select first parameter
      selectInputParameter(0, container);

      parameterTargetInput = getParameterTargetInput(container);
      parameter = getInputParameters(getBusinessObject(shape))[0];

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
        expect(domClasses(parameterTargetInput).has('invalid')).to.be.true;
      });


      it('should validate with spaces', function() {

        // when
        triggerValue(parameterTargetInput, 'foo bar', 'change');

        // then
        expect(domClasses(parameterTargetInput).has('invalid')).to.be.true;
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

});


// helper /////////

const getInputParameters = (bo) => {
  return getParameters(bo, 'inputParameters');
};

const getElements = (bo, type, prop) => {
  const elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elems : (elems[0] || {})[prop] || [];
};

const getOutputParameters = (bo) => {
  return getParameters(bo, 'outputParameters');
};

const getParameters = (bo, prop) => {
  return getElements(bo, 'zeebe:IoMapping', prop);
};

const getInputParameterSelect = (container) => {
  return getSelect('inputs', container);
};

const getAddInputParameterButton = (container) => {
  return getAddButton('inputs', container);
};

const clickAddInputParameterButton = (container) => {
  const addButton = getAddInputParameterButton(container);
  triggerEvent(addButton, 'click');
};

const getRemoveInputParameterButton = (container) => {
  return getRemoveButton('inputs', container);
};

const clickRemoveInputParameterButton = (container) => {
  const removeButton = getRemoveInputParameterButton(container);
  triggerEvent(removeButton, 'click');
};

const selectInputParameter = (idx, container) => {
  const selectBox = getInputParameterSelect(container);
  selectBox.options[idx].selected = 'selected';
  triggerEvent(selectBox, 'change');
};

const getOutputParameterSelect = (container) => {
  return getSelect('outputs', container);
};

const getAddOutputParameterButton = (container) => {
  return getAddButton('outputs', container);
};

const clickAddOutputParameterButton = (container) => {
  const addButton = getAddOutputParameterButton(container);
  triggerEvent(addButton, 'click');
};

const getRemoveOutputParameterButton = (container) => {
  return getRemoveButton('outputs', container);
};

const clickRemoveOutputParameterButton = (container) => {
  const removeButton = getRemoveOutputParameterButton(container);
  triggerEvent(removeButton, 'click');
};

const selectOutputParameter = (idx, container) => {
  const selectBox = getOutputParameterSelect(container);
  selectBox.options[idx].selected = 'selected';
  triggerEvent(selectBox, 'change');
};

const getInputOutputTab = (container) => {
  return domQuery('div[data-tab="input-output"]', container);
};

const getParameterSourceInput = (container) => {
  return domQuery('input[id="camunda-parameterSource"]', getInputOutputTab(container));
};

const getParameterTargetInput = (container) => {
  return domQuery('input[id="camunda-parameterTarget"]', getInputOutputTab(container));
};

const getSelect = (suffix, container) => {
  return domQuery('select[id="cam-extensionElements-' + suffix + '"]', getInputOutputTab(container));
};

const getAddButton = (suffix, container) => {
  return domQuery('button[id="cam-extensionElements-create-' + suffix + '"]', getInputOutputTab(container));
};

const getRemoveButton = (suffix, container) => {
  return domQuery('button[id="cam-extensionElements-remove-' + suffix + '"]', getInputOutputTab(container));
};