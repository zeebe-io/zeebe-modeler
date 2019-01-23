import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

const HIGH_PRIORITY = 1500;

function hasOutgoings(element) {
  return element.outgoing && element.outgoing.length > 0;
}

/**
 * Specific rules for custom elements
 */
export default class CustomRules extends RuleProvider {
  constructor(eventBus) {
    super(eventBus);
  }

  init() {

    /**
     * Can shape be created on target container?
     */
    function canCreate(source) {

      if (is(source, 'bpmn:ExclusiveGateway')) {
        return true;
      }

      return !hasOutgoings(source);
    }

    /**
     * Can source and target be connected?
     */
    function canConnect(source, target) {

      if (is(source, 'bpmn:ExclusiveGateway')) {
        return true;
      }

      return !hasOutgoings(source);

    }

    this.addRule('shape.append', HIGH_PRIORITY, context => {
      const source = context.source;

      return canCreate(source);
    });


    this.addRule('connection.create', HIGH_PRIORITY, context => {
      const source = context.source, target = context.target;

      return canConnect(source, target);
    });
  }
}

CustomRules.$inject = [ 'eventBus' ];