import inputOutputParameter from './implementation/InputOutputParameter';

import {
  assign
} from 'min-dash';

export default function(group, element, bpmnFactory, options) {

  group.entries = group.entries.concat(inputOutputParameter(element, bpmnFactory, assign({}, options)));

}
