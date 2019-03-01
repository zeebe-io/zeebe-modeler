/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import mapping from './implementation/Mapping';

import {
  assign
} from 'min-dash';

export default function(group, element, bpmnFactory, options) {

  group.entries = group.entries.concat(mapping(element, bpmnFactory, assign({}, options)));

}
