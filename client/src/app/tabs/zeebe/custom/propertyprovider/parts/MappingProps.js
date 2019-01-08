'use strict';

var mapping = require('./implementation/Mapping');

const {
  assign
} = require('min-dash');

module.exports = function(group, element, bpmnFactory, options) {

  group.entries = group.entries.concat(mapping(element, bpmnFactory, assign({}, options)));

};
