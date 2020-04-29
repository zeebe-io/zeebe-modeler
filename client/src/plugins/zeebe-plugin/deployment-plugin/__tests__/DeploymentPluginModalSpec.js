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


  it('should check connection initially', (done) => {

    // given
    const spy = sinon.spy();
    const validator = {
      createConnectionChecker: () => createConnectionChecker({ check: spy })
    };
    createDeploymentPluginModal({ validator });

    // then
    setTimeout(() => {
      expect(spy).to.have.been.called;
      done();
    }, 500);
  });


  it('should deploy', done => {

    // given
    const { wrapper } = createDeploymentPluginModal({ onDeploy });

    // when
    const form = wrapper.find('form');
    form.simulate('submit');

    // then
    function onDeploy() {
      done();
    }
  });


  it('should close when pressed on secondary button', async () => {

    // given
    const onClose = sinon.spy();
    const { wrapper, instance } = createDeploymentPluginModal({ onClose });

    // when
    await instance.componentDidMount();
    wrapper.find('.btn-secondary').simulate('click');

    // then
    expect(onClose).to.have.been.called;
  });
});


const createDeploymentPluginModal = ({ ...props } = {}) => {

  const config = createConfig(props.config);
  const validator = new Validator(props.validator);

  const wrapper = mount(<DeploymentPluginModal
    validator={ validator }
    onDeploy={ noop }
    onClose={ noop }
    { ...props }
    config={ config }
  />);

  const instance = wrapper.instance();

  return { wrapper, instance };
};

function Validator({ ...overrides } = {}) {
  this.createConnectionChecker = createConnectionChecker;

  Object.assign(this, overrides);
}

function createConfig({ endpoint = {}, deployment = {} } = {}) {
  return {
    deployment: {
      name: 'name',
      ...deployment
    },
    endpoint: {
      targetType: 'selfHosted',
      authType: 'none',
      contactPoint: 'https://google.com',
      ...endpoint
    }
  };
}

function noop() {}

function createConnectionChecker({ ...overrides } = {}) {
  return {
    subscribe: noop,
    check() {
      return { connectionResult: { success: true } };
    },
    ...overrides
  };
}
