import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

import message from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/MessageEventDefinition';

import referenceExtensionElementProperty from './implementation/ElementReferenceExtensionElementProperty';

export default function(group, element, bpmnFactory, elementRegistry, translate) {

  const messageEventDefinition = eventDefinitionHelper.getMessageEventDefinition(element);

  if (is(element, 'bpmn:ReceiveTask')) {
    message(group, element, bpmnFactory, getBusinessObject(element));
    group.entries = group.entries.concat(referenceExtensionElementProperty(element, getBusinessObject(element), bpmnFactory, {
      id: 'message-element-subscription',
      label: 'Subscription Correlation Key',
      referenceProperty: 'messageRef',
      modelProperty: 'correlationKey',
      extensionElement: 'zeebe:Subscription',
      shouldValidate: true
    }));
  } else if (messageEventDefinition) {
    message(group, element, bpmnFactory, messageEventDefinition);
    if (!is(element, 'bpmn:StartEvent')) {
      group.entries = group.entries.concat(referenceExtensionElementProperty(element, messageEventDefinition, bpmnFactory, {
        id: 'message-element-subscription',
        label: 'Subscription Correlation Key',
        referenceProperty: 'messageRef',
        modelProperty: 'correlationKey',
        extensionElement: 'zeebe:Subscription',
        shouldValidate: true
      }));
    }
  }

}


