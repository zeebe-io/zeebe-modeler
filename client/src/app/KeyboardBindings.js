/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  isCmd as isCommandOrControl,
  isKey,
  isShift
} from 'diagram-js/lib/features/keyboard/KeyboardUtil';

import { isArray } from 'min-dash';


/**
 * Fixes issue with Electron applications on Linux and Windows. Checks for
 * menu item accelarators that can't be overridden (CommandOrControl+A/C/V) and
 * manually triggers corresponding editor actions.
 *
 * See https://github.com/electron/electron/issues/7165.
 */
export default class KeyboardBindings {

  /**
   * Constructor.
   *
   * @param {Object} options - Options.
   * @param {Object} [options.menu] - Menu.
   * @param {Function} [options.onAction] - Function to be called on action.
   */
  constructor(options = {}) {
    const {
      menu,
      onAction
    } = options;

    this.onAction = onAction;

    this.copy = null;
    this.cut = null;
    this.paste = null;
    this.selectAll = null;

    if (menu) {
      this.update(menu);
    }
  }

  bind() {
    window.addEventListener('keydown', this._keyHandler);
  }

  unbind() {
    window.removeEventListener('keydown', this._keyHandler);
  }

  _keyHandler = (event) => {
    if (!isCommandOrControl(event)) {
      return;
    }

    let action = null;

    const { onAction } = this;

    // copy
    if (isCopy(event) && isEnabled(this.copy) && !hasRole(this.copy, 'copy')) {
      action = getAction(this.copy);
    }

    // cut
    if (isCut(event) && isEnabled(this.cut) && !hasRole(this.cut, 'cut')) {
      action = getAction(this.cut);
    }

    // paste
    if (isPaste(event) && isEnabled(this.paste) && !hasRole(this.paste, 'paste')) {
      action = getAction(this.paste);
    }

    if (isRedo(event) && isEnabled(this.redo) && !hasRole(this.redo, 'redo')) {
      action = getAction(this.redo);
    }

    // select all
    if (isSelectAll(event) && isEnabled(this.selectAll) && !hasRole(this.selectAll, 'selectAll')) {
      action = getAction(this.selectAll);
    }

    if (action && onAction) {
      onAction(null, action);

      event.preventDefault();
    }
  }

  update(menu) {
    this.copy = findCopy(menu);
    this.cut = findCut(menu);
    this.paste = findPaste(menu);
    this.redo = findRedo(menu);
    this.selectAll = findSelectAll(menu);
  }

  setOnAction(onAction) {
    this.onAction = onAction;
  }
}

// helpers //////////

function isCopy(event) {
  return isKey(['c', 'C'], event) && isCommandOrControl(event);
}

function isCut(event) {
  return isKey(['x', 'X'], event) && isCommandOrControl(event);
}

function isPaste(event) {
  return isKey(['v', 'V'], event) && isCommandOrControl(event);
}

function isRedo(event) {
  return isKey(['z', 'Z'], event) && isCommandOrControl(event) && isShift(event);
}

function isSelectAll(event) {
  return isKey(['a', 'A'], event) && isCommandOrControl(event);
}

/**
 * Compare accelerators ignoring whitespace and upper/lowercase.
 *
 * @param {String} a - Accelerator a.
 * @param {String} b - Accelerator b.
 *
 * @returns {boolean}
 */
function isAccelerator(a = '', b = '') {
  return a.replace(/\s+/g, '') === b.replace(/\s+/g, '');
}

/**
 * Find first matching entry.
 *
 * @param {Array} [menu] - Menu.
 * @param {Function} matcher - Matcher function.
 *
 * @returns {Object}
 */
export function find(menu = [], matcher) {
  return menu.reduce((found, entry) => {
    if (found) {
      return found;
    }

    if (isArray(entry)) {
      return find(entry, matcher);
    }

    if (matcher(entry)) {
      return entry;
    }

    if (entry.submenu) {
      return find(entry.submenu, matcher);
    }
  }, null);
}

function findCopy(menu) {
  return find(menu, ({ accelerator }) => isAccelerator(accelerator, 'CommandOrControl+C'));
}

function findCut(menu) {
  return find(menu, ({ accelerator }) => isAccelerator(accelerator, 'CommandOrControl+X'));
}

function findPaste(menu) {
  return find(menu, ({ accelerator }) => isAccelerator(accelerator, 'CommandOrControl+V'));
}

function findRedo(menu) {
  return find(menu, ({ accelerator }) => isAccelerator(accelerator, 'CommandOrControl+Y'));
}

function findSelectAll(menu) {
  return find(menu, ({ accelerator }) => isAccelerator(accelerator, 'CommandOrControl+A'));
}

/**
 * Check wether entry is enabled. If not specified it is enabled.
 *
 * @param {Object} entry - Entry.
 *
 * @returns {boolean}
 */
function isEnabled(entry) {
  return entry && entry.enabled !== false;
}

function hasRole(entry, role) {
  return entry && entry.role && entry.role === role;
}

function getAction(entry) {
  return entry && entry.action;
}