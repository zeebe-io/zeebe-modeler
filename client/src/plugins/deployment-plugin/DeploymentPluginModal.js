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
  omit
} from 'min-dash';

import { Modal } from '../../app/primitives';

import {
  MODAL_TITLE,
  INTRO,
  DEPLOYMENT_DETAILS_TITLE,
  ENDPOINT_CONFIGURATION_TITLE,
  CANCEL,
  DEPLOY,
  SELF_HOSTED,
  OAUTH,
  CAMUNDA_CLOUD,
  NAME,
  METHOD,
  SELF_HOSTED_TEXT,
  OAUTH_TEXT,
  CAMUNDA_CLOUD_TEXT,
  CONTACT_POINT,
  CONTACT_POINT_HINT,
  CONTACT_POINT_HINT_OAUTH,
  OAUTH_URL,
  AUDIENCE,
  CLIENT_ID,
  CLIENT_SECRET,
  CLUSTER_ID,
  REMEMBER_CREDENTIALS
} from './DeploymentPluginConstants';

import {
  Formik,
  Field
} from 'formik';

import {
  Select,
  TextInput,
  ConnectionFeedback,
  CheckBox
} from './ui';

import css from './DeploymentPluginModal.less';

export default class DeploymentPluginModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.isCheckingConnection = false;

    this.state = {
      isValidating: true,
      isDeploying: false,
      validationSuccessful: false,
      valuesInitiated: false
    };

    this.defaultValues = {
      deploymentName: 'deployment1',
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
  }

  componentDidMount = async () => {
    const storedConfig = await this.props.getConfig();

    this.initialValues = {};
    for (let key in this.defaultValues) {
      this.initialValues[key] = storedConfig[key] || this.defaultValues[key];
    }

    this.setState({
      valuesInitiated: true
    });
  }

  fieldError = (meta) => {
    return meta.error;
  }

  shouldCheckConnection = () => {
    if (!this.lastCheckedFormValues) {
      return true;
    }

    const lastCheckFormValuesOmitted = omit(JSON.parse(this.lastCheckedFormValues), 'rememberCredentials');
    const formValuesOmitted = omit(this.formValues, 'rememberCredentials');

    return JSON.stringify(lastCheckFormValuesOmitted) !== JSON.stringify(formValuesOmitted);
  }

  checkConnection = async (formValues) => {
    if (!this.shouldCheckConnection() || this.isCheckingConnection) {
      return;
    }

    this.lastCheckedFormValues = JSON.stringify(formValues);

    this.setState({
      isValidating: true
    });

    this.isCheckingConnection = true;
    const validationResult = await this.props.validator.validateConnection(formValues);
    this.isCheckingConnection = false;

    this.setState({
      isValidating: false,
      validationSuccessful: validationResult
    });
  }

  saveConfig = (formValuesParsed) => {

    if (formValuesParsed.rememberCredentials) {
      this.props.setConfig(formValuesParsed);
    } else {
      this.props.setConfig(omit(formValuesParsed, ['oauthClientId', 'oauthClientSecret', 'camundaCloudClientId', 'camundaCloudClientSecret']));
    }
  }

  handleFormSubmit = () => {

    const lastCheckValuesParsed = JSON.parse(this.lastCheckedFormValues);
    const { rememberCredentials } = this.formValues;

    const formValuesParsed = {
      ...lastCheckValuesParsed,
      rememberCredentials
    };

    this.saveConfig(formValuesParsed);

    this.setState({ isDeploying: true });

    this.props.onDeploy(formValuesParsed);
  }

  render() {

    const {
      onClose,
      validator
    } = this.props;

    const {
      isValidating,
      validationSuccessful,
      isDeploying,
      valuesInitiated
    } = this.state;

    const {
      defaultValues,
      initialValues
    } = this;

    return (
      <Modal className={ css.DeploymentPluginModal } onClose={ onClose }>
        <Modal.Title> { MODAL_TITLE } </Modal.Title>
        <Formik initialValues={ initialValues || defaultValues } enableReinitialize={ true }>
          {
            form => {

              this.formValues = {
                ...form.values
              };

              if (this.timeoutID !== undefined) {
                clearTimeout(this.timeoutID);
              }

              this.timeoutID = setTimeout(() => {
                this.checkConnection(this.formValues);
              }, (this.timeoutID === undefined ? 0 : 350));

              return (
                <form onSubmit={ this.handleFormSubmit }>
                  <Modal.Body>
                    <p className="intro">
                      { INTRO }
                    </p>
                    <fieldset>
                      <legend>
                        { DEPLOYMENT_DETAILS_TITLE }
                      </legend>

                      <div className="fields">
                        <Field
                          name="deploymentName"
                          component={ TextInput }
                          label={ NAME }
                          fieldError={ this.fieldError }
                          validate={ validator.validateDeploymentName }
                          autoFocus
                        />
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend>
                        { ENDPOINT_CONFIGURATION_TITLE }
                      </legend>

                      <ConnectionFeedback isValidating={ isValidating } validationSuccessful={ validationSuccessful } />

                      <div className="fields">
                        <Field
                          name="connectionMethod"
                          component={ Select }
                          label={ METHOD }
                          onChange={ event => form.setValues({
                            ...form.values,
                            connectionMethod: event.target.value
                          }) }
                        >
                          <option value={ SELF_HOSTED } defaultValue>{ SELF_HOSTED_TEXT }</option>
                          <option value={ OAUTH }>{ OAUTH_TEXT }</option>
                          <option value={ CAMUNDA_CLOUD }>{ CAMUNDA_CLOUD_TEXT }</option>
                        </Field>
                        {
                          form.values.connectionMethod === SELF_HOSTED && (
                            <React.Fragment>
                              <Field
                                name="zeebeContactpointSelfHosted"
                                component={ TextInput }
                                label={ CONTACT_POINT }
                                fieldError={ this.fieldError }
                                hint={ CONTACT_POINT_HINT }
                                autoFocus
                              />
                            </React.Fragment>
                          )
                        }
                        {
                          form.values.connectionMethod === OAUTH && (
                            <React.Fragment>
                              <Field
                                name="zeebeContactPointOauth"
                                component={ TextInput }
                                label={ CONTACT_POINT }
                                fieldError={ this.fieldError }
                                validate={ validator.validateZeebeContactPoint }
                                hint={ CONTACT_POINT_HINT_OAUTH }
                                autoFocus
                              />
                              <Field
                                name="oauthClientId"
                                component={ TextInput }
                                label={ CLIENT_ID }
                                fieldError={ this.fieldError }
                                validate={ validator.validateClientId }
                              />
                              <Field
                                name="oauthClientSecret"
                                component={ TextInput }
                                label={ CLIENT_SECRET }
                                fieldError={ this.fieldError }
                                validate={ validator.validateClientSecret }
                                type="password"
                              />
                              <Field
                                name="oauthURL"
                                component={ TextInput }
                                label={ OAUTH_URL }
                                fieldError={ this.fieldError }
                                validate={ validator.validateOAuthURL }
                              />
                              <Field
                                name="audience"
                                component={ TextInput }
                                label={ AUDIENCE }
                                fieldError={ this.fieldError }
                                validate={ validator.validateAudience }
                              />
                            </React.Fragment>
                          )
                        }
                        {
                          form.values.connectionMethod === CAMUNDA_CLOUD && (
                            <React.Fragment>
                              <Field
                                name="camundaCloudClientId"
                                component={ TextInput }
                                label={ CLIENT_ID }
                                fieldError={ this.fieldError }
                                validate={ validator.validateClientId }
                                autoFocus
                              />
                              <Field
                                name="camundaCloudClientSecret"
                                component={ TextInput }
                                label={ CLIENT_SECRET }
                                fieldError={ this.fieldError }
                                validate={ validator.validateClientSecret }
                                type="password"
                              />
                              <Field
                                name="camundaCloudClusterId"
                                component={ TextInput }
                                label={ CLUSTER_ID }
                                fieldError={ this.fieldError }
                                validate={ validator.validateClusterId }
                              />
                            </React.Fragment>
                          )
                        }
                        {
                          (form.values.connectionMethod === OAUTH || form.values.connectionMethod === CAMUNDA_CLOUD) &&
                          <Field
                            name="rememberCredentials"
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
                        disabled={ !valuesInitiated || isValidating || !validationSuccessful || isDeploying }
                      >
                        { DEPLOY }
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
