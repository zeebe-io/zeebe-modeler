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

import { mount } from 'enzyme';

import DeploymentPluginModal from '../DeploymentPluginModal';

describe('<DeploymentPluginModal>', () => {

  it('should render', () => {
    createDeploymentPluginModal();
  });


  it('should get stored config on start', async () => {

    // given
    const storedConfig = { oauthClientId: 'test' };
    const { instance } = createDeploymentPluginModal({ storedConfig });
    const expected = {
      ...instance.defaultValues,
      ...storedConfig
    };

    // when
    await instance.componentDidMount();

    // then
    expect(instance.initialValues).to.eql(expected);
  });


  it('should not check connection if values are not changed', async () => {

    // given
    const validateConnectionSpy = sinon.spy();
    const { instance } = createDeploymentPluginModal({ validateConnectionSpy });

    instance.lastCheckedFormValues = JSON.stringify(instance.formValues);
    instance.renderWaitingState = false;

    // when
    await instance.checkConnection(instance.formValues);

    // then
    expect(validateConnectionSpy).to.not.have.been.called;
  });


  it('should not check connection if in isValidating state', async () => {

    // given
    const validateConnectionSpy = sinon.spy();
    const { instance } = createDeploymentPluginModal({ validateConnectionSpy });

    instance.setState({ isValidating: true });

    // when
    await instance.checkConnection(instance.formValues);

    // then
    expect(validateConnectionSpy).to.not.have.been.called;
  });


  it('should check connection initially', (done) => {

    // given
    const validateConnectionSpy = sinon.spy();
    createDeploymentPluginModal({ validateConnectionSpy });

    // then
    setTimeout(() => {
      expect(validateConnectionSpy).to.have.been.called;
      done();
    }, 500);
  });


  it('should not be able to deploy when in isValidating state', async () => {

    // given
    const { wrapper, instance } = createDeploymentPluginModal();

    // when
    await instance.componentDidMount();
    instance.setState({ isDeploying: false, isValidating: true });
    wrapper.update();

    // then
    expect(wrapper.find('.btn-primary').props().disabled).to.be.true;
  });


  it('should not be able to deploy when in isDeploying state', async () => {

    // given
    const { wrapper, instance } = createDeploymentPluginModal();

    // when
    await instance.componentDidMount();
    instance.setState({ isValidating: false, validationSuccessful: true, isDeploying: true });
    wrapper.update();

    // then
    expect(wrapper.find('.btn-primary').props().disabled).to.be.true;
  });


  it('should not be able to deploy when in validationSuccessful:false state', async () => {

    // given
    const { wrapper, instance } = createDeploymentPluginModal();

    // when
    await instance.componentDidMount();
    instance.setState({ isValidating: false, validationSuccessful: false, isDeploying: false });
    wrapper.update();

    // then
    expect(wrapper.find('.btn-primary').props().disabled).to.be.true;
  });


  it('should deploy', async () => {

    // given
    const onDeploySpy = sinon.spy();
    const { wrapper, instance } = createDeploymentPluginModal({ onDeploySpy });
    instance.lastCheckedFormValues = JSON.stringify({});

    // when
    await instance.componentDidMount();
    instance.setState({ isValidating: false, validationSuccessful: true, isDeploying: false });
    wrapper.update();
    wrapper.find('form').simulate('submit');

    // then
    expect(onDeploySpy).to.have.been.called;
  });


  it('should save configurations on deploy', async () => {

    // given
    const setConfigSpy = sinon.spy();
    const { wrapper, instance } = createDeploymentPluginModal({ setConfigSpy });
    const config = { test: true };
    instance.lastCheckedFormValues = JSON.stringify(config);

    // when
    await instance.componentDidMount();
    instance.setState({ isValidating: false, validationSuccessful: true, isDeploying: false });
    wrapper.update();
    wrapper.find('form').simulate('submit');

    // then
    expect(setConfigSpy).to.have.been.calledWith({
      ...config,
      rememberCredentials: false
    });
  });


  it('should not save configurations on cancel', async () => {

    // given
    const setConfigSpy = sinon.spy();
    const { wrapper, instance } = createDeploymentPluginModal({ setConfigSpy });

    // when
    await instance.componentDidMount();
    wrapper.find('.btn-secondary').simulate('click');

    // then
    expect(setConfigSpy).to.not.have.been.called;
  });

  it('should close when pressed on secondary button', async () => {

    // given
    const onCloseSpy = sinon.spy();
    const { wrapper, instance } = createDeploymentPluginModal({ onCloseSpy });

    // when
    await instance.componentDidMount();
    wrapper.find('.btn-secondary').simulate('click');

    // then
    expect(onCloseSpy).to.have.been.called;
  });


  it('should not save credentials if checkbox is unchecked', async () => {

    // given
    const setConfigSpy = sinon.spy();
    const { instance } = createDeploymentPluginModal({ setConfigSpy });
    const confs = {
      testProp: 'test',
      oauthClientId: 'test',
      oauthClientSecret: 'test',
      camundaCloudClientId: 'test',
      camundaCloudClientSecret: 'test',
      rememberCredentials: false
    };

    // when
    instance.saveConfig(confs);

    // then
    expect(setConfigSpy).to.have.been.calledWith({
      testProp: 'test',
      rememberCredentials: false
    });
  });


  it('should save credentials if checkbox is unchecked', async () => {

    // given
    const setConfigSpy = sinon.spy();
    const { instance } = createDeploymentPluginModal({ setConfigSpy });
    const confs = {
      testProp: 'test',
      oauthClientId: 'test',
      oauthClientSecret: 'test',
      camundaCloudClientId: 'test',
      camundaCloudClientSecret: 'test',
      rememberCredentials: true
    };

    // when
    instance.saveConfig(confs);

    // then
    expect(setConfigSpy).to.have.been.calledWith(confs);
  });
});


const createDeploymentPluginModal = (params = {}) => {
  const getConfig = () => {
    return params.storedConfig || {};
  };
  const validator = {
    validateConnection: () => {
      if (params.validateConnectionSpy) {
        params.validateConnectionSpy();
      }
    }
  };
  const onDeploy = () => {
    if (params.onDeploySpy) {
      params.onDeploySpy();
    }
  };
  const onClose = () => {
    if (params.onCloseSpy) {
      params.onCloseSpy();
    }
  };
  const setConfig = (config) => {
    if (params.setConfigSpy) {
      params.setConfigSpy(config);
    }
  };

  const wrapper = mount(<DeploymentPluginModal
    getConfig={ getConfig }
    validator={ validator }
    onDeploy={ onDeploy }
    setConfig={ setConfig }
    onClose={ onClose }
  />);

  const instance = wrapper.instance();

  return { wrapper, instance };
};
