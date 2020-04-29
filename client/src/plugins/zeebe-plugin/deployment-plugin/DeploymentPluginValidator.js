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

import { AUTH_TYPES } from '../shared/ZeebeAuthTypes';

import { CAMUNDA_CLOUD, SELF_HOSTED } from '../shared/ZeebeTargetTypes';

import ZeebeConnectionValidator from '../shared/ZeebeConnectionValidator';

import pDefer from 'p-defer';


export default class DeploymentPluginValidator {

  constructor(zeebeAPI) {

    this.zeebeConnectionValidator = new ZeebeConnectionValidator(zeebeAPI);
  }

  createConnectionChecker() {
    return new ConnectionChecker(this);
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

  validateConnection = (endpoint) => {
    return this.zeebeConnectionValidator.validateConnection(endpoint);
  }

  validateEndpoint = endpoint => {
    const { authType, targetType } = endpoint;

    let validators;

    if (targetType === CAMUNDA_CLOUD) {
      validators = {
        camundaCloudClientId: this.validateClientId,
        camundaCloudClientSecret: this.validateClientSecret,
        camundaCloudClusterId: this.validateClusterId
      };
    } else if (targetType === SELF_HOSTED) {
      if (endpoint.authType === AUTH_TYPES.NONE) {
        validators = {
          contactPoint: this.validateZeebeContactPoint
        };
      } else if (authType === AUTH_TYPES.OAUTH) {
        validators = {
          contactPoint: this.validateZeebeContactPoint,
          oauthURL: this.validateOAuthURL,
          audience: this.validateAudience,
          clientId: this.validateClientId,
          clientSecret: this.validateClientSecret
        };
      }
    }

    return this.validate(endpoint, validators);
  }

  validate(values, validators) {

    const errors = {};

    for (const [ attr, validator ] of Object.entries(validators)) {

      if (!validator) {
        continue;
      }

      const error = validator(values[attr]);

      if (error) {
        errors[attr] = error;
      }
    }

    return errors;
  }
}

class ConnectionChecker {

  constructor(validator) {
    this.validator = validator;
  }

  subscribe(hooks) {
    this.hooks = hooks;
  }

  unsubscribe() {

    if (this.checkTimer) {
      clearTimeout(this.checkTimer);

      this.checkTimer = null;
    }

    this.endpoint = { __non_existing_endpoint: true };

    this.lastCheck = null;

    this.hooks = null;
  }

  check(endpoint) {
    this.setEndpoint(endpoint);

    const {
      lastCheck
    } = this;

    // return cached result if endpoint did not change
    // we'll periodically re-check in background anyway
    if (lastCheck && shallowEquals(endpoint, lastCheck.endpoint)) {
      return Promise.resolve(lastCheck.result);
    }

    const deferred = this.scheduleCheck();

    return deferred.promise;
  }

  setEndpoint(endpoint) {
    this.endpoint = endpoint;
  }

  checkCompleted(endpoint, result) {

    const {
      endpoint: currentEndpoint,
      deferred,
      hooks
    } = this;

    if (!shallowEquals(endpoint, currentEndpoint)) {
      return;
    }

    const {
      endpointErrors
    } = result;

    this.lastCheck = {
      endpoint,
      result
    };

    this.deferred = null;

    deferred.resolve(result);

    hooks && hooks.onComplete && hooks.onComplete(result);

    if (!hasKeys(endpointErrors)) {
      this.scheduleCheck();
    }
  }

  checkStart() {

    const {
      hooks
    } = this;

    hooks.onStart && hooks.onStart();
  }

  scheduleCheck() {

    const {
      endpoint,
      lastCheck,
      checkTimer,
      validator
    } = this;

    const deferred = this.deferred = this.deferred || pDefer();

    // stop scheduled check
    if (checkTimer) {
      clearTimeout(checkTimer);
    }

    const endpointErrors = validator.validateEndpoint(endpoint);

    if (hasKeys(endpointErrors)) {
      this.checkCompleted(endpoint, {
        endpointErrors
      });
    } else {

      const delay = this.getCheckDelay(endpoint, lastCheck);

      this.checkTimer = setTimeout(() => {
        this.triggerCheck();
      }, delay);
    }

    return deferred;
  }

  triggerCheck() {
    const {
      endpoint,
      validator
    } = this;

    this.checkStart();

    validator.validateConnection(endpoint).then(connectionResult => {

      this.checkCompleted(endpoint, {
        connectionResult
      });

    }).catch(error => {
      console.error('connection check failed', error);
    });
  }

  getCheckDelay(endpoint, lastCheck) {

    if (!lastCheck) {
      return 1000;
    }

    const {
      endpoint: lastEndpoint
    } = lastCheck;

    const endpointChanged = !shallowEquals(endpoint, lastEndpoint);

    if (endpointChanged) {
      return 1000;
    }

    return 5000;
  }
}

// helpers /////////////////

function hasKeys(obj) {
  return obj && Object.keys(obj).length > 0;
}

function hash(el) {
  return JSON.stringify(el);
}

function shallowEquals(a, b) {
  return hash(a) === hash(b);
}
