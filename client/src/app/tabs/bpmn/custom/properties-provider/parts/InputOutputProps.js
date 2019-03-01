/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import inputOutput from './implementation/InputOutput';

export default function(group, element, bpmnFactory) {

  const inputOutputEntry = inputOutput(element, bpmnFactory);
  group.entries = group.entries.concat(inputOutputEntry.entries);
  return {
    getSelectedParameter: inputOutputEntry.getSelectedParameter
  };

}
