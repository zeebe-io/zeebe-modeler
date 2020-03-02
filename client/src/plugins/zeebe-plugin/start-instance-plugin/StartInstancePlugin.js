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

const DEPLOYMENT_CONFIG_KEY = 'DEPLOYMENT_CONFIG';

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

  onIconClicked = async () => {
    const saveResult = await this.props.triggerAction('save', { tab: this.activeTab });
    const path = saveResult.file.path;

    const deploymentConfig = await this.props.config.get(DEPLOYMENT_CONFIG_KEY);

    if (!deploymentConfig) {
      this.deployFirst();
      return;
    }

    const zeebeAPI = this.props._getGlobal('zeebeAPI');

    const connectionResult = await this.zeebeConnectionValidator.validateConnection(deploymentConfig);

    if (!connectionResult.isSuccessful) {
      this.deployFirst();
      return;
    }

    const deploymentResult = await zeebeAPI.deploy({
      filePath: path,
      name: deploymentConfig.deploymentName || withoutExtension(this.activeTab.name)
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
