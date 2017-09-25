'use strict';

var inputOutputParameter = require('./implementation/InputOutputParameter');
var is = require('bpmn-js/lib/util/ModelUtil').is;

var assign = require('lodash/object/assign');

module.exports = function(group, element, bpmnFactory, options) {


  group.entries = group.entries.concat(inputOutputParameter(element, bpmnFactory, assign({}, options)));

};
