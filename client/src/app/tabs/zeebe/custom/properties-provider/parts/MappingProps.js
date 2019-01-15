import mapping from './implementation/Mapping';

import {
  assign
} from 'min-dash';

export default function(group, element, bpmnFactory, options) {

  group.entries = group.entries.concat(mapping(element, bpmnFactory, assign({}, options)));

}
