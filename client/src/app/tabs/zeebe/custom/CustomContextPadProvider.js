import {
  assign,
  bind
} from 'min-dash';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import {
  AVAILABLE_CONTEXTPAD_ENTRIES as availableActions
} from './modeler-options/Options';

export default class CustomContextPadProvider extends ContextPadProvider {

  constructor(config, injector, eventBus, contextPad,
      modeling, elementFactory, connect, create,
      popupMenu, canvas, rules, translate) {

    super(config, injector, eventBus, contextPad,
      modeling, elementFactory, connect, create,
      popupMenu, canvas, rules, translate);


    this.autoPlace = undefined;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    this.cached = bind(super.getContextPadEntries, this);
  }

  getContextPadEntries = element => {
    const actions = this.cached(element);

    const businessObject = element.businessObject;

    const self = this;

    /**
   * Create an append action
   *
   * @param {String} type
   * @param {String} className
   * @param {String} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
    function appendAction(type, className, title, options) {

      if (typeof title !== 'string') {
        options = title;
        title = self._translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
      }

      function appendStart(event, element) {

        const shape = self._elementFactory.createShape(assign({ type: type }, options));
        self._create.start(event, shape, element);
      }


      const append = self.autoPlace ? (event, element) => {
        const shape = self._elementFactory.createShape(assign({ type: type }, options));

        self.autoPlace.append(element, shape);
      } : appendStart;


      return {
        group: 'model',
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append
        }
      };
    }

    const filteredActions = {};

    if (!is(businessObject, 'bpmn:EndEvent')) {
      if (!is(businessObject, 'bpmn:EventBasedGateway')) {
        assign(filteredActions, { 'append.append-service-task': appendAction('bpmn:ServiceTask', 'bpmn-icon-service-task') });
        assign(filteredActions, { 'append.append-send-task': appendAction('bpmn:ReceiveTask', 'bpmn-icon-receive-task') });
      }
      assign(filteredActions, { 'append.append-message-event': appendAction('bpmn:IntermediateCatchEvent', 'bpmn-icon-intermediate-event-catch-message', 'Message Event', { eventDefinitionType: 'bpmn:MessageEventDefinition' }) });
      assign(filteredActions, { 'append.append-timer-event': appendAction('bpmn:IntermediateCatchEvent', 'bpmn-icon-intermediate-event-catch-timer', 'Timer Event', { eventDefinitionType: 'bpmn:TimerEventDefinition' }) });
    }

    availableActions.forEach(availableAction => {
      if (actions[availableAction]) {
        // if (availableAction == 'replace' && !is(businessObject, 'bpmn:SequenceFlow')) {
        //  continue;
        // }
        filteredActions[availableAction] = actions[availableAction];
      }
    });

    return filteredActions;
  };

}

CustomContextPadProvider.$inject = [
  'config',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];