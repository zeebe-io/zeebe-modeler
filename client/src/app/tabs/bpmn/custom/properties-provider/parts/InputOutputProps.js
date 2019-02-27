import inputOutput from './implementation/InputOutput';

export default function(group, element, bpmnFactory) {

  const inputOutputEntry = inputOutput(element, bpmnFactory);
  group.entries = group.entries.concat(inputOutputEntry.entries);
  return {
    getSelectedParameter: inputOutputEntry.getSelectedParameter
  };

}
