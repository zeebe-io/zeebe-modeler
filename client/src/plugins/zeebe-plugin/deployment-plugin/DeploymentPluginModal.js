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

import {
  omit,
  find,
  keys,
  forEach
} from 'min-dash';

import { Modal } from '../../../app/primitives';

import {
  MODAL_TITLE,
  ENDPOINT_CONFIGURATION_TITLE,
  CANCEL,
  DEPLOY,
  START,
  DEPLOYMENT_NAME,
  METHOD,
  SELF_HOSTED_TEXT,
  OAUTH_TEXT,
  CAMUNDA_CLOUD_TEXT,
  CONTACT_POINT,
  DEPLOYMENT_NAME_HINT,
  CONTACT_POINT_HINT,
  CONTACT_POINT_HINT_OAUTH,
  OAUTH_URL,
  AUDIENCE,
  CLIENT_ID,
  CLIENT_SECRET,
  CLUSTER_ID,
  REMEMBER_CREDENTIALS,
  ERROR_REASONS,
  CONNECTION_ERROR_MESSAGES
} from './DeploymentPluginConstants';

import {
  SELF_HOSTED,
  OAUTH,
  CAMUNDA_CLOUD
} from '../shared/ZeebeConnectionTypes';

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

export default class DeploymentPluginModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isValidating: false,
      isDeploying: false,
      connectionValidationSuccessful: false,
      valuesInitiated: false
    };

    this.defaultValues = this.getDefaultValues(props);

    const { validator } = props;

    this.validatorFunctionsByFieldNames = {
      zeebeContactPointOauth: validator.validateZeebeContactPoint,
      oauthURL: validator.validateOAuthURL,
      audience: validator.validateAudience,
      oauthClientId: validator.validateClientId,
      oauthClientSecret: validator.validateClientSecret,
      camundaCloudClientId: validator.validateClientId,
      camundaCloudClientSecret: validator.validateClientSecret,
      camundaCloudClusterId: validator.validateClusterId
    };

    this.fieldsByConnectionsMethod = {
      [ SELF_HOSTED ]: [],
      [ OAUTH ]: [ 'oauthURL', 'audience', 'oauthClientId', 'oauthClientSecret' ],
      [ CAMUNDA_CLOUD ]: [ 'camundaCloudClientId', 'camundaCloudClientSecret', 'camundaCloudClusterId' ]
    };

    this.validationResultCache = null;
  }

  componentDidMount = async () => {
    this.initialValues = await this.getInitialValues();

    this.setState({
      valuesInitiated: true
    });
  }

  getDefaultValues = (props) => {
    const deployment = {
      name: props.tabName
    };

    const endpoint = {
      id: generateId(),
      connectionMethod: SELF_HOSTED,
      zeebeContactpointSelfHosted: '0.0.0.0:26500',
      zeebeContactPointOauth: '',
      oauthURL: '',
      audience: '',
      oauthClientId: '',
      oauthClientSecret: '',
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

  getInitialValues = async () => {
    const {
      deployment: defaultDeployment,
      endpoint: defaultEndpoint
    } = this.defaultValues;

    const savedConfiguration = await this.props.getConfig();

    const {
      deployment: savedDeployment,
      endpoint: savedEndpoint
    } = savedConfiguration;

    let deployment = defaultDeployment;
    if (savedDeployment) {
      forEach(keys(defaultDeployment), key => {
        deployment[key] = savedDeployment[key] || defaultDeployment[key];
      });
    }

    let endpoint = defaultEndpoint;
    if (savedEndpoint) {
      forEach(keys(defaultEndpoint), key => {
        endpoint[key] = savedEndpoint[key] || defaultEndpoint[key];
      });
    }

    return {
      deployment,
      endpoint
    };
  }

  fieldError = (meta) => {
    return meta.error;
  }

  endpointConfigurationFieldError = (meta, fieldName) => {
    return meta.error || this.getConnectionError(fieldName);
  }

  getConnectionError(fieldName) {
    const { failureReason } = this.state;

    if (!failureReason) {
      return;
    }

    switch (failureReason) {
    case ERROR_REASONS.CONTACT_POINT_UNAVAILABLE:
      return [ 'zeebeContactpointSelfHosted', 'zeebeContactPointOauth' ].includes(fieldName) &&
        CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.CLUSTER_UNAVAILABLE:
      return fieldName === 'camundaCloudClusterId' && CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.UNAUTHORIZED:
    case ERROR_REASONS.FORBIDDEN:
      return [
        'oauthClientId',
        'oauthClientSecret',
        'camundaCloudClientId',
        'camundaCloudClientSecret'
      ].includes(fieldName) && CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.OAUTH_URL:
      return fieldName === 'oauthURL' && CONNECTION_ERROR_MESSAGES[failureReason];
    case ERROR_REASONS.UNKNOWN:
      return [
        'zeebeContactpointSelfHosted',
        'zeebeContactPointOauth',
        'camundaCloudClusterId'
      ].includes(fieldName) && CONNECTION_ERROR_MESSAGES[failureReason];
    }
  }

  shouldCheckConnection = () => {
    if (!this.lastCheckedFormValues || this.renderWaitingState) {
      return true;
    }

    const omitFields = ['rememberCredentials', 'deploymentName'];
    const lastCheckFormValuesOmitted = omit(JSON.parse(this.lastCheckedFormValues), omitFields);
    const formValuesOmitted = omit(this.formValues, omitFields);

    return JSON.stringify(lastCheckFormValuesOmitted) !== JSON.stringify(formValuesOmitted);
  }

  validateVisibleFields = (formValues) => {
    const mandatoryFields = this.fieldsByConnectionsMethod[formValues.connectionMethod];
    return !find(mandatoryFields, (fieldName) => {
      return this.validatorFunctionsByFieldNames[fieldName] && this.validatorFunctionsByFieldNames[fieldName](formValues[fieldName]);
    });
  }

  checkConnection = async (formValues) => {
    if (!this.shouldCheckConnection() || this.state.isValidating) {
      return;
    }

    const {
      endpoint
    } = formValues;

    this.lastCheckedFormValues = JSON.stringify(formValues);
    this.renderWaitingState = false;

    this.setState({
      isValidating: true
    });

    const validationResult = await this.props.validator.validateConnection(endpoint);

    this.setState({
      isValidating: false,
      connectionValidationSuccessful: validationResult.isSuccessful,
      failureReason: validationResult.reason
    });
  }

  saveConfig = (formValuesParsed) => {
    const {
      setConfig
    } = this.props;

    const {
      endpoint
    } = formValuesParsed;

    if (endpoint.rememberCredentials) {
      setConfig(formValuesParsed);
    } else {
      setConfig({
        ...formValuesParsed,
        endpoint: this.removeCredentials(formValuesParsed.endpoint)
      });
    }
  }

  removeCredentials = (endpointConfiguration) => {
    return omit(endpointConfiguration, [
      'oauthClientId',
      'oauthClientSecret',
      'camundaCloudClientId',
      'camundaCloudClientSecret'
    ]);
  }

  handleFormSubmit = () => {
    const lastCheckValuesParsed = JSON.parse(this.lastCheckedFormValues);

    const {
      deployment,
      endpoint
    } = this.formValues;

    const {
      rememberCredentials
    } = endpoint;

    const {
      name
    } = deployment;

    const formValuesParsed = {
      ...lastCheckValuesParsed,
      endpoint: {
        ...lastCheckValuesParsed.endpoint,
        rememberCredentials
      },
      deployment: {
        ...lastCheckValuesParsed.deployment,
        name
      }
    };

    this.saveConfig(formValuesParsed);

    this.setState({ isDeploying: true });

    this.props.onDeploy(formValuesParsed);
  }

  render() {

    const {
      onClose,
      isStart
    } = this.props;

    const {
      isValidating,
      connectionValidationSuccessful,
      isDeploying,
      valuesInitiated
    } = this.state;

    const {
      defaultValues,
      initialValues,
      validatorFunctionsByFieldNames
    } = this;

    return (
      <Modal className={ css.DeploymentPluginModal } onClose={ onClose }>
        <Formik initialValues={ initialValues || defaultValues } enableReinitialize={ true }>
          {
            form => {

              this.formValues = {
                ...form.values
              };

              if (this.timeoutID !== undefined) {
                clearTimeout(this.timeoutID);
              }

              const validationResult = this.validateVisibleFields(this.formValues);

              if (validationResult) {
                this.timeoutID = setTimeout(() => {
                  this.checkConnection(this.formValues);
                }, (this.timeoutID === undefined ? 0 : 350));
              }

              if (validationResult && validationResult !== this.validationResultCache) {
                this.renderWaitingState = true;
              }

              this.validationResultCache = validationResult;

              return (
                <form onSubmit={ this.handleFormSubmit }>
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
                          name="endpoint.connectionMethod"
                          component={ Radio }
                          label={ METHOD }
                          onChange={ event => form.setValues({
                            ...form.values,
                            endpoint: {
                              ...form.values.endpoint,
                              connectionMethod: event.target.value
                            }
                          }) }
                          values={
                            [
                              { value: SELF_HOSTED, label: SELF_HOSTED_TEXT },
                              { value: OAUTH, label: OAUTH_TEXT },
                              { value: CAMUNDA_CLOUD, label: CAMUNDA_CLOUD_TEXT }
                            ]
                          }
                        />
                        {
                          form.values.endpoint.connectionMethod === SELF_HOSTED && (
                            <React.Fragment>
                              <Field
                                name="endpoint.zeebeContactpointSelfHosted"
                                component={ TextInput }
                                label={ CONTACT_POINT }
                                fieldError={ this.endpointConfigurationFieldError }
                                hint={ CONTACT_POINT_HINT }
                                autoFocus
                              />
                            </React.Fragment>
                          )
                        }
                        {
                          form.values.endpoint.connectionMethod === OAUTH && (
                            <React.Fragment>
                              <Field
                                name="endpoint.zeebeContactPointOauth"
                                component={ TextInput }
                                label={ CONTACT_POINT }
                                fieldError={ this.endpointConfigurationFieldError }
                                validate={ validatorFunctionsByFieldNames.zeebeContactPointOauth }
                                hint={ CONTACT_POINT_HINT_OAUTH }
                                autoFocus
                              />
                              <Field
                                name="endpoint.oauthClientId"
                                component={ TextInput }
                                label={ CLIENT_ID }
                                fieldError={ this.endpointConfigurationFieldError }
                                validate={ validatorFunctionsByFieldNames.oauthClientId }
                              />
                              <Field
                                name="endpoint.oauthClientSecret"
                                component={ TextInput }
                                label={ CLIENT_SECRET }
                                fieldError={ this.endpointConfigurationFieldError }
                                validate={ validatorFunctionsByFieldNames.oauthClientSecret }
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
                          form.values.endpoint.connectionMethod === CAMUNDA_CLOUD && (
                            <React.Fragment>
                              <Field
                                name="endpoint.camundaCloudClientId"
                                component={ TextInput }
                                label={ CLIENT_ID }
                                fieldError={ this.endpointConfigurationFieldError }
                                validate={ validatorFunctionsByFieldNames.camundaCloudClientId }
                                autoFocus
                              />
                              <Field
                                name="endpoint.camundaCloudClientSecret"
                                component={ TextInput }
                                label={ CLIENT_SECRET }
                                fieldError={ this.endpointConfigurationFieldError }
                                validate={ validatorFunctionsByFieldNames.camundaCloudClientSecret }
                                type="password"
                              />
                              <Field
                                name="endpoint.camundaCloudClusterId"
                                component={ TextInput }
                                label={ CLUSTER_ID }
                                fieldError={ this.endpointConfigurationFieldError }
                                validate={ validatorFunctionsByFieldNames.camundaCloudClusterId }
                              />
                            </React.Fragment>
                          )
                        }
                        {
                          (form.values.endpoint.connectionMethod === OAUTH || form.values.endpoint.connectionMethod === CAMUNDA_CLOUD) &&
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
                        disabled={ !valuesInitiated || isValidating || !connectionValidationSuccessful || isDeploying || !validationResult }
                      >
                        { isStart ? START : DEPLOY }
                      </button>
                    </div>
                  </Modal.Footer>
                </form>
              );
            }
          }
        </Formik>
      </Modal>
    );
  }

}
