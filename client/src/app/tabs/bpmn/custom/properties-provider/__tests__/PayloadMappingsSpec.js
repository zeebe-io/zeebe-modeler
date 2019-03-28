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

import TestContainer from 'mocha-test-container-support';

import propertiesPanelModule from 'bpmn-js-properties-panel';

import {
  query as domQuery
} from 'min-dom';

import {
  getMapping,
  getPayloadMappings
} from '../helper/PayloadMappingsHelper';

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '..';
import zeebeModdleExtensions from '../../zeebe-bpmn-moddle/zeebe';

describe('customs - payload mappings property tab', function() {

  const diagramXML = require('./EndEvent.bpmn');

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

  describe('create', function() {

    let shape;

    beforeEach(inject(function(elementRegistry, selection) {

      shape = elementRegistry.get('EndEvent_1');
      selection.select(shape);

      // assume
      expect(getPayloadMappings(shape)).to.be.undefined;

      // when
      clickAddMappingButton(container);

    }));

    it('should execute', function() {

      // then
      expect(getPayloadMappings(shape)).to.exist;

    });


    it('should undo', inject(function(commandStack) {

      // when
      commandStack.undo();

      // then
      expect(getPayloadMappings(shape)).to.be.undefined;

    }));

    it('should redo', inject(function(commandStack) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(getPayloadMappings(shape)).to.exist;

    }));

  });


  describe('update', function() {

    let input, mapping;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('EndEvent_2');
      selection.select(shape);

      mapping = getMapping(shape, 0);

      // assume
      expect(mapping).to.exist;

      selectInputParameter(0, container);

      input = getInputField(container, 'camunda-mappingSource', 'source');

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
        expect(input.value).to.equal('source');
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

          expect(mapping.source).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(mapping.source).to.equal('source');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(mapping.source).to.equal('foo');
        }));

      });

    });

  });


  describe('remove', function() {

    let shape;

    beforeEach(inject(function(elementRegistry, selection) {

      shape = elementRegistry.get('EndEvent_2');
      selection.select(shape);

      // assume
      expect(getMapping(shape, 0)).to.exist;

      // when
      selectInputParameter(0, container);
      clickDeleteMappingButton(container);

    }));

    it('should execute', function() {

      // then
      expect(getPayloadMappings(shape)).to.be.undefined;

    });


    it('should undo', inject(function(commandStack) {

      // when
      commandStack.undo();

      // then
      expect(getMapping(shape, 0)).to.exist;

    }));

    it('should redo', inject(function(commandStack) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(getPayloadMappings(shape)).to.be.undefined;

    }));

  });

});


// helper /////////

const getPayloadMappingsTab = (container) => {
  return domQuery('div[data-tab="payload-mappings"]', container);
};

const getInputSelect = (container) => {
  return domQuery('select[id="cam-extensionElements-inputs"]',
    getPayloadMappingsTab(container));
};

const selectInputParameter = (idx, container) => {
  const selectBox = getInputSelect(container);
  selectBox.options[idx].selected = 'selected';
  triggerEvent(selectBox, 'change');
};

const getDeleteMappingButton = (container) => {
  return domQuery('button[data-action="removeElement"]', getPayloadMappingsTab(container));
};

const clickDeleteMappingButton = (container) => {
  const deleteButton = getDeleteMappingButton(container);
  triggerEvent(deleteButton, 'click');
};

const getAddMappingButton = (container) => {
  return domQuery('button[data-action="createElement"]', getPayloadMappingsTab(container));
};

const clickAddMappingButton = (container) => {
  const addButton = getAddMappingButton(container);
  triggerEvent(addButton, 'click');
};

const getDetailsGroup = (container) => {
  const tab = getPayloadMappingsTab(container);
  return domQuery('div[data-group="details"]', tab);
};

const getEntry = (container, entryId) => {
  return domQuery('div[data-entry="' + entryId + '"]', getDetailsGroup(container));
};

const getInputField = (container, entryId, inputName) => {
  const selector = 'input' + (inputName ? '[name="' + inputName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
};