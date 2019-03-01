/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import properties from './implementation/Headers';

import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export default function(group, element, bpmnFactory) {

  if (!is(element, 'bpmn:ServiceTask')) {
    return;
  }

  const propertiesEntry = properties(element, bpmnFactory, {
    id: 'headers',
    modelProperties: [ 'key', 'value' ],
    labels: [ 'Key', 'Value' ],

    getParent: function(element, node, bo) {
      return bo.extensionElements;
    },

    createParent: function(element, bo) {
      const parent = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
      const cmd = cmdHelper.updateBusinessObject(element, bo, { extensionElements: parent });
      return {
        cmd: cmd,
        parent: parent
      };
    }
  });

  if (propertiesEntry) {
    group.entries.push(propertiesEntry);
  }

}