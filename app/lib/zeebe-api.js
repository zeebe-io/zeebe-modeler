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

const fs = require('fs');
const ZB = require('zeebe-node');

let zbClientInstance;

const errorReasons = {
  UNKNOWN: 'UNKNOWN',
  CONTACT_POINT: 'CONTACT_POINT',
  AUTHORIZATION: 'AUTHORIZATION',
  CLUSTER_ID: 'CLUSTER_ID',
  AUDIENCE: 'AUDIENCE',
  OAUTH_URL: 'OAUTH_URL'
};

module.exports.checkConnectivity = async function(parameters) {

  restartZeebeClient(parameters);

  try {
    await zbClientInstance.topology();
    return { isSuccessful: true };
  } catch (err) {
    return {
      isSuccessful: false,
      reason: getErrorReason(err, parameters)
    };
  }
};

module.exports.deploy = async function(parameters) {

  const buffer = fs.readFileSync(parameters.filePath);

  try {

    const resp = await zbClientInstance.deployWorkflow({
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
};

module.exports.run = async function(parameters) {

  try {

    const resp = await zbClientInstance.createWorkflowInstance({
      bpmnProcessId: parameters.processId
    });

    return resp;
  } catch (err) {
    return false;
  }
};

async function shutdownClientInstance() {
  if (zbClientInstance) {
    await zbClientInstance.close();
  }
}


function getErrorReason(error, parameters) {
  if (error.code === 14) { // grpc unavailable
    if (parameters.type === 'camundaCloud') {
      return errorReasons.CLUSTER_ID;
    }
    return errorReasons.CONTACT_POINT;
  }

  if (error.message) {
    if (error.message.includes('Unauthorized')) {
      return errorReasons.AUTHORIZATION;
    }
    if (error.message.includes('Forbidden')) {
      return errorReasons.AUDIENCE;
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('Not Found')) {
      return errorReasons.OAUTH_URL;
    }
    if (error.message.includes('Unsupported protocol') && parameters.type === 'oauth') {
      return errorReasons.OAUTH_URL;
    }
  }
  return errorReasons.UNKNOWN;
}

function restartZeebeClient(parameters) {
  shutdownClientInstance();

  if (parameters.type === 'selfHosted') {

    let url = parameters.url;
    let port = '26500';
    if (parameters.url.includes(':')) {
      const splitted = parameters.url.split(':');
      url = splitted[0];
      port = splitted[1];
    }

    zbClientInstance = new ZB.ZBClient(url, {
      retry: false,
      port: port
    });
  } else if (parameters.type === 'oauth') {

    let url = parameters.url;
    let port = '443';
    if (parameters.url.includes(':')) {
      const splitted = parameters.url.split(':');
      url = splitted[0];
      port = splitted[1];
    }

    zbClientInstance = new ZB.ZBClient(url, {
      retry: false,
      oAuth: {
        url: parameters.oauthURL,
        audience: parameters.audience,
        clientId: parameters.clientId,
        clientSecret: parameters.clientSecret,
        cacheOnDisk: false
      },
      useTLS: true,
      port: port
    });
  } else if (parameters.type === 'camundaCloud') {

    zbClientInstance = new ZB.ZBClient({
      retry: false,
      camundaCloud: {
        clientId: parameters.clientId,
        clientSecret: parameters.clientSecret,
        clusterId: parameters.clusterId,
        cacheOnDisk: false
      },
      useTLS: true
    });
  }
}
