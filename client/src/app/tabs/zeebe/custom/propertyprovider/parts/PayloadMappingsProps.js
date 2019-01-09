import payloadMappings from './implementation/PayloadMappings';

export default function(group, element, bpmnFactory) {

  const payloadMappingsEntry = payloadMappings(element, bpmnFactory);
  group.entries = group.entries.concat(payloadMappingsEntry.entries);
  return {
    getSelectedMapping: payloadMappingsEntry.getSelectedMapping
  };

}
