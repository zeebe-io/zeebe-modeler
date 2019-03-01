/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import payloadMappings from './implementation/PayloadMappings';

export default function(group, element, bpmnFactory) {

  const payloadMappingsEntry = payloadMappings(element, bpmnFactory);
  group.entries = group.entries.concat(payloadMappingsEntry.entries);
  return {
    getSelectedMapping: payloadMappingsEntry.getSelectedMapping
  };

}
