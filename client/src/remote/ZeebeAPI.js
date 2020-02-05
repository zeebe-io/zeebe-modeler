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
* ZeebeAPI for deployment/run instance.
*/
export default class ZeebeAPI {

  constructor(backend) {
    this.backend = backend;
  }

  checkConnectivity(parameters) {
    return this.backend.send('zeebe:checkConnectivity', parameters);
  }

  deploy(parameters) {
    return this.backend.send('zeebe:deploy', parameters);
  }

  run(parameters) {
    return this.backend.send('zeebe:run', parameters);
  }
}
