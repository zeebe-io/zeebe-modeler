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
  CAMUNDA_CLOUD
} from './ZeebeTargetTypes';

import { AUTH_TYPES } from './ZeebeAuthTypes';

export default class ZeebeConnectionValidator {

  constructor(zeebeAPI) {
    this.zeebeAPI = zeebeAPI;
  }

  validateConnection = async (values) => {
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
    } = values;

    if (targetType === SELF_HOSTED) {
      if (authType === AUTH_TYPES.NONE) {
        return await this.validateSelfHostedConnection(contactPoint);
      } else if (authType === AUTH_TYPES.OAUTH) {
        return await this.validateOauthConnection(
          contactPoint,
          oauthURL,
          audience,
          clientId,
          clientSecret
        );
      }
    } else if (targetType === CAMUNDA_CLOUD) {
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

  validateOauthConnection = (contactpoint, oauthURL, audience, clientId, clientSecret) => {
    const params = {
      type: 'oauth',
      url: contactpoint || '',
      oauthURL: oauthURL || '',
      audience: audience || '',
      clientId: clientId || '',
      clientSecret: clientSecret || ''
    };
    return this.zeebeAPI.checkConnectivity(params);
  }

  validateSelfHostedConnection = (contactPoint) => {
    const params = {
      type: SELF_HOSTED,
      url: contactPoint || '',
    };
    return this.zeebeAPI.checkConnectivity(params);
  }
}
