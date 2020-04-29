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

import { Config } from '../../../../app/__tests__/mocks';

import DeploymentPlugin from '../DeploymentPlugin';

const DEPLOYMENT_CONFIG_KEY = 'deployment-tool';
const ZEEBE_ENDPOINTS_CONFIG_KEY = 'zeebeEndpoints';


describe('<DeploymentPlugin>', () => {

  it('should render', () => {
    createDeploymentPlugin();
  });


  it('should deploy', async () => {

    // given
    const deploySpy = sinon.spy();
    const zeebeAPI = new MockZeebeAPI({ deploySpy });
    const { instance } = createDeploymentPlugin({ zeebeAPI });

    // when
    await instance.deploy();

    // then
    expect(deploySpy).to.have.been.calledOnce;
  });


  it('should save tab before deploy', async () => {

    // given
    const config = { set: sinon.spy() };
    const { instance } = createDeploymentPlugin({ config });

    // when
    await instance.deploy();

    // then
    expect(config.set).to.have.been.called;
  });


  describe('ui', () => {

    it('should display button if there is active tab', () => {

      // given
      const { wrapper } = createDeploymentPlugin();

      // then
      expect(wrapper.find('Button')).to.have.lengthOf(1);
    });


    it('should NOT display button if there is no active tab', () => {

      // given
      const { wrapper } = createDeploymentPlugin({ activeTab: false });

      // then
      expect(wrapper.find('Button')).to.have.lengthOf(0);
    });
  });


  it('should use stored endpoint configuration', async () => {

    // given
    const deploySpy = sinon.spy();
    const zeebeAPI = new MockZeebeAPI({ deploySpy });
    const storedTabConfiguration = {
      deployment: { name: 'foo' },
      endpointId: 'bar'
    };
    const storedEndpoints = [{ id: storedTabConfiguration.endpointId }];

    const config = {
      get(key, defaultValue) {
        return key === ZEEBE_ENDPOINTS_CONFIG_KEY ? storedEndpoints : defaultValue;
      },
      getForFile(_, key) {
        return key === DEPLOYMENT_CONFIG_KEY && storedTabConfiguration;
      }
    };

    const { instance } = createDeploymentPlugin({ zeebeAPI, config });

    // when
    await instance.deploy();

    // then
    expect(deploySpy).to.have.been.calledOnce;
    expect(deploySpy.args[0][0].endpoint).to.have.property('id', storedEndpoints[0].id);
  });


  it('should save tab configuration', async () => {

    // given
    const setConfigSpy = sinon.spy();
    const activeTab = createTab();

    const { instance } = createDeploymentPlugin({ activeTab, config: { setForFile: setConfigSpy } });

    // when
    await instance.deploy();

    // then
    expect(setConfigSpy).to.have.been.calledOnce;
    expect(setConfigSpy.args[0][0]).to.eql(activeTab.file);
  });


  it('should save endpoint', async () => {

    // given
    const setEndpointsSpy = sinon.spy();
    const storedTabConfiguration = {
      deployment: { name: 'foo' },
      endpointId: 'bar'
    };
    const storedEndpoints = [{ id: storedTabConfiguration.endpointId }];

    const config = {
      set: setEndpointsSpy,
      get(key, defaultValue) {
        return key === ZEEBE_ENDPOINTS_CONFIG_KEY ? storedEndpoints : defaultValue;
      },
      getForFile(_, key) {
        return key === DEPLOYMENT_CONFIG_KEY && storedTabConfiguration;
      }
    };

    const { instance } = createDeploymentPlugin({ config });

    // when
    await instance.deploy();

    // then
    expect(setEndpointsSpy).to.have.been.calledOnce;
    expect(setEndpointsSpy.args[0][1][0]).to.have.property('id', storedTabConfiguration.endpointId);
  });


  it('should display notification on deployment success', async () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({
      displayNotification: displayNotificationSpy
    });

    // when
    await instance.deploy();

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
    const zeebeAPI = new MockZeebeAPI({ deploymentResult: { success: false, response: {} } });
    const { instance } = createDeploymentPlugin({
      displayNotification: displayNotificationSpy,
      zeebeAPI
    });

    // when
    await instance.deploy();

    // then
    expect(displayNotificationSpy).to.have.been.calledWith({
      type: 'error',
      title: 'Deployment failed',
      content: 'See the log for further details.',
      duration: 10000
    });
  });


  it('should allow to deploy via message', done => {

    // given
    const subscribeToMessaging = (_, callback) => {
      callback('deploy', { done: doneCallback });
    };

    // when
    createDeploymentPlugin({ subscribeToMessaging });

    // then
    function doneCallback() {
      done();
    }
  });


  it('should pass deploymentResult=null if tab was not saved', done => {

    // given
    const subscribeToMessaging = (_, callback) => {
      callback('deploy', { done: doneCallback });
    };

    // when
    createDeploymentPlugin({ subscribeToMessaging, triggerAction: noop });

    // then
    function doneCallback(result) {
      let error;

      try {
        expect(result).to.eql({
          deploymentResult: null
        });
      } catch (err) {
        error = err;
      } finally {
        done(error);
      }
    }
  });


  it('should pass deploymentResult=null if config was not provided', done => {

    // given
    const subscribeToMessaging = (_, callback) => {
      callback('deploy', { done: doneCallback });
    };

    // when
    createDeploymentPlugin({ subscribeToMessaging, userAction: 'cancel' });

    // then
    function doneCallback(result) {
      let error;

      try {
        expect(result).to.eql({
          deploymentResult: null
        });
      } catch (err) {
        error = err;
      } finally {
        done(error);
      }
    }
  });


  it('should pass both the deployment result and endpoint config', done => {

    // given
    const deploySpy = sinon.spy();
    const deploymentResult = { success: true, response: {} };
    const zeebeAPI = new MockZeebeAPI({ deploySpy, deploymentResult });
    const subscribeToMessaging = (_, callback) => {
      callback('deploy', { done: doneCallback });
    };

    // when
    createDeploymentPlugin({ subscribeToMessaging, zeebeAPI });

    // then
    function doneCallback(result) {
      let error;

      try {
        expect(result).to.eql({
          deploymentResult,
          endpoint: deploySpy.args[0][0].endpoint
        });
      } catch (err) {
        error = err;
      } finally {
        done(error);
      }
    }
  });


  it('should subscribe to messaging when mounted', () => {

    // given
    const subscribeToMessaging = sinon.spy();
    createDeploymentPlugin({ subscribeToMessaging });

    // then
    expect(subscribeToMessaging).to.have.been.calledWith('deploymentPlugin');
  });


  it('should unsubscribe from messaging when unmounted', () => {

    // given
    const unsubscribeFromMessaging = sinon.spy();
    const { wrapper } = createDeploymentPlugin({ unsubscribeFromMessaging });

    // when
    wrapper.unmount();

    // then
    expect(unsubscribeFromMessaging).to.have.been.calledWith('deploymentPlugin');
  });


  it('should not display notification if skipNotificationOnSuccess is true', async () => {

    // given
    const displayNotificationSpy = sinon.spy();
    const { instance } = createDeploymentPlugin({
      displayNotification: displayNotificationSpy
    });

    // when
    await instance.deploy({ skipNotificationOnSuccess: true });

    // then
    expect(displayNotificationSpy).not.to.have.been.called;
  });
});

class TestDeploymentPlugin extends DeploymentPlugin {

  /**
   * @param {object} props
   * @param {'cancel'|'deploy'} [props.userAction='deploy'] user action in configuration modal
   * @param {object} [props.endpoint] overrides for endpoint configuration
   * @param {object} [props.deployment] overrides for deployment configuration
   */
  constructor(props) {
    super(props);
  }

  // closes automatically when modal is opened
  componentDidUpdate(...args) {
    super.componentDidUpdate && super.componentDidUpdate(...args);

    const { modalState } = this.state;
    const {
      userAction,
      endpoint,
      deployment
    } = this.props;

    if (modalState) {
      const action = userAction || 'deploy';

      const config = action !== 'cancel' && {
        endpoint: {
          ...modalState.config.endpoint,
          ...endpoint
        },
        deployment: {
          ...modalState.config.deployment,
          ...deployment
        }
      };

      modalState.onClose(config);
    }
  }
}


function createDeploymentPlugin({
  zeebeAPI = new MockZeebeAPI(),
  activeTab = createTab(),
  ...props
} = {}) {
  const subscribe = (type, callback) => {
    if (type === 'app.activeTabChanged') {
      callback({
        activeTab: activeTab || { type: 'empty', name: 'testName' }
      });
    }
  };

  const config = new Config({
    get: (_, defaultValue) => defaultValue,
    ...props.config
  });

  const wrapper = shallow(<TestDeploymentPlugin
    broadcastMessage={ noop }
    subscribeToMessaging={ noop }
    unsubscribeFromMessaging={ noop }
    triggerAction={ action => action === 'save' && activeTab }
    log={ noop }
    displayNotification={ noop }
    _getGlobal={ key => key === 'zeebeAPI' && zeebeAPI }
    subscribe={ subscribe }
    { ...props }
    config={ config }
  />);

  const instance = wrapper.instance();

  return { wrapper, instance };
}

function noop() {
  return null;
}

function MockZeebeAPI({ deploySpy, deploymentResult } = {}) {
  this.deploy = (...args) => {
    if (deploySpy) {
      deploySpy(...args);
    }

    const result = deploymentResult ||
      { success: true, response: { workflows: [ { bpmnProcessId: 'test' } ] } };

    return Promise.resolve(result);
  };
}

function createTab(overrides = {}) {
  return {
    id: 42,
    name: 'foo.bar',
    type: 'bar',
    title: 'unsaved',
    file: {
      name: 'foo.bar',
      contents: '',
      path: null
    },
    ...overrides
  };
}
