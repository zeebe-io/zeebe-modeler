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

  checkConnectivity(rawEndpoint) {
    const endpoint = this.extractEndpoint({ endpoint: rawEndpoint });

    return this.backend.send('zeebe:checkConnectivity', { endpoint });
  }

  deploy(parameters) {
    const endpoint = this.extractEndpoint(parameters);

    return this.backend.send('zeebe:deploy', { ...parameters, endpoint });
  }

  run(parameters) {
    const endpoint = this.extractEndpoint(parameters);

    return this.backend.send('zeebe:run', { ...parameters, endpoint });
  }

  extractEndpoint(parameters) {
    const {
      authType,
      audience,
      targetType,
      clientId,
      clientSecret,
      oauthURL,
      contactPoint,
      camundaCloudClientId,
      camundaCloudClientSecret,
      camundaCloudClusterId
    } = parameters.endpoint;

    if (targetType === 'selfHosted') {
      if (authType === 'none') {
        return {
          type: 'selfHosted',
          url: contactPoint || '',
        };
      } else if (authType === 'oauth') {
        return {
          type: 'oauth',
          url: contactPoint,
          oauthURL,
          audience,
          clientId,
          clientSecret
        };
      }
    } else if (targetType === 'camundaCloud') {
      return {
        type: 'camundaCloud',
        clientId: camundaCloudClientId,
        clientSecret: camundaCloudClientSecret,
        clusterId: camundaCloudClusterId
      };
    }

  }
}
