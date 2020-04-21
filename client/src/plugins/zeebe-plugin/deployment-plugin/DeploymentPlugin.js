/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { PureComponent } from 'react';

import {
  omit
} from 'min-dash';

import { Fill } from '../../../app/slot-fill';

import {
  Button,
  Icon
} from '../../../app/primitives';

import {
  generateId
} from '../../../util';

import { AUTH_TYPES } from './../shared/ZeebeAuthTypes';

import { SELF_HOSTED } from '../shared/ZeebeTargetTypes';

import DeploymentPluginModal from './DeploymentPluginModal';

import DeploymentPluginValidator from './DeploymentPluginValidator';

import KeyboardInteractionTrap from './ui/KeyboardInteractionTrap';

const DEPLOYMENT_CONFIG_KEY = 'deployment-tool';
const ZEEBE_ENDPOINTS_CONFIG_KEY = 'zeebeEndpoints';

export default class DeploymentPlugin extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      hasActiveTab: false,
      isStart: false
    };
    this.validator = new DeploymentPluginValidator(props._getGlobal('zeebeAPI'));

  }

  onMessageReceived = (msg, body) => {
    if (msg === 'forceDeploy') {
      this.setState({ modalVisible: true, isStart: true });
      this.skipNotificationOnSuccess = true;
    }
    if (msg === 'deploymentFailure') {
      this.onDeploymentError(body);
    }
  }

  componentDidMount() {
    this.props.subscribeToMessaging('deploymentPlugin', this.onMessageReceived);

    this.props.subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.activeTab = activeTab;
      this.setState({
        hasActiveTab: activeTab && activeTab.type !== 'empty'
      });
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeFromMessaging('deploymentPlugin');
  }

  saveConfiguration = async configuration => {
    const {
      endpoint,
      deployment
    } = configuration;

    const endpointToSave = endpoint.rememberCredentials ? endpoint : withoutCredentials(endpoint);

    await this.saveEndpoint(endpointToSave);

    const tabConfiguration = {
      deployment,
      endpointId: endpointToSave.id
    };

    await this.setTabConfiguration(this.activeTab, tabConfiguration);

    return configuration;
  }

  async getConfiguration() {
    const savedConfiguration = await this.getSavedConfiguration();

    const deployment = {
      name: withoutExtension(this.activeTab.name)
    };

    const endpoint = {
      id: generateId(),
      targetType: SELF_HOSTED,
      authType: AUTH_TYPES.NONE,
      contactPoint: '0.0.0.0:26500',
      oauthURL: '',
      audience: '',
      clientId: '',
      clientSecret: '',
      camundaCloudClientId: '',
      camundaCloudClientSecret: '',
      camundaCloudClusterId: '',
      rememberCredentials: false
    };

    return {
      deployment: {
        ...deployment,
        ...savedConfiguration.deployment
      },
      endpoint: {
        ...endpoint,
        ...savedConfiguration.endpoint
      }
    };
  }

  getSavedConfiguration = async () => {

    const tabConfig = await this.getTabConfiguration(this.activeTab);

    if (!tabConfig) {
      return {};
    }

    const {
      deployment,
      endpointId
    } = tabConfig;

    const endpoints = await this.getEndpoints();

    return {
      deployment,
      endpoint: endpoints.find(endpoint => endpoint.id === endpointId)
    };
  }

  async saveEndpoint(endpoint) {
    const existingEndpoints = await this.getEndpoints();

    const updatedEndpoints = addOrUpdateById(existingEndpoints, endpoint);

    await this.setEndpoints(updatedEndpoints);

    return endpoint;
  }

  getEndpoints() {
    return this.props.config.get(ZEEBE_ENDPOINTS_CONFIG_KEY, []);
  }

  setEndpoints(endpoints) {
    return this.props.config.set(ZEEBE_ENDPOINTS_CONFIG_KEY, endpoints);
  }

  getTabConfiguration(tab) {
    return this.props.config.getForFile(tab.file, DEPLOYMENT_CONFIG_KEY);
  }

  setTabConfiguration(tab, configuration) {
    return this.props.config.setForFile(tab.file, DEPLOYMENT_CONFIG_KEY, configuration);
  }

  onDeploymentSuccess = (response) => {
    const {
      displayNotification,
      broadcastMessage
    } = this.props;

    if (!this.skipNotificationOnSuccess) {
      displayNotification({
        type: 'success',
        title: 'Deployment succeeded',
        duration: 4000
      });
    }

    broadcastMessage('deploymentSucceeded', response.workflows[0].bpmnProcessId);
  }

  onDeploymentError = (response) => {

    const {
      log,
      displayNotification
    } = this.props;

    displayNotification({
      type: 'error',
      title: 'Deployment failed',
      content: 'See the log for further details.',
      duration: 10000
    });

    log({
      category: 'deploy-error',
      message: response.details
    });
  }

  onDeploy = async (configuration) => {
    this.closeModal();

    await this.saveConfiguration(configuration);

    const {
      file: tabFile,
      name: tabName
    } = this.activeTab;

    const path = tabFile.path;

    const zeebeAPI = this.props._getGlobal('zeebeAPI');
    const deploymentResult = await zeebeAPI.deploy({
      filePath: path,
      name: configuration.deploymentName || withoutExtension(tabName)
    });

    const { response, success } = deploymentResult;

    if (!success) {
      this.onDeploymentError(response);
    } else {
      this.onDeploymentSuccess(response);
    }
  }

  closeModal = () => {
    this.setState({ modalState: null });
  }

  onIconClicked = async () => {
    const savedTab = await this.props.triggerAction('save', { tab: this.activeTab });

    // cancel action if save modal got canceled
    if (!savedTab) {
      return;
    }

    const modalState = {};
    modalState.configuration = await this.getConfiguration();

    this.setState({
      modalState,
      isStart: false
    });

    this.props.broadcastMessage('deploymentInitiated');

    this.skipNotificationOnSuccess = false;
  }

  render() {

    const {
      modalState,
      hasActiveTab,
      isStart
    } = this.state;

    return <React.Fragment>
      { hasActiveTab &&
        <Fill slot="toolbar" group="8_deploy" priority={ 1 }>
          <Button
            onClick={ this.onIconClicked }
            title="Deploy current diagram"
          >
            <Icon name="deploy" />
          </Button>
        </Fill>
      }
      { modalState && hasActiveTab &&
        <KeyboardInteractionTrap triggerAction={ this.props.triggerAction }>
          <DeploymentPluginModal
            onClose={ this.closeModal }
            validator={ this.validator }
            onDeploy={ this.onDeploy }
            isStart={ isStart }
            configuration={ modalState.configuration }
          />
        </KeyboardInteractionTrap>
      }
    </React.Fragment>;
  }
}

// helpers //////////

function withoutExtension(name) {
  return name.replace(/\.[^.]+$/, '');
}

function addOrUpdateById(collection, element) {

  const index = collection.findIndex(el => el.id === element.id);

  if (index !== -1) {
    return [
      ...collection.slice(0, index),
      element,
      ...collection.slice(index + 1)
    ];
  }

  return [
    ...collection,
    element
  ];
}


// helper
function withoutCredentials(endpointConfiguration) {
  return omit(endpointConfiguration, [
    'clientId',
    'clientSecret',
    'camundaCloudClientId',
    'camundaCloudClientSecret'
  ]);
}
