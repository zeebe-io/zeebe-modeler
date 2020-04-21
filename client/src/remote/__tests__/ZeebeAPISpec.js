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

import ZeebeAPI from '../ZeebeAPI';

import { CAMUNDA_CLOUD, SELF_HOSTED } from './../../plugins/zeebe-plugin/shared/ZeebeTargetTypes';
import { AUTH_TYPES } from './../../plugins/zeebe-plugin/shared/ZeebeAuthTypes';


describe('ZeebeAPI', function() {

  describe('check connection', () => {

    it('should validate self hosted', () => {

      // given
      const spy = sinon.spy();
      const zeebeAPI = new ZeebeAPI({
        send(_, { endpoint }) {
          spy(endpoint);
        }
      });
      const contactPoint = 'contactPoint';
      const params = {
        targetType: SELF_HOSTED,
        authType: AUTH_TYPES.NONE,
        contactPoint
      };

      // when
      zeebeAPI.checkConnectivity(params);

      // then
      expect(spy).to.have.been.calledWith({
        type: SELF_HOSTED,
        url: contactPoint
      });
    });


    it('should validate oauth', () => {

      // given
      const spy = sinon.spy();
      const zeebeAPI = new ZeebeAPI({
        send(_, { endpoint }) {
          spy(endpoint);
        }
      });
      const targetType = SELF_HOSTED;
      const authType = AUTH_TYPES.OAUTH;
      const contactPoint = 'contactPoint';
      const oauthURL = 'oauthURL';
      const audience = 'audience';
      const clientId = 'oauthClientId';
      const clientSecret = 'oauthClientSecret';
      const params = {
        targetType,
        authType,
        contactPoint,
        oauthURL,
        audience,
        clientId,
        clientSecret
      };

      // when
      zeebeAPI.checkConnectivity(params);

      // then
      expect(spy).to.have.been.calledWith({
        type: 'oauth',
        url: contactPoint,
        oauthURL,
        audience,
        clientId,
        clientSecret
      });
    });


    it('should validate camunda cloud', () => {

      // given
      const spy = sinon.spy();
      const zeebeAPI = new ZeebeAPI({
        send(_, { endpoint }) {
          spy(endpoint);
        }
      });
      const targetType = CAMUNDA_CLOUD;
      const camundaCloudClientId = 'camundaCloudClientId';
      const camundaCloudClientSecret = 'camundaCloudClientSecret';
      const camundaCloudClusterId = 'camundaCloudClusterId';
      const params = {
        targetType,
        camundaCloudClientId,
        camundaCloudClientSecret,
        camundaCloudClusterId
      };

      // when
      zeebeAPI.checkConnectivity(params);

      // then
      expect(spy).to.have.been.calledWith({
        type: CAMUNDA_CLOUD,
        clientId: camundaCloudClientId,
        clientSecret: camundaCloudClientSecret,
        clusterId: camundaCloudClusterId
      });
    });
  });
});
