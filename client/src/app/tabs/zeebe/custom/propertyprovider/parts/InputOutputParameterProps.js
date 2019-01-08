'use strict';

var inputOutputParameter = require('./implementation/InputOutputParameter');

const {
  assign
} = require('min-dash');

module.exports = function(group, element, bpmnFactory, options) {

  group.entries = group.entries.concat(inputOutputParameter(element, bpmnFactory, assign({}, options)));

};
