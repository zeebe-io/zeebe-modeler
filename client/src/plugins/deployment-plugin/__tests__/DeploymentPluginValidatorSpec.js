/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

/* global sinon */

import DeploymentPluginValidator from '../DeploymentPluginValidator';

import {
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
} from '../DeploymentPluginConstants';

describe('<DeploymentPluginValidator>', () => {

  describe('Basic validation', () => {

    const validator = new DeploymentPluginValidator(null);

    it('should validate deployment name', () => {

      // given
      const nonValidName = '';
      const validName = 'validName';

      // then
      expect(validator.validateDeploymentName(nonValidName)).to.eql(DEPLOYMENT_NAME_MUST_NOT_BE_EMPTY);
      expect(validator.validateDeploymentName(validName)).to.not.exist;
    });


    it('should validate Zeebe contact point', () => {

      // given
      const nonValidZeebeContactPoint = '';
      const validZeebeContactPoint = 'validZeebeContactPoint';

      // then
      expect(validator.validateZeebeContactPoint(nonValidZeebeContactPoint)).to.eql(CONTACTPOINT_MUST_NOT_BE_EMPTY);
      expect(validator.validateZeebeContactPoint(validZeebeContactPoint)).to.not.exist;
    });


    it('should validate OAuth URL', () => {

      // given
      const nonValidOAuthURL = '';
      const validOAuthURL = 'validOAuthURL';

      // then
      expect(validator.validateOAuthURL(nonValidOAuthURL)).to.eql(OAUTH_URL_MUST_NOT_BE_EMPTY);
      expect(validator.validateOAuthURL(validOAuthURL)).to.not.exist;
    });


    it('should validate audience', () => {

      // given
      const nonValidAudience = '';
      const validAudience = 'validAudience';

      // then
      expect(validator.validateAudience(nonValidAudience)).to.eql(AUDIENCE_MUST_NOT_BE_EMPTY);
      expect(validator.validateAudience(validAudience)).to.not.exist;
    });


    it('should validate client id', () => {

      // given
      const nonValidClientId = '';
      const validClientId = 'validClientId';

      // then
      expect(validator.validateClientId(nonValidClientId)).to.eql(CLIENT_ID_MUST_NOT_BE_EMPTY);
      expect(validator.validateClientId(validClientId)).to.not.exist;
    });


    it('should validate client secret', () => {

      // given
      const nonValidClientSecret = '';
      const validClientSecret = 'validClientSecret';

      // then
      expect(validator.validateClientSecret(nonValidClientSecret)).to.eql(CLIENT_SECRET_MUST_NOT_BE_EMPTY);
      expect(validator.validateClientSecret(validClientSecret)).to.not.exist;
    });


    it('should validate cluster id', () => {

      // given
      const nonValidClusterId = '';
      const validClusterId = 'validClusterId';

      // then
      expect(validator.validateClusterId(nonValidClusterId)).to.eql(CLUSTER_ID_MUST_NOT_BE_EMPTY);
      expect(validator.validateClusterId(validClusterId)).to.not.exist;
    });
  });


  describe('Connection validation', () => {

    it('should validate self hosted', () => {

      // given
      const contactPoint = 'contactPoint';
      const checkConnectivitySpy = sinon.spy();
      const params = {
        connectionMethod: SELF_HOSTED,
        zeebeContactpointSelfHosted: contactPoint
      };
      const validator = getValidator(checkConnectivitySpy);

      // when
      validator.validateConnection(params);

      // then
      expect(checkConnectivitySpy).to.have.been.calledWith({
        type: SELF_HOSTED,
        url: contactPoint
      });
    });


    it('should validate oauth', () => {

      // given
      const checkConnectivitySpy = sinon.spy();
      const validator = getValidator(checkConnectivitySpy);
      const connectionMethod = OAUTH;
      const zeebeContactPointOauth = 'contactPoint';
      const oauthURL = 'oauthURL';
      const audience = 'audience';
      const oauthClientId = 'oauthClientId';
      const oauthClientSecret = 'oauthClientSecret';
      const params = {
        connectionMethod,
        zeebeContactPointOauth,
        oauthURL,
        audience,
        oauthClientId,
        oauthClientSecret
      };

      // when
      validator.validateConnection(params);

      // then
      expect(checkConnectivitySpy).to.have.been.calledWith({
        type: OAUTH,
        url: zeebeContactPointOauth,
        oauthURL,
        audience,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret
      });
    });


    it('should validate camunda cloud', () => {

      // given
      const checkConnectivitySpy = sinon.spy();
      const validator = getValidator(checkConnectivitySpy);
      const connectionMethod = CAMUNDA_CLOUD;
      const camundaCloudClientId = 'camundaCloudClientId';
      const camundaCloudClientSecret = 'camundaCloudClientSecret';
      const camundaCloudClusterId = 'camundaCloudClusterId';
      const params = {
        connectionMethod,
        camundaCloudClientId,
        camundaCloudClientSecret,
        camundaCloudClusterId
      };

      // when
      validator.validateConnection(params);

      // then
      expect(checkConnectivitySpy).to.have.been.calledWith({
        type: CAMUNDA_CLOUD,
        clientId: camundaCloudClientId,
        clientSecret: camundaCloudClientSecret,
        clusterId: camundaCloudClusterId
      });
    });
  });
});


// helper

const getValidator = (checkConnectivitySpy) => new DeploymentPluginValidator({ checkConnectivity: checkConnectivitySpy });
