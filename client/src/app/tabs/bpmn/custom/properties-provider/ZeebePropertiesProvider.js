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
  is
} from 'bpmn-js/lib/util/ModelUtil';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';

import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';

import executableProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps';

import inputOutput from './parts/InputOutputProps';

import inputOutputParameter from './parts/InputOutputParameterProps';

import headers from './parts/HeadersProps';

import taskDefinition from './parts/TaskDefinitionProps';

import sequenceFlowProps from './parts/SequenceFlowProps';

import messageProps from './parts/MessageProps';

import timerProps from './parts/TimerEventProps';

import multiInstanceProps from './parts/MultiInstanceProps';

import errorProps from './parts/ErrorProps';

import callActivityProps from './parts/CallActivityProps';


const getInputOutputParameterLabel = param => {

  if (is(param, 'zeebe:InputParameter')) {
    return 'Input Parameter';
  }

  if (is(param, 'zeebe:OutputParameter')) {
    return 'Output Parameter';
  }

  return '';
};


function createGeneralTabGroups(element, bpmnFactory, canvas, translate) {
  const generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, bpmnFactory, canvas, translate);
  executableProps(generalGroup, element, translate);

  const detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  };
  taskDefinition(detailsGroup, element, bpmnFactory, translate);
  sequenceFlowProps(detailsGroup, element, bpmnFactory, translate);
  messageProps(detailsGroup, element, bpmnFactory, translate);
  timerProps(detailsGroup, element, bpmnFactory, translate);
  errorProps(detailsGroup, element, bpmnFactory, translate);
  callActivityProps(detailsGroup, element, bpmnFactory, translate);

  const multiInstanceGroup = {
    id: 'multiInstance',
    label: translate('Multi Instance'),
    entries: []
  };
  multiInstanceProps(multiInstanceGroup, element, bpmnFactory, translate);

  return [
    generalGroup,
    detailsGroup,
    multiInstanceGroup
  ];
}

function createHeadersGroups(element, bpmnFactory) {

  const headersGroup = {
    id: 'headers-properties',
    label: 'Headers',
    entries: []
  };
  headers(headersGroup, element, bpmnFactory);

  return [
    headersGroup
  ];
}


function createInputOutputTabGroups(element, bpmnFactory) {

  const inputOutputGroup = {
    id: 'input-output',
    label: 'Parameters',
    entries: []
  };

  const options = inputOutput(inputOutputGroup, element, bpmnFactory);

  const inputOutputParameterGroup = {
    id: 'input-output-parameter',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function(element, node) {
      const param = options.getSelectedParameter(element, node);
      return getInputOutputParameterLabel(param);
    }
  };

  inputOutputParameter(inputOutputParameterGroup, element, bpmnFactory, options);

  return [
    inputOutputGroup,
    inputOutputParameterGroup
  ];
}

export default class ZeebePropertiesProvider extends PropertiesActivator {
  constructor(eventBus, bpmnFactory, canvas, translate) {

    super(eventBus);

    this._bpmnFactory = bpmnFactory;
    this._canvas = canvas;
    this._translate = translate;

  }

  getTabs(element) {
    const generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(
        element, this._bpmnFactory, this._canvas, this._translate)
    };

    const inputOutputTab = {
      id: 'input-output',
      label: 'Input/Output',
      groups: createInputOutputTabGroups(
        element, this._bpmnFactory)
    };

    const headersTab = {
      id: 'headers',
      label: 'Headers',
      groups: createHeadersGroups(
        element, this._bpmnFactory)
    };

    return [
      generalTab,
      inputOutputTab,
      headersTab
    ];
  }

}

ZeebePropertiesProvider.$inject = [
  'eventBus',
  'bpmnFactory',
  'canvas',
  'translate'
];
