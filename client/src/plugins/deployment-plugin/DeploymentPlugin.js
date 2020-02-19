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

import { Fill } from '../../app/slot-fill';

import {
  Button,
  Icon
} from '../../app/primitives';

import DeploymentPluginModal from './DeploymentPluginModal';

import DeploymentPluginValidator from './DeploymentPluginValidator';

import KeyboardInteractionTrap from './ui/KeyboardInteractionTrap';

const DEPLOYMENT_CONFIG_KEY = 'DEPLOYMENT_CONFIG';

export default class DeploymentPlugin extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      hasActiveTab: false
    };
    this.validator = new DeploymentPluginValidator(props._getGlobal('zeebeAPI'));
  }

  componentDidMount() {
    this.props.subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.activeTab = activeTab;
      this.setState({
        hasActiveTab: activeTab && activeTab.type !== 'empty'
      });
    });
  }

  getConfig = async () => {
    const storedConfig = await this.props.config.get(DEPLOYMENT_CONFIG_KEY);
    return storedConfig || {};
  }

  setConfig = (config) => {
    this.props.config.set(DEPLOYMENT_CONFIG_KEY, config);
  }

  onDeploymentSuccess = () => {
    const {
      displayNotification
    } = this.props;

    displayNotification({
      type: 'success',
      title: 'Deployment succeeded',
      duration: 4000
    });
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

  onDeploy = async (parameters) => {

    this.closeModal();

    const saveResult = await this.props.triggerAction('save', { tab: this.activeTab });
    const path = saveResult.file.path;

    const zeebeAPI = this.props._getGlobal('zeebeAPI');
    const deploymentResult = await zeebeAPI.deploy({
      filePath: path,
      name: parameters.deploymentName || withoutExtension(this.activeTab.name)
    });

    if (!deploymentResult.success) {
      this.onDeploymentError(deploymentResult.response);
    } else {
      this.onDeploymentSuccess();
    }
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  onIconClicked = () => {
    const {
      modalVisible
    } = this.state;

    this.setState({ modalVisible: !modalVisible });
  }

  render() {

    const {
      modalVisible,
      hasActiveTab
    } = this.state;

    return <React.Fragment>
      { hasActiveTab &&
        <Fill slot="toolbar" group="8_deploy">
          <Button
            onClick={ this.onIconClicked }
            title="Deploy current diagram"
          >
            <Icon name="deploy" />
          </Button>
        </Fill>
      }
      { modalVisible && hasActiveTab &&
        <KeyboardInteractionTrap triggerAction={ this.props.triggerAction }>
          <DeploymentPluginModal
            onClose={ this.closeModal }
            validator={ this.validator }
            onDeploy={ this.onDeploy }
            getConfig={ this.getConfig }
            setConfig={ this.setConfig }
            tabName={ withoutExtension(this.activeTab.name) }
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
