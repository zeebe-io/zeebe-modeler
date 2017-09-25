'use strict';

var inherits = require('inherits'),
    is = require('bpmn-js/lib/util/ModelUtil').is;

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

var idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps'),
    nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps'),
    executableProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps'),
    inputOutput = require('./parts/InputOutputProps'),
    inputOutputParameter = require('./parts/InputOutputParameterProps'),
    headers = require('./parts/HeadersProps'),
    taskDefinition = require('./parts/TaskDefinitionProps'),
    sequenceFlowProps = require('./parts/SequenceFlowProps');


var getInputOutputParameterLabel = function(param) {

  if (is(param, 'camunda:InputParameter')) {
    return 'Input Parameter';
  }

  if (is(param, 'camunda:OutputParameter')) {
    return 'Output Parameter';
  }

  return '';
};


function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  executableProps(generalGroup, element,translate);
  taskDefinition(generalGroup, element, bpmnFactory);
  sequenceFlowProps(generalGroup, element, bpmnFactory, translate);

  return [
    generalGroup
  ];
}





function createHeadersGroups(element, bpmnFactory, elementRegistry) {

  var headersGroup = {
    id : 'headers-properties',
    label: 'Headers',
    entries: []
  };
  headers(headersGroup, element, bpmnFactory);

  return [
    headersGroup
  ];
}



function createInputOutputTabGroups(element, bpmnFactory, elementRegistry) {

  var inputOutputGroup = {
    id: 'input-output',
    label: 'Parameters',
    entries: []
  };

  var options = inputOutput(inputOutputGroup, element, bpmnFactory);

  var inputOutputParameterGroup = {
    id: 'input-output-parameter',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function(element, node) {
      var param = options.getSelectedParameter(element, node);
      return getInputOutputParameterLabel(param);
    }
  };

  inputOutputParameter(inputOutputParameterGroup, element, bpmnFactory, options);

  return [
    inputOutputGroup,
    inputOutputParameterGroup
  ];
}

function ZeebePropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {

  PropertiesActivator.call(this, eventBus);
  this.getTabs = function(element) {
    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var inputOutputTab = {
      id: 'input-output',
      label: 'Input/Output',
      groups: createInputOutputTabGroups(element, bpmnFactory, elementRegistry)
    };

    var headersTab = {
      id: 'headers-tab',
      label: 'Headers',
      groups: createHeadersGroups(element, bpmnFactory, elementRegistry)
    };

    return [
      generalTab,
      inputOutputTab,
      headersTab
    ];
  };
}

ZeebePropertiesProvider.$inject = [
  'eventBus',
  'bpmnFactory',
  'elementRegistry',
  'translate'
];

inherits(ZeebePropertiesProvider, PropertiesActivator);

module.exports = ZeebePropertiesProvider;
