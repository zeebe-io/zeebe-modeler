import TimerEventDefinition from './implementation/TimerEventDefinition';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

export default function(group, element, bpmnFactory, options) {

  const timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);
  if (timerEventDefinition) {
    new TimerEventDefinition(group,element,bpmnFactory,timerEventDefinition);
  }

}

