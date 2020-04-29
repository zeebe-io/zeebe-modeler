/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React from 'react';

import { Modal } from '../../../app/primitives';

import {
  MODAL_TITLE,
  ENDPOINT_CONFIGURATION_TITLE,
  CANCEL,
  DEPLOY,
  START,
  DEPLOYMENT_NAME,
  SELF_HOSTED_TEXT,
  OAUTH_TEXT,
  NONE,
  CAMUNDA_CLOUD_TEXT,
  CONTACT_POINT,
  DEPLOYMENT_NAME_HINT,
  CONTACT_POINT_HINT,
  OAUTH_URL,
  AUDIENCE,
  CLIENT_ID,
  CLIENT_SECRET,
  CLUSTER_ID,
  REMEMBER_CREDENTIALS,
  ERROR_REASONS,
  CONNECTION_ERROR_MESSAGES
} from './DeploymentPluginConstants';

import { AUTH_TYPES } from './../shared/ZeebeAuthTypes';

import {
  SELF_HOSTED,
  CAMUNDA_CLOUD
} from '../shared/ZeebeTargetTypes';

import {
  Formik,
  Field
} from 'formik';

import {
  CheckBox,
  Radio,
  TextInput
} from './ui';

import {
  generateId
} from '../../../util';

import css from './DeploymentPluginModal.less';


const CONNECTION_STATE = {
  INITIAL: 'initial',
  INVALID_ENDPOINT: 'invalidEndpoint',
  ERROR: 'error',
  CONNECTED: 'connected'
};

export default class DeploymentPluginModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isDeploying: false,
      connectionState: { type: CONNECTION_STATE.INITIAL }
    };

    this.defaultValues = this.getDefaultValues(props);

    const { validator } = props;

    this.validatorFunctionsByFieldNames = {
      contactPoint: validator.validateZeebeContactPoint,
      oauthURL: validator.validateOAuthURL,
      audience: validator.validateAudience,
      clientId: validator.validateClientId,
      clientSecret: validator.validateClientSecret,
      camundaCloudClientId: validator.validateClientId,
      camundaCloudClientSecret: validator.validateClientSecret,
      camundaCloudClusterId: validator.validateClusterId
    };

    this.connectionChecker = validator.createConnectionChecker();
  }

  async componentDidMount() {
    this.connectionChecker.subscribe({
      onComplete: this.handleConnectionCheckResult
    });
  }

  componentWillUnmount() {
    this.connectionChecker.unsubscribe();
  }

  getDefaultValues = (props) => {
    const deployment = {
      name: props.tabName
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
      deployment,
      endpoint
    };
  }

  endpointConfigurationFieldError = (meta, fieldName) => {
    return meta.touched && (meta.error || this.getConnectionError(fieldName));
  }

  getConnectionError(rawFieldName) {
    const { connectionState } = this.state;

    // no connection error
    if (connectionState.type !== CONNECTION_STATE.ERROR) {
      return;
    }

    const fieldName = rawFieldName.replace('endpoint.', '');
    const { failureReason } = connectionState;

    switch (failureReason) {
    case ERROR_REASONS.CONTACT_POINT_UNAVAILABLE:
      return fieldName === 'contactPoint' &&
        CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.CLUSTER_UNAVAILABLE:
      return fieldName === 'camundaCloudClusterId' && CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.UNAUTHORIZED:
    case ERROR_REASONS.FORBIDDEN:
      return [
        'clientId',
        'clientSecret',
        'camundaCloudClientId',
        'camundaCloudClientSecret'
      ].includes(fieldName) && CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.OAUTH_URL:
      return fieldName === 'oauthURL' && CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.UNKNOWN:
      return [
        'contactPoint',
        'camundaCloudClusterId'
      ].includes(fieldName) && CONNECTION_ERROR_MESSAGES[failureReason];
    }
  }

  scheduleConnectionCheck = formValues => {
    this.connectionChecker.check(formValues.endpoint);
  }

  handleConnectionCheckResult = result => {
    const { connectionResult, endpointErrors } = result;

    if (endpointErrors) {
      return this.setConnectionState({ type: CONNECTION_STATE.INVALID_ENDPOINT });
    }

    if (!connectionResult.isSuccessful) {
      return this.setConnectionState({
        type: CONNECTION_STATE.ERROR,
        failureReason: connectionResult.reason
      });
    }

    return this.setConnectionState({ type: CONNECTION_STATE.CONNECTED });
  }

  setConnectionState(connectionState) {
    this.setState({ connectionState });
  }

  handleFormSubmit = values => {
    this.setState({ isDeploying: true });

    this.props.onDeploy(values);
  }

  render() {

    const {
      onClose,
      configuration,
      isStart
    } = this.props;

    const {
      isDeploying
    } = this.state;

    const {
      validatorFunctionsByFieldNames
    } = this;

    return (
      <Modal className={ css.DeploymentPluginModal } onClose={ onClose }>
        <Formik
          initialValues={ configuration }
          onSubmit={ this.handleFormSubmit }
          validate={ this.scheduleConnectionCheck }
          validateOnMount
        >
          {
            form => (
              <form onSubmit={ form.handleSubmit }>
                <Modal.Title> { MODAL_TITLE } </Modal.Title>
                <Modal.Body>
                  <fieldset>
                    <div className="fields">
                      <Field
                        name="deployment.name"
                        component={ TextInput }
                        label={ DEPLOYMENT_NAME }
                        hint={ DEPLOYMENT_NAME_HINT }
                        autoFocus
                      />
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>
                      { ENDPOINT_CONFIGURATION_TITLE }
                    </legend>

                    <div className="fields">
                      <Field
                        name="endpoint.targetType"
                        component={ Radio }
                        label={ 'Target' }
                        values={
                          [
                            { value: SELF_HOSTED, label: SELF_HOSTED_TEXT },
                            { value: CAMUNDA_CLOUD, label: CAMUNDA_CLOUD_TEXT }
                          ]
                        }
                      />
                      {
                        form.values.endpoint.targetType === SELF_HOSTED && (
                          <React.Fragment>
                            <Field
                              name="endpoint.contactPoint"
                              component={ TextInput }
                              label={ CONTACT_POINT }
                              fieldError={ this.endpointConfigurationFieldError }
                              hint={ CONTACT_POINT_HINT }
                              autoFocus
                            />
                            <Field
                              name="endpoint.authType"
                              component={ Radio }
                              label={ 'Authentication' }
                              values={
                                [
                                  { value: AUTH_TYPES.NONE, label: NONE },
                                  { value: AUTH_TYPES.OAUTH, label: OAUTH_TEXT }
                                ]
                              }
                            />
                          </React.Fragment>
                        )
                      }
                      {
                        form.values.endpoint.targetType === SELF_HOSTED &&
                          form.values.endpoint.authType === AUTH_TYPES.OAUTH && (
                          <React.Fragment>
                            <Field
                              name="endpoint.clientId"
                              component={ TextInput }
                              label={ CLIENT_ID }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.clientId }
                            />
                            <Field
                              name="endpoint.clientSecret"
                              component={ TextInput }
                              label={ CLIENT_SECRET }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.clientSecret }
                              type="password"
                            />
                            <Field
                              name="endpoint.oauthURL"
                              component={ TextInput }
                              label={ OAUTH_URL }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.oauthURL }
                            />
                            <Field
                              name="endpoint.audience"
                              component={ TextInput }
                              label={ AUDIENCE }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.audience }
                            />
                          </React.Fragment>
                        )
                      }
                      {
                        form.values.endpoint.targetType === CAMUNDA_CLOUD && (
                          <React.Fragment>
                            <Field
                              name="endpoint.camundaCloudClusterId"
                              component={ TextInput }
                              label={ CLUSTER_ID }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.camundaCloudClusterId }
                              autoFocus
                            />
                            <Field
                              name="endpoint.camundaCloudClientId"
                              component={ TextInput }
                              label={ CLIENT_ID }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.camundaCloudClientId }
                            />
                            <Field
                              name="endpoint.camundaCloudClientSecret"
                              component={ TextInput }
                              label={ CLIENT_SECRET }
                              fieldError={ this.endpointConfigurationFieldError }
                              validate={ validatorFunctionsByFieldNames.camundaCloudClientSecret }
                              type="password"
                            />
                          </React.Fragment>
                        )
                      }
                      {
                        (form.values.endpoint.authType !== AUTH_TYPES.NONE || form.values.endpoint.targetType === CAMUNDA_CLOUD) &&
                          <Field
                            name="endpoint.rememberCredentials"
                            component={ CheckBox }
                            type="checkbox"
                            label={ REMEMBER_CREDENTIALS }
                          />
                      }
                    </div>
                  </fieldset>
                </Modal.Body>
                <Modal.Footer>
                  <div className="form-submit">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={ onClose }
                    >
                      { CANCEL }
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={ isDeploying }
                    >
                      { isStart ? START : DEPLOY }
                    </button>
                  </div>
                </Modal.Footer>
              </form>
            )
          }
        </Formik>
      </Modal>
    );
  }
}
