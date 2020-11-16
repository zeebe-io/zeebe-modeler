/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import BpmnModeler from 'bpmn-js/lib/Modeler';

import minimapModule from 'diagram-js-minimap';

import diagramOriginModule from 'diagram-js-origin';

import alignToOriginModule from '@bpmn-io/align-to-origin';
import addExporterModule from '@bpmn-io/add-exporter';

import executableFixModule from 'bpmn-js-executable-fix';

import completeDirectEditingModule from './features/complete-direct-editing';
import globalClipboardModule from './features/global-clipboard';
import handToolOnSpaceModule from './features/hand-tool-on-space';

import propertiesPanelKeyboardBindingsModule from './features/properties-panel-keyboard-bindings';

import Flags, { DISABLE_ADJUST_ORIGIN } from '../../../../util/Flags';

import signavioCompatModule from 'bpmn-js-signavio-compat';

import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '../custom/properties-provider';

import zeebeModelingModule from '../custom/modeling';

import zeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe';

import zeebeModdleExtension from 'zeebe-bpmn-moddle/lib';

import zeebeCustoms from '../custom';

import disableCollapsedSubprocessModule from 'bpmn-js-disable-collapsed-subprocess';


import 'bpmn-js-properties-panel/styles/properties.less';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import 'diagram-js-minimap/assets/diagram-js-minimap.css';


export default class ZeebeBpmnModeler extends BpmnModeler {

  constructor(options = {}) {

    const {
      moddleExtensions,
      ...otherOptions
    } = options;

    super({
      ...otherOptions,
      moddleExtensions: {
        zeebe: zeebeModdle,
        ...(moddleExtensions || {})
      }
    });
  }
}

const defaultModules = BpmnModeler.prototype._modules;

const extensionModules = [
  addExporterModule,
  completeDirectEditingModule,
  executableFixModule,
  Flags.get(DISABLE_ADJUST_ORIGIN) ? diagramOriginModule : alignToOriginModule,
  globalClipboardModule,
  handToolOnSpaceModule,
  minimapModule,
  signavioCompatModule,
  propertiesPanelModule,
  propertiesProviderModule,
  propertiesPanelKeyboardBindingsModule,
  zeebeModdleExtension,
  zeebeModelingModule,
  zeebeCustoms,
  disableCollapsedSubprocessModule
];

ZeebeBpmnModeler.prototype._modules = [
  ...defaultModules,
  ...extensionModules
];
