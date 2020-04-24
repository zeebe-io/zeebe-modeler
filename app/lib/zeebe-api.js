/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

'use strict';

const errorReasons = {
  UNKNOWN: 'UNKNOWN',
  CONTACT_POINT_UNAVAILABLE: 'CONTACT_POINT_UNAVAILABLE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CLUSTER_UNAVAILABLE: 'CLUSTER_UNAVAILABLE',
  FORBIDDEN: 'FORBIDDEN',
  OAUTH_URL: 'OAUTH_URL'
};

/**
 * @typedef {object} ZeebeClientParameters
 * @property {object} endpoint
 * @property {'selfHosted'|'camundaCloud'|'oauth'} endpoint.type
 */


module.exports = class ZeebeAPI {
  constructor(fs, ZB) {
    this.fs = fs;
    this.ZB = ZB;
  }

  async checkConnectivity(parameters) {

    const {
      endpoint
    } = parameters;

    const zeebeClient = this.getZeebeClient(endpoint);

    try {
      await zeebeClient.topology();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        reason: getErrorReason(err, endpoint)
      };
    }
  }

  async deploy(parameters) {

    const zeebeClientInstance = this.getZeebeClient(parameters.endpoint);

    const buffer = this.fs.readFileSync(parameters.filePath);

    try {

      const resp = await zeebeClientInstance.deployWorkflow({
        definition: buffer,
        name: parameters.name
      });

      return {
        success: true,
        response: resp
      };
    } catch (err) {

      return {
        success: false,
        response: err
      };
    }
  }

  /**
   * Run process instance.
   *
   * @public
   * @param {object} parameters
   */
  async run(parameters) {

    const client = this.getZeebeClient(parameters.endpoint);

    try {

      const response = await client.createWorkflowInstance({
        bpmnProcessId: parameters.processId
      });

      return {
        success: true,
        response: response
      };
    } catch (err) {

      return {
        success: false,
        response: err
      };
    }
  }

  async shutdownClientInstance() {
    if (this.zbClientInstanceCache) {
      await this.zbClientInstanceCache.close();
    }
  }

  getZeebeClient(endpoint) {

    if (endpoint && isHashEqual(endpoint, this.endpointCache)) {
      return this.zbClientInstanceCache;
    }

    this.shutdownClientInstance();
    this.endpointCache = endpoint;

    if (endpoint.type === 'selfHosted') {

      this.zbClientInstanceCache = new this.ZB.ZBClient(endpoint.url, {
        retry: false
      });
    } else if (endpoint.type === 'oauth') {

      this.zbClientInstanceCache = new this.ZB.ZBClient(endpoint.url, {
        retry: false,
        oAuth: {
          url: endpoint.oauthURL,
          audience: endpoint.audience,
          clientId: endpoint.clientId,
          clientSecret: endpoint.clientSecret,
          cacheOnDisk: false
        },
        useTLS: true
      });
    } else if (endpoint.type === 'camundaCloud') {

      this.zbClientInstanceCache = new this.ZB.ZBClient({
        retry: false,
        camundaCloud: {
          clientId: endpoint.clientId,
          clientSecret: endpoint.clientSecret,
          clusterId: endpoint.clusterId,
          cacheOnDisk: false
        },
        useTLS: true
      });
    }

    return this.zbClientInstanceCache;
  }
};

function getErrorReason(error, parameters) {
  if (error.code === 14) { // grpc unavailable
    if (parameters.type === 'camundaCloud') {
      return errorReasons.CLUSTER_UNAVAILABLE;
    }
    return errorReasons.CONTACT_POINT_UNAVAILABLE;
  }

  if (error.message) {
    if (error.message.includes('Unauthorized')) {
      return errorReasons.UNAUTHORIZED;
    }
    if (error.message.includes('Forbidden')) {
      return errorReasons.FORBIDDEN;
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('Not Found')) {
      if (parameters.type === 'oauth') {
        return errorReasons.OAUTH_URL;
      } else if (parameters.type === 'camundaCloud') {
        return errorReasons.CLUSTER_UNAVAILABLE;
      }

      return errorReasons.CONTACT_POINT_UNAVAILABLE;
    }
    if (error.message.includes('Unsupported protocol') && parameters.type === 'oauth') {
      return errorReasons.OAUTH_URL;
    }
  }
  return errorReasons.UNKNOWN;
}

function isHashEqual(parameter1, parameter2) {
  return JSON.stringify(parameter1) === JSON.stringify(parameter2);
}
