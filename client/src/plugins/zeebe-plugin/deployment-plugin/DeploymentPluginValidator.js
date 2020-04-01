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
  CONTACT_POINT_MUST_NOT_BE_EMPTY,
  OAUTH_URL_MUST_NOT_BE_EMPTY,
  AUDIENCE_MUST_NOT_BE_EMPTY,
  CLIENT_ID_MUST_NOT_BE_EMPTY,
  CLIENT_SECRET_MUST_NOT_BE_EMPTY,
  CLUSTER_ID_MUST_NOT_BE_EMPTY,
} from './DeploymentPluginConstants';

import ZeebeConnectionValidator from '../shared/ZeebeConnectionValidator';

export default class DeploymentPluginValidator {

  constructor(zeebeAPI) {

    this.zeebeConnectionValidator = new ZeebeConnectionValidator(zeebeAPI);
  }

  validateNonEmpty = (value, message = MUST_PROVIDE_A_VALUE) => {
    return value ? null : message;
  }

  validateZeebeContactPoint = (value) => {
    return this.validateNonEmpty(value, CONTACT_POINT_MUST_NOT_BE_EMPTY);
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

  validateConnection = (values) => {
    return this.zeebeConnectionValidator.validateConnection(values);
  }

}
