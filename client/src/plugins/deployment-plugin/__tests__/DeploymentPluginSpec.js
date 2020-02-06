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

import React from 'react';

import { shallow } from 'enzyme';

import DeploymentPlugin from '../DeploymentPlugin';

describe('<DeploymentPlugin>', () => {

  it('should render', () => {
    createDeploymentPlugin();
  });


  it('should be in hasActiveTab:false state when there is no active tab', () => {

    // given
    const { wrapper } = createDeploymentPlugin({ emptyTab: true });

    // then
    expect(wrapper.state('hasActiveTab')).to.be.false;
  });


  it('should be in hasActiveTab:true state when there is active tab', () => {

    // given
    const { wrapper } = createDeploymentPlugin();

    // then
    expect(wrapper.state('hasActiveTab')).to.be.true;
  });


  it('should be in modalVisible:true state when clicking on icon', () => {

    // given
    const { wrapper, instance } = createDeploymentPlugin();

    // when
    instance.onIconClicked();

    // then
    expect(wrapper.state('modalVisible')).to.be.true;
  });


  it('should be in modalVisible:false state when clicking on icon twice', () => {

    // given
    const { wrapper, instance } = createDeploymentPlugin();

    // when
    instance.onIconClicked();
    instance.onIconClicked();

    // then
    expect(wrapper.state('modalVisible')).to.be.false;
  });


  it('should be in modalVisible:false state when closed', () => {

    // given
    const { wrapper, instance } = createDeploymentPlugin();

    // when
    instance.closeModal();

    // then
    expect(wrapper.state('modalVisible')).to.be.false;
  });


  it('should return empty object if there is no stored config', async () => {

    // given
    const { instance } = createDeploymentPlugin();

    // when
    const config = await instance.getConfig();

    // then
    expect(config).to.eql({});
  });


  it('should return stored configurations', async () => {

    // given
    const storedConfig = { test: 'true' };
    const { instance } = createDeploymentPlugin({ storedConfig });

    // when
    const config = await instance.getConfig();

    // then
    expect(config).to.eql(storedConfig);
  });


  it('should store configurations', () => {

    // given
    const config = { test: 'true' };
    const setConfigSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({ setConfigSpy });

    // when
    instance.setConfig(config);

    // then
    expect(setConfigSpy).to.have.been.calledWith('DEPLOYMENT_CONFIG', config);
  });


  it('should save tab on deploy', async () => {

    // given
    const saveSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({ saveSpy });

    // when
    await instance.onDeploy({ deploymentName: 'testName' });

    // then
    expect(saveSpy).to.have.been.called;
  });


  it('should display notification on deployment success', async () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({
      deploymentSuccessful: true,
      displayNotificationSpy
    });

    // when
    await instance.onDeploy({ deploymentName: 'testName' });

    // then
    expect(displayNotificationSpy).to.have.been.calledWith({
      type: 'success',
      title: 'Deployment succeeded',
      duration: 4000
    });
  });


  it('should display notification on deployment failure', async () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({ displayNotificationSpy });

    // when
    await instance.onDeploy({ deploymentName: 'testName' });

    // then
    expect(displayNotificationSpy).to.have.been.calledWith({
      type: 'error',
      title: 'Deployment failed',
      content: 'See the log for further details.',
      duration: 10000
    });
  });


  it('should print log on deployment failure', async () => {

    // given
    const displayLogSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({ displayLogSpy });

    // when
    await instance.onDeploy({ deploymentName: 'testName' });

    // then
    expect(displayLogSpy).to.have.been.calledWith({
      category: 'deploy-error',
      message: 'details'
    });
  });
});


const createDeploymentPlugin = (params = {}) => {
  const subscribe = (type, callback) => {
    if (type === 'app.activeTabChanged') {
      callback(params.emptyTab ? {
        activeTab: { type: 'empty' }
      } : {
        activeTab: { type: 'nonEmpty' }
      });
    }
  };
  const _getGlobal = (key) => {
    if (key === 'zeebeAPI') {
      return {
        deploy: () => {
          return new Promise((resolve, reject) => {
            if (!params.deploymentSuccessful) {
              resolve({ response: { details: 'details' } });
            } else {
              resolve({ success: true });
            }
          });
        }
      };
    }
  };
  const config = {
    get: (key) => {
      if (key === 'DEPLOYMENT_CONFIG') {
        return params.storedConfig || null;
      }
    },
    set: (key, value) => {
      if (params.setConfigSpy) {
        params.setConfigSpy(key, value);
      }
    }
  };
  const displayNotification = (notificationParams) => {
    if (params.displayNotificationSpy) {
      params.displayNotificationSpy(notificationParams);
    }
  };
  const log = (logParams) => {
    if (params.displayLogSpy) {
      params.displayLogSpy(logParams);
    }
  };
  const triggerAction = (action, value) => {
    if (action === 'save') {
      if (params.saveSpy) {
        params.saveSpy(value);
      }
      return {
        file: {
          path: 'testPath'
        }
      };
    }
  };

  const wrapper = shallow(<DeploymentPlugin
    subscribe={ subscribe }
    _getGlobal={ _getGlobal }
    config={ config }
    displayNotification={ displayNotification }
    log={ log }
    triggerAction={ triggerAction }
  />);

  const instance = wrapper.instance();

  return { wrapper, instance };
};
