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

import { Fill } from '../../../app/slot-fill';

import PlayIcon from 'icons/Play.svg';

import { Button } from '../../../app/primitives';

import css from './StartInstancePlugin.less';

import ZeebeConnectionValidator from '../shared/ZeebeConnectionValidator';

const DEPLOYMENT_CONFIG_KEY = 'deployment-tool';
const ZEEBE_ENDPOINTS_CONFIG_KEY = 'zeebeEndpoints';

export default class StartInstancePlugin extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      hasActiveTab: false
    };

    this.zeebeConnectionValidator = new ZeebeConnectionValidator(props._getGlobal('zeebeAPI'));
  }

  componentDidMount() {
    this.props.subscribeToMessaging('startInstancePlugin', this.onMessageReceived);

    this.props.subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.activeTab = activeTab;
      this.setState({
        hasActiveTab: activeTab && activeTab.type !== 'empty'
      });
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeFromMessaging('startInstancePlugin');
  }

  onMessageReceived = (msg, body) => {
    if (msg === 'deploymentInitiated') {
      this.waitForDeployment = false;
    }
    if (msg === 'deploymentSucceeded' && this.waitForDeployment) {
      this.startProcessInstance(body);
      this.waitForDeployment = false;
    }
  }

  startProcessInstance = async (processId) => {
    const zeebeAPI = this.props._getGlobal('zeebeAPI');

    zeebeAPI.run({ processId });

    this.props.displayNotification({
      type: 'success',
      title: 'Process instance deployed and started successfully',
      duration: 10000
    });
  }

  async getSavedDeploymentConfig() {
    const tabConfig = await this.props.config.getForFile(this.activeTab.file, DEPLOYMENT_CONFIG_KEY);

    if (!tabConfig) {
      return {};
    }

    const {
      deployment,
      endpointId
    } = tabConfig;

    const endpoints = await this.props.config.get(ZEEBE_ENDPOINTS_CONFIG_KEY, []);

    return {
      deployment,
      endpoint: endpoints.find(endpoint => endpoint.id === endpointId)
    };
  }

  onIconClicked = async () => {
    const savedTab = await this.props.triggerAction('save', { tab: this.activeTab });

    // cancel action if save modal got canceled
    if (!savedTab) {
      return;
    }

    const {
      file: tabFile,
      name: tabName
    } = savedTab;

    const path = tabFile.path;

    const deploymentConfig = await this.getSavedDeploymentConfig();

    const {
      endpoint
    } = deploymentConfig;

    if (!endpoint) {
      return this.deployFirst();
    }

    const zeebeAPI = this.props._getGlobal('zeebeAPI');

    const connectionResult = await this.zeebeConnectionValidator.validateConnection(endpoint);

    if (!connectionResult.isSuccessful) {
      return this.deployFirst();
    }

    const deploymentResult = await zeebeAPI.deploy({
      filePath: path,
      name: deploymentConfig.deployment.name || withoutExtension(tabName)
    });

    if (!deploymentResult.success) {
      this.props.broadcastMessage('deploymentFailure', deploymentResult.response);
    } else {
      this.startProcessInstance(deploymentResult.response.workflows[0].bpmnProcessId);
    }
  }

  deployFirst = () => {
    this.waitForDeployment = true;
    this.props.broadcastMessage('forceDeploy');
  }

  render() {

    const {
      hasActiveTab
    } = this.state;

    return <React.Fragment>
      {
        hasActiveTab &&
        <Fill slot="toolbar" group="8_deploy" priority={ 0 }>
          <Button
            onClick={ this.onIconClicked }
            title="Start Current Diagram"
            className={ css.StartInstancePlugin }
          >
            <PlayIcon className="icon" />
          </Button>
        </Fill>
      }
    </React.Fragment>;
  }
}

// helpers //////////

function withoutExtension(name) {
  return name.replace(/\.[^.]+$/, '');
}
