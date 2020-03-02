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

import StartInstancePlugin from '../StartInstancePlugin';

const DEPLOYMENT_CONFIG_KEY = 'DEPLOYMENT_CONFIG';

describe('<StartInstancePlugin>', () => {

  it('should render', () => {
    createStartInstancePlugin();
  });


  it('should subscribe to messaging when mounted', () => {

    // given
    const subscribeToMessagingSpy = sinon.spy();
    createStartInstancePlugin({ subscribeToMessagingSpy });

    // then
    expect(subscribeToMessagingSpy).to.have.been.calledWith('startInstancePlugin');
  });


  it('should unsubscribe from messaging when unmounted', () => {

    // given
    const unsubscribeFromMessagingSpy = sinon.spy();
    const { wrapper } = createStartInstancePlugin({ unsubscribeFromMessagingSpy });

    // when
    wrapper.unmount();

    // then
    expect(unsubscribeFromMessagingSpy).to.have.been.calledWith('startInstancePlugin');
  });


  it('should not wait for deployment after receiving deploymentInitiated message', () => {

    // given
    const { instance } = createStartInstancePlugin();
    instance.waitForDeployment = true;

    // when
    instance.onMessageReceived('deploymentInitiated');

    // then
    expect(instance.waitForDeployment).to.be.false;
  });


  it('should not start process instance after receiving deploymentSucceeded if not waiting for deployment', () => {

    // given
    const { instance } = createStartInstancePlugin();
    const startProcessInstanceSpy = sinon.spy();
    instance.startProcessInstance = startProcessInstanceSpy;
    instance.waitForDeployment = false;

    // when
    instance.onMessageReceived('deploymentSucceeded');

    // then
    expect(startProcessInstanceSpy).to.not.have.been.called;
  });


  it('should start process instance after receiving deploymentSucceeded if waiting for deployment', () => {

    // given
    const { instance } = createStartInstancePlugin();
    const startProcessInstanceSpy = sinon.spy();
    instance.startProcessInstance = startProcessInstanceSpy;
    instance.waitForDeployment = true;

    // when
    instance.onMessageReceived('deploymentSucceeded');

    // then
    expect(startProcessInstanceSpy).to.have.been.called;
  });


  it('should invoke zeebe API with the process id', () => {

    // given
    const processId = 'testProcessId';
    const runSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({ runSpy });

    // when
    instance.startProcessInstance(processId);

    // then
    expect(runSpy).to.have.been.calledWith({ processId });
  });


  it('should display notification after starting process instance', () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({ displayNotificationSpy });

    // when
    instance.startProcessInstance();

    // then
    expect(displayNotificationSpy).to.have.been.calledWith({
      type: 'success',
      title: 'Process instance deployed and started successfully',
      duration: 10000
    });
  });


  it('should be in hasActiveTab:false state when there is no active tab', () => {

    // given
    const { wrapper } = createStartInstancePlugin({ hasActiveTab: false });

    // then
    expect(wrapper.state('hasActiveTab')).to.be.false;
  });


  it('should be in hasActiveTab:true state when there is active tab', () => {

    // given
    const { wrapper } = createStartInstancePlugin({ hasActiveTab: true });

    // then
    expect(wrapper.state('hasActiveTab')).to.be.true;
  });


  it('should save when icon clicked', () => {

    // given
    const triggerActionSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({ triggerActionSpy });

    // when
    instance.onIconClicked();

    // then
    expect(triggerActionSpy).to.have.been.calledWith('save');
  });


  it('should get config when icon clicked', async () => {

    // given
    const getConfigSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({ getConfigSpy });

    // when
    await instance.onIconClicked();

    // then
    expect(getConfigSpy).to.have.been.calledWith(DEPLOYMENT_CONFIG_KEY);
  });


  it('should open deployment dialog first if deployment configuration non existent', async () => {

    // given
    const deployFirstSpy = sinon.spy();
    const connectionValidated = true;
    const { instance } = createStartInstancePlugin({ connectionValidated });
    instance.deployFirst = deployFirstSpy;

    // when
    await instance.onIconClicked();

    // then
    expect(deployFirstSpy).to.have.been.called;
  });


  it('should skip deployment dialog if deployment configuration existent', async () => {

    // given
    const getConfigResult = { test: true };
    const connectionValidated = true;
    const deployFirstSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({ getConfigResult, connectionValidated });
    instance.deployFirst = deployFirstSpy;

    // when
    await instance.onIconClicked();

    // then
    expect(deployFirstSpy).to.not.have.been.called;
  });


  it('should deploy before starting', async () => {

    // given
    const deploySpy = sinon.spy();
    const getConfigResult = { test: true };
    const connectionValidated = true;
    const { instance } = createStartInstancePlugin({ getConfigResult, connectionValidated, deploySpy });

    // when
    await instance.onIconClicked();

    // then
    expect(deploySpy).to.have.been.called;
  });


  it('should open deployment dialog if connection not validated', async () => {

    // given
    const getConfigResult = { test: true };
    const connectionValidated = false;
    const deployFirstSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({ getConfigResult, connectionValidated });
    instance.deployFirst = deployFirstSpy;

    // when
    await instance.onIconClicked();

    // then
    expect(deployFirstSpy).to.have.been.called;
  });


  it('should emit deploymentFailure message if deployment fails', async () => {

    // given
    const getConfigResult = { test: true };
    const connectionValidated = true;
    const deploymentSuccessful = false;
    const broadcastMessageSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({
      getConfigResult,
      connectionValidated,
      deploymentSuccessful,
      broadcastMessageSpy
    });

    // when
    await instance.onIconClicked();

    // then
    expect(broadcastMessageSpy).to.have.been.calledWith('deploymentFailure');
  });


  it('should start process instance if every check is ok', async () => {

    // given
    const getConfigResult = { test: true };
    const connectionValidated = true;
    const deploymentSuccessful = true;
    const startProcessInstanceSpy = sinon.spy();
    const { instance } = createStartInstancePlugin({
      getConfigResult,
      connectionValidated,
      deploymentSuccessful
    });
    instance.startProcessInstance = startProcessInstanceSpy;

    // when
    await instance.onIconClicked();

    // then
    expect(startProcessInstanceSpy).to.have.been.called;
  });
});

const createStartInstancePlugin = (params = {}) => {
  const subscribe = (key, callback) => {
    if (key === 'app.activeTabChanged') {
      if (params.hasActiveTab) {
        callback({
          activeTab: {
            name: 'test',
            type: 'nonEmpty'
          }
        });
      } else {
        callback({
          activeTab: {
            name: 'test',
            type: 'empty'
          }
        });
      }
    }
  };
  const _getGlobal = (key) => {
    if (key === 'zeebeAPI') {
      return {
        run: (processId) => {
          if (params.runSpy) {
            params.runSpy(processId);
          }
        },
        deploy: () => {
          if (params.deploySpy) {
            params.deploySpy();
          }
          if (params.deploymentSuccessful) {
            return {
              success: true,
              response: {
                workflows: [
                  { bpmnProcessId: 'testID' }
                ]
              }
            };
          }
          return {
            success: false,
            response: 'testResponse'
          };
        }
      };
    }
  };
  const config = {
    get: (key) => {
      if (params.getConfigSpy) {
        params.getConfigSpy(key);
      }
      if (params.getConfigResult) {
        return params.getConfigResult;
      }
      return;
    },
    set: () => {

    }
  };
  const displayNotification = (notificationParams) => {
    if (params.displayNotificationSpy) {
      params.displayNotificationSpy(notificationParams);
    }
  };
  const log = () => {};
  const triggerAction = (key) => {
    if (params.triggerActionSpy) {
      params.triggerActionSpy(key);
    }
    if (key === 'save') {
      return {
        file: {
          path: 'testPath'
        }
      };
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
  const broadcastMessage = (key) => {
    if (params.broadcastMessageSpy) {
      params.broadcastMessageSpy(key);
    }
  };
  const wrapper = shallow(<StartInstancePlugin
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

  instance.zeebeConnectionValidator = {
    validateConnection: () => {
      return {
        isSuccessful: params.connectionValidated
      };
    }
  };

  return { wrapper, instance };
};
