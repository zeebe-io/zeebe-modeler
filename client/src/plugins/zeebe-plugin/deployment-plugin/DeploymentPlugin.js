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

import pDefer from 'p-defer';

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
      activeTab: null,
      modalState: null
    };
    this.validator = new DeploymentPluginValidator(props._getGlobal('zeebeAPI'));
    this.connectionChecker = this.validator.createConnectionChecker();
  }

  componentDidMount() {
    this.props.subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.setState({
        activeTab
      });
    });

    this.props.subscribeToMessaging('deploymentPlugin', this.onMessageReceived);
  }

  componentWillUnmount() {
    this.props.unsubscribeFromMessaging('deploymentPlugin');
  }

  async deploy(options = {}) {
    return this.deployTab(this.state.activeTab, options);
  }

  async deployTab(tab, options) {

    /**
     * Notify interested parties via optional callback.
     *
     * @param {object} result
     * @param {object|null} result.deploymentResult - null for cancellation
     * @param {object} [result.endpoint]
     */
    function notifyResult(result) {
      const { done } = options;

      return done && done(result);
    }

    // (1) save tab
    const savedTab = await this.saveTab(tab);

    // cancel action if save was cancelled
    if (!savedTab) {
      notifyResult({ deploymentResult: null });

      return;
    }

    // (2) retrieve save config
    let config = await this.getSavedConfig(tab);

    // (2.1) open modal if config is incomplete
    const canDeploy = await this.canDeployWithConfig(config, options);

    if (!canDeploy) {
      config = await this.getConfigFromUser(config, savedTab, options);

      // user canceled
      if (!config) {
        notifyResult({ deploymentResult: null });

        return;
      }
    }

    // (3) save config
    await this.saveConfig(savedTab, config);

    // (4) deploy
    const deploymentResult = await this.deployWithConfig(savedTab, config);

    // (5) notify interested parties
    notifyResult({ deploymentResult, endpoint: config.endpoint });

    const { response, success } = deploymentResult;

    if (!success) {
      this.onDeploymentError(response);
    } else {
      this.onDeploymentSuccess(response, options);
    }
  }

  deployWithConfig(tab, config) {
    const { file: { path } } = tab;
    const {
      deployment: { name },
      endpoint
    } = config;

    const zeebeAPI = this.props._getGlobal('zeebeAPI');

    return zeebeAPI.deploy({
      filePath: path,
      name,
      endpoint
    });
  }

  saveTab(tab) {
    return this.props.triggerAction('save', { tab });
  }

  async canDeployWithConfig(config, options) {

    // always open modal for deployment tool
    if (!options.isStart) {
      return false;
    }

    // return early for missing essential parts
    if (!config.deployment && !config.endpoint) {
      return false;
    }

    const validationResult = this.validator.validateConfig(config);
    const isConfigValid = Object.keys(validationResult).length === 0;

    if (!isConfigValid) {
      return false;
    }

    const { connectionResult } = await this.connectionChecker.check(config.endpoint);

    return connectionResult && connectionResult.success;
  }

  async getConfigFromUser(savedConfig, tab, options = {}) {

    const p = pDefer();

    const onClose = config => {
      this.closeModal();

      return p.resolve(config);
    };

    const modalState = {
      config: this.getDefaultConfig(savedConfig, tab),
      isStart: !!options.isStart,
      onClose
    };

    // open modal
    this.setState({
      modalState
    });

    return p.promise;
  }

  onMessageReceived = (msg, body) => {
    if (msg === 'deploy') {
      this.deploy(body);
    }
  }

  async saveConfig(tab, config) {
    const {
      endpoint,
      deployment
    } = config;

    const endpointToSave = endpoint.rememberCredentials ? endpoint : withoutCredentials(endpoint);

    await this.saveEndpoint(endpointToSave);

    const tabConfiguration = {
      deployment,
      endpointId: endpointToSave.id
    };

    await this.setTabConfiguration(tab, tabConfiguration);

    return config;
  }

  async getSavedConfig(tab) {

    const tabConfig = await this.getTabConfiguration(tab);

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

  getDefaultConfig(savedConfig, tab) {
    const deployment = {
      name: withoutExtension(tab.name)
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
        ...savedConfig.deployment
      },
      endpoint: {
        ...endpoint,
        ...savedConfig.endpoint
      }
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

  onDeploymentSuccess(response, options = {}) {
    const {
      displayNotification
    } = this.props;

    if (!options.skipNotificationOnSuccess) {
      displayNotification({
        type: 'success',
        title: 'Deployment succeeded',
        duration: 4000
      });
    }
  }

  onDeploymentError(response) {
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

  closeModal() {
    this.setState({ modalState: null });
  }

  onIconClicked = async () => {
    this.deploy();
  }

  render() {
    const {
      modalState,
      activeTab
    } = this.state;

    const hasActiveTab = activeTab && activeTab.type !== 'empty';

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
            onClose={ modalState.onClose }
            validator={ this.validator }
            onDeploy={ modalState.onClose }
            isStart={ modalState.isStart }
            config={ modalState.config }
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
