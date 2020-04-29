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
  CONTACT_POINT_MUST_NOT_BE_EMPTY,
  OAUTH_URL_MUST_NOT_BE_EMPTY,
  AUDIENCE_MUST_NOT_BE_EMPTY,
  CLIENT_ID_MUST_NOT_BE_EMPTY,
  CLIENT_SECRET_MUST_NOT_BE_EMPTY,
  CLUSTER_ID_MUST_NOT_BE_EMPTY,
} from '../DeploymentPluginConstants';


describe('<DeploymentPluginValidator>', () => {

  describe('Basic validation', () => {

    const validator = new DeploymentPluginValidator(null);

    it('should validate Zeebe contact point', () => {

      // given
      const nonValidZeebeContactPoint = '';
      const validZeebeContactPoint = 'validZeebeContactPoint';

      // then
      expect(validator.validateZeebeContactPoint(nonValidZeebeContactPoint)).to.eql(CONTACT_POINT_MUST_NOT_BE_EMPTY);
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


    it('should validate config (camunda cloud)', () => {

      // given
      const config = {
        deployment: {
          name: 'name'
        },
        endpoint: {
          targetType: 'camundaCloud',
          camundaCloudClientId: 'test',
          camundaCloudClientSecret: 'test',
          camundaCloudClusterId: 'test'
        }
      };
      const wrongConfig = {
        deployment: {
          name: 'name'
        },
        endpoint: {
          targetType: 'camundaCloud',
          camundaCloudClientId: 'test'
        }
      };

      // then
      expect(Object.keys(validator.validateConfig(config))).to.have.lengthOf(0);
      expect(Object.keys(validator.validateConfig(wrongConfig))).to.have.lengthOf(2);
    });


    it('should validate config (self hosted none auth)', () => {

      // given
      const config = {
        deployment: {
          name: 'name'
        },
        endpoint: {
          targetType: 'selfHosted',
          authType: 'none',
          contactPoint: 'https://camunda.com'
        }
      };

      const wrongConfig = {
        deployment: {},
        endpoint: {
          targetType: 'selfHosted',
          authType: 'none',
          contactPoint: 'https://camunda.com'
        }
      };

      // then
      expect(Object.keys(validator.validateConfig(config))).to.have.lengthOf(0);
      expect(Object.keys(validator.validateConfig(wrongConfig))).to.have.lengthOf(1);
    });


    it('should validate config (self hosted oauth)', () => {

      // given
      const config = {
        deployment: {
          name: 'name'
        },
        endpoint: {
          targetType: 'selfHosted',
          authType: 'oauth',
          contactPoint: 'https://camunda.com',
          oauthURL: 'https://camunda.com',
          audience: 'bearer',
          clientId: 'test',
          clientSecret: 'test'
        }
      };

      const wrongConfig = {
        deployment: {
          name: 'name'
        },
        endpoint: {
          targetType: 'selfHosted',
          authType: 'oauth',
          contactPoint: 'https://camunda.com',
          oauthURL: 'https://camunda.com'
        }
      };

      // then
      expect(Object.keys(validator.validateConfig(config))).to.have.lengthOf(0);
      expect(Object.keys(validator.validateConfig(wrongConfig))).to.have.lengthOf(3);
    });
  });


  describe('<ConnectionChecker>', () => {

    it('should be created', () => {

      // given
      const connectionChecker = createConnectionChecker();

      // then
      expect(connectionChecker).to.exist;
    });


    describe('#check', () => {

      it('should work', async () => {

        // given
        const connectionChecker = createConnectionChecker();

        // when
        const { connectionResult } = await connectionChecker.check({});

        // then
        expect(connectionResult).to.eql({ success: true, response: {} });
      });


      it('should return last result if endpoint did not change', async () => {

        // given
        const spy = sinon.spy(() => Promise.resolve({ success: true, response: {} }));
        const endpoint = {};
        const connectionChecker = createConnectionChecker(spy);

        // when
        await connectionChecker.check(endpoint);
        await connectionChecker.check(endpoint);

        // then
        expect(spy).to.have.been.calledOnce;
      });


      it('should check again if endpoint changed', async () => {

        // given
        const spy = sinon.spy(() => Promise.resolve({ success: true, response: {} }));
        const endpoint = {};
        const connectionChecker = createConnectionChecker(spy);

        // when
        await connectionChecker.check(endpoint);
        await connectionChecker.check({ url: 'new' });

        // then
        expect(spy).to.have.been.calledTwice;
      });

    });


    describe('#subscribe', () => {

      it('should work', async () => {

        // given
        const onStart = sinon.spy();
        const onComplete = sinon.spy();
        const connectionChecker = createConnectionChecker();
        connectionChecker.subscribe({ onStart, onComplete });

        // when
        const result = await connectionChecker.check({});

        // then
        expect(onStart).to.have.been.calledOnce;
        expect(onComplete).to.have.been.calledOnce;
        expect(onComplete.args).to.eql([ [ result ] ]);
      });

    });


    describe('#unsubscribe', () => {

      it('should work', async () => {

        // given
        const onStart = sinon.spy();
        const onComplete = sinon.spy();
        const connectionChecker = createConnectionChecker();
        connectionChecker.subscribe({ onStart, onComplete });
        connectionChecker.unsubscribe();

        // when
        await connectionChecker.check({});

        // then
        expect(onStart).not.to.have.been.called;
        expect(onComplete).not.to.have.been.called;
      });

    });

  });
});



// helper
function createConnectionChecker(checkConnectivity, useRealDelays) {
  const zeebeAPI = new MockZeebeAPI(checkConnectivity);
  const validator = new DeploymentPluginValidator(zeebeAPI);

  const connectionChecker = validator.createConnectionChecker();

  if (!useRealDelays) {
    connectionChecker.getCheckDelay = () => 0;
  }

  return connectionChecker;
}

function MockZeebeAPI(checkConnectivity) {
  const mockCheck = () => Promise.resolve({ success: true, response: {} });
  this.checkConnectivity = checkConnectivity || mockCheck;
}
