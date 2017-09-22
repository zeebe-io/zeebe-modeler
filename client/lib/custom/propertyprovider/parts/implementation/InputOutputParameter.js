'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is;

var elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    inputOutputHelper = require('../../helper/InputOutputHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    utils = require('bpmn-js-properties-panel/lib/Utils');

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    script = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Script')('scriptFormat', 'value', true);


function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}

function ensureInputOutputSupported(element) {
  return inputOutputHelper.isInputOutputSupported(element);
}

module.exports = function(element, bpmnFactory, options) {

  options = options || {};

  var idPrefix        = options.idPrefix || '';

  var getSelected = options.getSelectedParameter;

  if (!ensureInputOutputSupported(element)) {
    return [];
  }

  var entries = [];

  var isSelected = function(element, node) {
    return getSelected(element, node);
  };


  // parameter source ////////////////////////////////////////////////////////

  entries.push(entryFactory.validationAwareTextField({
    id: idPrefix + 'parameterSource',
    label: 'Source',
    modelProperty: 'source',

    getProperty: function(element, node) {
      return (getSelected(element, node) || {}).source;
    },

    setProperty: function(element, values, node) {
      var param = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, param, values);
    },

    validate: function(element, values, node) {
      var bo = getSelected(element, node);

      var validation = {};
      if (bo) {
        var sourceValue = values.source;

        if (sourceValue) {
          if (utils.containsSpace(sourceValue)) {
            validation.source = 'Source must not contain spaces';
          }
        }
        else {
          validation.source = 'Parameter must have a source';
        }
      }

      return validation;
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }
  }));


// parameter target ////////////////////////////////////////////////////////

  entries.push(entryFactory.validationAwareTextField({
    id: idPrefix + 'parameterTarget',
    label: 'Target',
    modelProperty: 'target',

    getProperty: function(element, node) {
      return (getSelected(element, node) || {}).target;
    },

    setProperty: function(element, values, node) {
      var param = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, param, values);
    },

    validate: function(element, values, node) {
      var bo = getSelected(element, node);

      var validation = {};
      if (bo) {
        var targetValue = values.target;

        if (targetValue) {
          if (utils.containsSpace(targetValue)) {
            validation.target = 'Target must not contain spaces';
          }
        }
        else {
          validation.target = 'Parameter must have a Target';
        }
      }

      return validation;
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }
  }));

  return entries;

};
