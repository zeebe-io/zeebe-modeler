/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

/**
 * A tiny bpmn-js utility that writes
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