/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

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


    it('should validate config', () => {

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

      // then
      expect(Object.keys(validator.validateConfig(config))).to.have.lengthOf(0);
    });
  });
});
