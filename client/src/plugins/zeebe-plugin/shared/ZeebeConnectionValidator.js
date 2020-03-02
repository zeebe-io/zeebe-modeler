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
      connectionMethod
    } = values;

    if (connectionMethod === SELF_HOSTED) {
      return await this.validateSelfHostedConnection(values.zeebeContactpointSelfHosted);
    } else if (connectionMethod === OAUTH) {
      return await this.validateOauthConnection(
        values.zeebeContactPointOauth,
        values.oauthURL,
        values.audience,
        values.oauthClientId,
        values.oauthClientSecret
      );
    } else if (connectionMethod === CAMUNDA_CLOUD) {
      return await this.validateCamundaCloudConnection(
        values.camundaCloudClientId,
        values.camundaCloudClientSecret,
        values.camundaCloudClusterId
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
