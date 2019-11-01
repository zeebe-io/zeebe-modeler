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
  triggerEvent
} from './helper';

import TestContainer from 'mocha-test-container-support';

import propertiesPanelModule from 'bpmn-js-properties-panel';

import {
  query as domQuery,
  classes as domClasses
} from 'min-dom';


import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '..';
import zeebeModdleExtensions from '../../zeebe-bpmn-moddle/zeebe';

describe('zeebe-properties-provider', function() {

  const diagramXML = require('./ZeebePropertiesProvider.bpmn');

  const modules = [
    coreModule,
    selectionModule,
    modelingModule,
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
    modules,
    moddleExtensions
  }));

  beforeEach(inject(function(propertiesPanel) {
    propertiesPanel.attachTo(container);
  }));

  describe('general tab', function() {

    it('should show general group', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1');

      // when
      selection.select(shape);

      // then
      shouldHaveGroup(container, 'general', 'general');
    }));


    it('should show details group', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1');

      // when
      selection.select(shape);

      // then
      shouldHaveGroup(container, 'general', 'details');
    }));


    it('should show multi instance group', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1');

      // when
      selection.select(shape);

      // then
      shouldHaveGroup(container, 'general', 'multiInstance');
    }));

  });


  describe('headers tab', function() {

    it('should show headers group', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1');

      // when
      selection.select(shape);

      // then
      shouldHaveGroup(container, 'headers', 'headers-properties');
    }));

  });


  describe('input output tab', function() {

    it('should show input output group ', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1');

      // when
      selection.select(shape);

      // then
      shouldHaveGroup(container, 'input-output', 'input-output');
    }));


    it('should show parameters group', inject(function(selection, elementRegistry) {

      // given
      const shape = elementRegistry.get('ServiceTask_1');

      // when
      selection.select(shape);
      selectInputParameter(0, container);

      // then
      shouldHaveGroup(container, 'input-output', 'input-output-parameter');
    }));

  });

});


// helper /////////

function getTab(container, tabName) {
  return domQuery(`div[data-tab="${tabName}"]`, container);
}

function getGroup(container, tabName, groupName) {
  const tab = getTab(container, tabName);
  return domQuery(`div[data-group="${groupName}"]`, tab);
}

const getSelect = (suffix, tab) => {
  return domQuery('select[id="cam-extensionElements-' + suffix + '"]', tab);
};

const getInputParameterSelect = (container) => {
  const tab = getTab(container, 'input-output');
  return getSelect('inputs', tab);
};

const selectInputParameter = (idx, container) => {
  const selectBox = getInputParameterSelect(container);
  selectBox.options[idx].selected = 'selected';
  triggerEvent(selectBox, 'change');
};

const shouldHaveGroup = (container, tabName, groupName) => {
  const group = getGroup(container, tabName, groupName);
  expect(group).to.exist;
  expect(domClasses(group).has('bpp-hidden')).to.be.false;
};
