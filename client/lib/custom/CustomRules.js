'use strict';

var reduce = require('lodash/collection/reduce'),
    inherits = require('inherits');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

var HIGH_PRIORITY = 1500;


function isCustom(element) {
  return element && /^custom\:/.test(element.type);
}

function hasIncomings(element){
  return element.incoming && element.incoming.length > 0;
}

function hasOutgoings(element){
  return element.outgoing && element.outgoing.length > 0;
}
/**
 * Specific rules for custom elements
 */
function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = [ 'eventBus' ];

module.exports = CustomRules;


CustomRules.prototype.init = function() {

  /**
   * Can shape be created on target container?
   */
  function canCreate(source) {
    return !hasOutgoings(source);
  }

  /**
   * Can source and target be connected?
   */
  function canConnect(source, target) {


    return !hasOutgoings(source) && !hasIncomings(target);
    
  }

  this.addRule('shape.append', HIGH_PRIORITY, function(context) {
    var source = context.source;

    return canCreate(source);
  });


  this.addRule('connection.create', HIGH_PRIORITY, function(context) {
    var source = context.source,
        target = context.target;

    return canConnect(source, target);
  });
/*
  this.addRule('shape.replace', HIGH_PRIORITY, function(element) {
    var businessObject = element.element.businessObject;
    if (is(businessObject, 'bpmn:ExclusiveGateway')) {
      //return false; //here you could completely disable morph for gateways
      return true;
    }
  });
*/
};
