/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class Deployer {
  constructor({ fetch, fs, FormData }) {
    this.fetch = fetch;
    this.fs = fs;
    this.formDataConstructor = FormData;
  }

  /**
   * Deploy diagram to the given endpoint URL.
   */
  async deploy(url, options, cb = noop) {
    try {
      this.validateDeployParams(url, options);

      const requestParams = this.getRequestParams(options);

      const serverResponse = await this.fetch(url, requestParams);

      if (!serverResponse.ok) {
        const error = await getErrorFromResponse(serverResponse);
        throw error;
      }

      let response;

      try {
        response = await serverResponse.json();
      } catch (error) {
        response = serverResponse.statusText;
      }

      return cb(null, response);
    } catch (error) {
      error.deploymentName = options.deploymentName;

      return cb(error);
    }
  }

  validateDeployParams(url, { deploymentName, file }) {
    if (!deploymentName) {
      throw new Error('Failed to deploy process, deployment name must be provided.');
    }

    if (!file || !file.name || !file.path) {
      throw new Error('Failed to deploy process, file name and path must be provided.');
    }

    if (!url) {
      throw new Error('Failed to deploy process, endpoint url must not be empty.');
    }
  }

  getRequestParams(options) {
    const body = this.getBody(options);
    const headers = this.getHeaders(options);

    return {
      body,
      headers,
      method: 'POST'
    };
  }

  getBody({ deploymentName, tenantId, file = {} }) {
    const form = this.getFormData();

    form.append('deployment-name', deploymentName);

    if (tenantId) {
      form.append('tenant-id', tenantId);
    }

    form.append('deployment-source', 'Camunda Modeler');

    form.append('deploy-changed-only', 'true');

    form.append(file.name, this.fs.createReadStream(file.path));

    return form;
  }

  getHeaders({ auth }) {
    const headers = {};

    if (auth) {
      headers['Authorization'] = this.getAuthHeader(auth);
    }

    return headers;
  }

  getAuthHeader(auth) {
    const authHeaderBuilder = new AuthHeaderBuilder(auth);

    return authHeaderBuilder.build();
  }

  getFormData() {
    return new this.formDataConstructor();
  }
}


module.exports = Deployer;



// helpers //////
class AuthHeaderBuilder {
  constructor(options) {
    this.options = options;
  }

  build() {
    const {
      bearer,
      password,
      username
    } = this.options;

    if (bearer) {
      return this.getBearerHeader(bearer);
    }

    if (username && password) {
      return this.getBasicHeader(username, password);
    }

    throw new Error('Unknown auth options.');
  }

  getBearerHeader(bearer) {
    return `Bearer ${bearer}`;
  }

  getBasicHeader(username, password) {
    const credentials = btoa(`${username}:${password}`);

    return `Basic ${credentials}`;
  }
}

function btoa(input) {
  return Buffer.from(input, 'utf8').toString('base64');
}

function noop() { }


async function getErrorFromResponse(response) {
  const error = new Error();

  try {
    const body = await response.json();
    error.message = body.message;
  } catch (_) {
    error.message = response.statusText;
  }

  error.status = response.status;
  error.statusText = response.statusText;
  error.url = response.url;

  return error;
}
