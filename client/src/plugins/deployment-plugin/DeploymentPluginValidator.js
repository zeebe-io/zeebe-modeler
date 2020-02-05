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
  MUST_PROVIDE_A_VALUE,
  DEPLOYMENT_NAME_MUST_NOT_BE_EMPTY,
  CONTACTPOINT_MUST_NOT_BE_EMPTY,
  OAUTH_URL_MUST_NOT_BE_EMPTY,
  AUDIENCE_MUST_NOT_BE_EMPTY,
  CLIENT_ID_MUST_NOT_BE_EMPTY,
  CLIENT_SECRET_MUST_NOT_BE_EMPTY,
  CLUSTER_ID_MUST_NOT_BE_EMPTY,
  SELF_HOSTED,
  OAUTH,
  CAMUNDA_CLOUD
} from './DeploymentPluginConstants';

export default class DeploymentPluginValidator {

  constructor(zeebeAPI) {
    this.zeebeAPI = zeebeAPI;
  }

  validateNonEmpty = (value, message = MUST_PROVIDE_A_VALUE) => {
    return value ? null : message;
  }

  validateDeploymentName = (value) => {
    return this.validateNonEmpty(value, DEPLOYMENT_NAME_MUST_NOT_BE_EMPTY);
  }

  validateZeebeContactPoint = (value) => {
    return this.validateNonEmpty(value, CONTACTPOINT_MUST_NOT_BE_EMPTY);
  }

  validateOAuthURL = (value) => {
    return this.validateNonEmpty(value, OAUTH_URL_MUST_NOT_BE_EMPTY);
  }

  validateAudience = (value) => {
    return this.validateNonEmpty(value, AUDIENCE_MUST_NOT_BE_EMPTY);
  }

  validateClientId = (value) => {
    return this.validateNonEmpty(value, CLIENT_ID_MUST_NOT_BE_EMPTY);
  }

  validateClientSecret = (value) => {
    return this.validateNonEmpty(value, CLIENT_SECRET_MUST_NOT_BE_EMPTY);
  }

  validateClusterId = (value) => {
    return this.validateNonEmpty(value, CLUSTER_ID_MUST_NOT_BE_EMPTY);
  }

  validateSelfHostedConnection = (contactpoint) => {
    const params = {
      type: SELF_HOSTED,
      url: contactpoint || '',
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

  validateCamundaCloudConnection = (clientId, clientSecret, clusterId) => {
    const params = {
      type: CAMUNDA_CLOUD,
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      clusterId: clusterId || ''
    };
    return this.zeebeAPI.checkConnectivity(params);
  }

  validateConnection = async (values) => {
    if (values.connectionMethod === SELF_HOSTED) {
      return await this.validateSelfHostedConnection(values.zeebeContactpointSelfHosted);
    } else if (values.connectionMethod === OAUTH) {
      return await this.validateOauthConnection(
        values.zeebeContactPointOauth,
        values.oauthURL,
        values.audience,
        values.oauthClientId,
        values.oauthClientSecret
      );
    } else if (values.connectionMethod === CAMUNDA_CLOUD) {
      return await this.validateCamundaCloudConnection(
        values.camundaCloudClientId,
        values.camundaCloudClientSecret,
        values.camundaCloudClusterId
      );
    }
  }

}
