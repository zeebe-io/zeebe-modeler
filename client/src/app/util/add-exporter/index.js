/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * A tiny {bpmn|dmn|cmmn}-js utility that writes
 * exporter and exporterVersion to the definitions element
 * upon serialization.
 *
 * @example
 *
 * const editor = ...;
 *
 * addExporter(editor, {
 *   exporter: 'Zeebe Modeler',
 *   exporterVersion: '1.0.0-beta.6'
 * });
 */
export default function(emitter, { exporter, exporterVersion }) {

  emitter.on('saveXML.start', function(event) {

    const {
      definitions
    } = event;

    definitions.set('exporter', exporter);
    definitions.set('exporterVersion', exporterVersion);
  });

}