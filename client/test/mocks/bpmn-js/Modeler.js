/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { assign } from 'min-dash';


class CommandStack {
  constructor() {
    this._stackIdx = -1;
    this._maxStackIdx = this._stackIdx;
  }

  execute(commands) {
    this._stackIdx += commands;
    this._maxStackIdx = this._stackIdx;
  }

  undo() {
    if (this.canUndo()) {
      this._stackIdx--;
    }
  }

  redo() {
    if (this.canRedo()) {
      this._stackIdx++;
    }
  }

  canRedo() {
    return this._stackIdx < this._maxStackIdx;
  }

  canUndo() {
    return this._stackIdx > -1;
  }
}

class PropertiesPanel {
  attachTo() {}

  detach() {}
}

export default class Modeler {
  constructor(options = {}) {
    this.options = options;

    this.modules = assign(this._getDefaultModules(), options.modules || {});

    this.xml = null;

    this.listeners = {};
  }

  _getDefaultModules() {
    return {
      eventBus: {
        fire() {}
      },
      canvas: {
        resized() {}
      },
      clipboard: {
        isEmpty() {}
      },
      commandStack: new CommandStack(),
      elementTemplatesLoader: {
        setTemplates() {}
      },
      minimap: {
        toggle() {}
      },
      propertiesPanel: new PropertiesPanel(),
      selection: {
        get() {
          return [];
        }
      }
    };
  }

  importXML(xml, done) {
    this.xml = xml;

    const error = xml === 'import-error' ? new Error('error') : null;

    const warnings = xml === 'import-warnings' ? [ 'warning' ] : [];

    done && done(error, warnings);
  }

  saveXML(options, done) {

    const xml = this.xml;

    if (xml === 'export-error') {
      return done(new Error('failed to save xml'));
    }

    return done(null, xml);
  }

  saveSVG(done) {

    if (this.xml === 'export-as-error') {
      return done(new Error('failed to save svg'));
    }

    return done(null, '<svg />');
  }

  attachTo() {}

  detach() {}

  on(event, priority, callback) {
    if (!callback) {
      callback = priority;
    }

    if (!this.listeners[ event ]) {
      this.listeners[ event ] = [];
    }

    this.listeners[ event ].push(callback);
  }

  off() {}

  _emit(event) {
    if (this.listeners[ event ]) {
      this.listeners[ event ].forEach(callback => callback());
    }
  }

  get(moduleName) {
    const module = this.modules[moduleName];

    if (module) {
      return module;
    }

    throw new Error(`service not provided: <${moduleName}>`);
  }
}

Modeler.prototype._modules = [];