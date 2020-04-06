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

const DEPLOYMENT_CONFIG_KEY = 'deployment-tool';
const ZEEBE_ENDPOINTS_CONFIG_KEY = 'zeebeEndpoints';

const NOOP_TAB = {
  file: {
    path: 'testPath'
  }
};

describe('<DeploymentPlugin>', () => {

  it('should render', () => {
    createDeploymentPlugin();
  });


  it('should save tab before deploy', async () => {

    // given
    const saveSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({ saveSpy });

    // when
    await instance.onIconClicked();

    // then
    expect(saveSpy).to.have.been.called;
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


  it('should be in modalVisible:true state when clicking on icon', async () => {

    // given
    const { wrapper, instance } = createDeploymentPlugin();

    // when
    await instance.onIconClicked();

    // then
    expect(wrapper.state('modalVisible')).to.be.true;
  });


  it('should be in modalVisible:false state when clicking on icon twice', async () => {

    // given
    const { wrapper, instance } = createDeploymentPlugin();

    // when
    await instance.onIconClicked();
    await instance.onIconClicked();

    // then
    expect(wrapper.state('modalVisible')).to.be.false;
  });


  it('should be in modalVisible:false state when closed', async () => {

    // given
    const { wrapper, instance } = createDeploymentPlugin();

    // when
    await instance.closeModal();

    // then
    expect(wrapper.state('modalVisible')).to.be.false;
  });


  it('should return empty object if there is no stored tab config', async () => {

    // given
    const { instance } = createDeploymentPlugin();

    // when
    const config = await instance.getSavedConfiguration();

    // then
    expect(config).to.eql({});
  });


  it('should return stored tab configuration', async () => {

    // given
    const storedTabConfiguration = { deployment: { name: 'foo' } };
    const { instance } = createDeploymentPlugin({ storedTabConfiguration });

    // when
    const config = await instance.getSavedConfiguration();

    // then
    expect(config.deployment).to.eql(storedTabConfiguration.deployment);
  });


  it('should retrieve stored endpoint configuration', async () => {

    // given
    const storedTabConfiguration = {
      deployment: { name: 'foo' },
      endpointId: 'bar'
    };

    const storedEndpoints = [{ id: 'bar' }];

    const { instance } = createDeploymentPlugin({ storedTabConfiguration, storedEndpoints });

    // when
    const config = await instance.getSavedConfiguration();

    // then
    expect(config.endpoint).to.eql(storedEndpoints[0]);
  });


  it('should save tab configuration', async () => {

    // given
    const endpointId = 'bar';

    const configuration = {
      deployment: { test: 'true' },
      endpoint: {
        id: endpointId
      }
    };

    const setTabConfigSpy = sinon.spy();

    const { instance } = createDeploymentPlugin({ setTabConfigSpy });

    // when
    await instance.saveConfiguration(configuration);

    // then
    expect(setTabConfigSpy).to.have.been.calledWith(DEPLOYMENT_CONFIG_KEY, {
      deployment: configuration.deployment,
      endpointId
    });
  });


  it('should save endpoint', async () => {

    // given
    const endpoint = { id: 'bar' };

    const configuration = {
      deployment: { test: 'true' },
      endpoint
    };

    const setEndpointsSpy = sinon.spy();

    const { instance } = createDeploymentPlugin({ setEndpointsSpy });

    // when
    await instance.saveConfiguration(configuration);

    // then
    expect(setEndpointsSpy)
      .to.have.been.calledWith(ZEEBE_ENDPOINTS_CONFIG_KEY, [ endpoint ]);
  });


  it('should display notification on deployment success', async () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({
      deploymentSuccessful: true,
      displayNotificationSpy
    });

    instance.activeTab = NOOP_TAB;

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

    instance.activeTab = NOOP_TAB;

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

    instance.activeTab = NOOP_TAB;


    // when
    await instance.onDeploy({ deploymentName: 'testName' });

    // then
    expect(displayLogSpy).to.have.been.calledWith({
      category: 'deploy-error',
      message: 'details'
    });
  });


  it('should broadcast deploymentInitiated message when clicked on icon', async () => {

    // given
    const broadcastMessageSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({ broadcastMessageSpy });

    // when
    await instance.onIconClicked();

    // then
    expect(broadcastMessageSpy).to.have.been.calledWith('deploymentInitiated');
  });


  it('should show modal when forceDeploy message is received', () => {

    // given
    const { instance } = createDeploymentPlugin();

    // when
    instance.onMessageReceived('forceDeploy');

    // then
    expect(instance.state.modalVisible).to.be.true;
  });


  it('should be in isStart:true state when forceDeploy message is received', () => {

    // given
    const { instance } = createDeploymentPlugin();

    // when
    instance.onMessageReceived('forceDeploy');

    // then
    expect(instance.state.isStart).to.be.true;
  });


  it('should be in isStart:false state when deploy icon clicked', async () => {

    // given
    const { instance } = createDeploymentPlugin();

    // when
    await instance.onIconClicked();

    // then
    expect(instance.state.isStart).to.be.false;
  });


  it('should subscribe to messaging when mounted', () => {

    // given
    const subscribeToMessagingSpy = sinon.spy();
    createDeploymentPlugin({ subscribeToMessagingSpy });

    // then
    expect(subscribeToMessagingSpy).to.have.been.calledWith('deploymentPlugin');
  });


  it('should unsubscribe from messaging when unmounted', () => {

    // given
    const unsubscribeFromMessagingSpy = sinon.spy();
    const { wrapper } = createDeploymentPlugin({ unsubscribeFromMessagingSpy });

    // when
    wrapper.unmount();

    // then
    expect(unsubscribeFromMessagingSpy).to.have.been.calledWith('deploymentPlugin');
  });


  it('should have skipNotificationOnSuccess:true after receiving forceDeploy message', () => {

    // given
    const { instance } = createDeploymentPlugin();

    // when
    instance.onMessageReceived('forceDeploy');

    // then
    expect(instance.skipNotificationOnSuccess).to.be.true;
  });


  it('should have skipNotificationOnSuccess:false after clicking on icon', async () => {

    // given
    const { instance } = createDeploymentPlugin();
    instance.skipNotificationOnSuccess = true;

    // when
    await instance.onIconClicked();

    // then
    expect(instance.skipNotificationOnSuccess).to.be.false;
  });


  it('should not display notification if skipNotificationOnSuccess is true', () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createDeploymentPlugin();
    instance.skipNotificationOnSuccess = true;

    // when
    instance.onDeploymentSuccess({
      workflows: [ { bpmnProcessId: 'test' } ]
    });

    // then
    expect(displayNotificationSpy).to.not.have.been.called;
  });
});

const createDeploymentPlugin = (params = {}) => {
  const subscribe = (type, callback) => {
    if (type === 'app.activeTabChanged') {
      callback(params.emptyTab ? {
        activeTab: { type: 'empty', name: 'testName' }
      } : {
        activeTab: { type: 'nonEmpty', name: 'testName' }
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
              resolve({ success: true, response: { workflows: [ { bpmnProcessId: 'test' } ] } });
            }
          });
        }
      };
    }
  };
  const config = {
    get: (key) => {
      if (key === ZEEBE_ENDPOINTS_CONFIG_KEY) {
        return params.storedEndpoints || [];
      }
    },
    set: (key, value) => {
      if (key === ZEEBE_ENDPOINTS_CONFIG_KEY) {
        return params.setEndpointsSpy && params.setEndpointsSpy(key, value);
      }
    },
    getForFile: (file, key) => {
      if (key === DEPLOYMENT_CONFIG_KEY) {
        return params.storedTabConfiguration || null;
      }
    },
    setForFile: (file, key, value) => {
      return params.setTabConfigSpy && params.setTabConfigSpy(key, value);
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
      return NOOP_TAB;
    }
  };
  const broadcastMessage = (msg) => {
    if (params.broadcastMessageSpy) {
      params.broadcastMessageSpy(msg);
    }
  };
  const subscribeToMessaging = (key) => {
    if (params.subscribeToMessagingSpy) {
      params.subscribeToMessagingSpy(key);
    }
  };
  const unsubscribeFromMessaging = (key) => {
    if (params.unsubscribeFromMessagingSpy) {
      params.unsubscribeFromMessagingSpy(key);
    }
  };

  const wrapper = shallow(<DeploymentPlugin
    subscribe={ subscribe }
    _getGlobal={ _getGlobal }
    config={ config }
    displayNotification={ displayNotification }
    log={ log }
    triggerAction={ triggerAction }
    subscribeToMessaging={ subscribeToMessaging }
    unsubscribeFromMessaging={ unsubscribeFromMessaging }
    broadcastMessage={ broadcastMessage }
  />);

  const instance = wrapper.instance();

  return { wrapper, instance };
};
