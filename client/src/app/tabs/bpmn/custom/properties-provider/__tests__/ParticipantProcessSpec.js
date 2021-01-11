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
import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

describe('zeebe-properties-provider', function() {

  const diagramXML = require('./ParticipantProcess.bpmn');

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
      const pool = elementRegistry.get('Participant_1');

      // when
      selection.select(pool);

      // then
      shouldHaveGroup(container, 'general', 'general');
    }));


    it('should have pool id and name inputs', inject(function(selection, elementRegistry) {

      // given
      const pool = elementRegistry.get('Participant_1');

      // when
      selection.select(pool);

      // then
      shouldHaveInput(container, 'general', 'participant-id');
      shouldHaveInput(container, 'general', 'participant-name');
    }));


    it('should have pool process id and process name inputs', inject(function(selection, elementRegistry) {

      // given
      const pool = elementRegistry.get('Participant_1');

      // when
      selection.select(pool);

      // then
      shouldHaveInput(container, 'general', 'process-id');
      shouldHaveInput(container, 'general', 'process-name');
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

function getInput(container, tabName, inputName) {
  const tab = getTab(container, tabName);
  return domQuery(`div[data-entry="${inputName}"]`, tab);
}

const shouldHaveGroup = (container, tabName, groupName) => {
  const group = getGroup(container, tabName, groupName);
  expect(group).to.exist;
  expect(domClasses(group).has('bpp-hidden')).to.be.false;
};

const shouldHaveInput = (container, tabName, inputName) => {
  const input = getInput(container, tabName, inputName);
  expect(input).to.exist;
};