import TimerDurationDefinition from './implementation/TimerDurationDefinition';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import TimerEventDefinition from './implementation/TimerEventDefinition';

export default function(group, element, bpmnFactory, options) {

  const timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);
  if (is(element, 'bpmn:StartEvent') && timerEventDefinition) {
    new TimerEventDefinition(group,element,bpmnFactory,timerEventDefinition);
  } else if (timerEventDefinition) {
    new TimerDurationDefinition(group,element,bpmnFactory,timerEventDefinition);
  }

}

