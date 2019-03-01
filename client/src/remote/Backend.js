/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Ids from 'ids';

const ids = new Ids();


/**
 * Backend rendering abstraction.
 */
export default class Backend {

  constructor(ipcRenderer, platform) {
    this.ipcRenderer = ipcRenderer;
    this.platform = platform;
  }

  /**
   * Send a message to the backend, awaiting the answer,
   * resolved as a promise.
   *
   * @param {Event} event
   * @param {...Object} args
   *
   * @return Promise<...>
   */
  send(event, ...args) {

    var id = ids.next();

    return new Promise((resolve, reject) => {

      this.once(event + ':response:' + id, function(evt, args) {
        if (args[0] !== null) {
          reject(args[0]);
        }

        // promises can only resolve with one argument
        return resolve(args[1]);
      });

      this.ipcRenderer.send(event, id, args);
    });

  }

  on(event, callback) {
    this.ipcRenderer.on(event, callback);
  }

  off(event, callback) {
    this.ipcRenderer.off(event, callback);
  }

  once(event, callback) {
    this.ipcRenderer.once(event, callback);
  }

  sendQuitAllowed = () => {
    this.send('app:quit-allowed');
  }

  sendQuitAborted = () => {
    this.send('app:quit-aborted');
  }

  sendReady = () => {
    this.send('client:ready');
  }

  showContextMenu = (type, options) => {
    this.send('context-menu:open', type, options);
  }

  sendMenuUpdate = (state = {}) => {
    this.send('menu:update', state);
  }

  registerMenu = (name, options) => {
    return this.send('menu:register', name, options);
  }

  getPlatform() {
    return this.platform;
  }
}