/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import {
  SELF_HOSTED,
  OAUTH,
  CAMUNDA_CLOUD
} from './ZeebeConnectionTypes';

export default class ZeebeConnectionValidator {

  constructor(zeebeAPI) {
    this.zeebeAPI = zeebeAPI;
  }

  validateConnection = async (values) => {
    const {
      audience,
      camundaCloudClientId,
      camundaCloudClientSecret,
      camundaCloudClusterId,
      connectionMethod,
      oauthClientId,
      oauthClientSecret,
      oauthURL,
      zeebeContactPointOauth,
      zeebeContactpointSelfHosted
    } = values;

    if (connectionMethod === SELF_HOSTED) {
      return await this.validateSelfHostedConnection(zeebeContactpointSelfHosted);
    } else if (connectionMethod === OAUTH) {
      return await this.validateOauthConnection(
        zeebeContactPointOauth,
        oauthURL,
        audience,
        oauthClientId,
        oauthClientSecret
      );
    } else if (connectionMethod === CAMUNDA_CLOUD) {
      return await this.validateCamundaCloudConnection(
        camundaCloudClientId,
        camundaCloudClientSecret,
        camundaCloudClusterId
      );
    }
  }

  validateCamundaCloudConnection = (clientId, clientSecret, clusterId) => {
    const params = {
      type: CAMUNDA_CLOUD,
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      clusterId: clusterId || ''
    };
    return this.zeebeAPI.checkConnectivity(params);
  }

  validateOauthConnection = (contactpoint, oauthURL, audience, oauthClientId, oauthClientSecret) => {
    const params = {
      type: OAUTH,
      url: contactpoint || '',
      oauthURL: oauthURL || '',
      audience: audience || '',
      clientId: oauthClientId || '',
      clientSecret: oauthClientSecret || ''
    };
    return this.zeebeAPI.checkConnectivity(params);
  }

  validateSelfHostedConnection = (contactpoint) => {
    const params = {
      type: SELF_HOSTED,
      url: contactpoint || '',
    };
    return this.zeebeAPI.checkConnectivity(params);
  }
}
