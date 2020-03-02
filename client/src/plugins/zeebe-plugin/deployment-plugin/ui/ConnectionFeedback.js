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
  VALIDATING_CONNECTION,
  CONNECTED_SUCCESSFULLY,
  UNABLE_TO_CONNECT,
  FILL_IN_ALL_THE_FIELDS
} from '../DeploymentPluginConstants';

const errorReasons = {
  UNKNOWN: 'UNKNOWN',
  CONTACT_POINT: 'CONTACT_POINT',
  AUTHORIZATION: 'AUTHORIZATION',
  CLUSTER_ID: 'CLUSTER_ID',
  AUDIENCE: 'AUDIENCE',
  OAUTH_URL: 'OAUTH_URL'
};

export default function ConnectionFeedback(props) {

  const {
    renderWaitingState,
    isValidating,
    connectionValidationSuccessful,
    validationResult,
    failureReason
  } = props;

  if (!validationResult) {
    return (
      <div className="configuration-status configuration-status__hint">
        { FILL_IN_ALL_THE_FIELDS }
      </div>
    );
  }

  if (isValidating || renderWaitingState) {
    return (
      <div className="configuration-status configuration-status__loading">
        { VALIDATING_CONNECTION }
      </div>
    );
  }

  if (connectionValidationSuccessful) {
    return (
      <div className="configuration-status configuration-status__success">
        { CONNECTED_SUCCESSFULLY }
      </div>
    );
  }

  const connectionFeedbackText = failureReason ? (UNABLE_TO_CONNECT + ' ' + getErrorText(failureReason)) : UNABLE_TO_CONNECT;

  return (
    <div className="configuration-status configuration-status__error">
      { connectionFeedbackText }
    </div>
  );

}

function getErrorText(failureReason) {
  switch (failureReason) {
  case errorReasons.UNKNOWN:
    return '';
  case errorReasons.CONTACT_POINT:
    return 'Please check the contact point.';
  case errorReasons.AUTHORIZATION:
    return 'Please check your credentials.';
  case errorReasons.CLUSTER_ID:
    return 'Please check the cluster id.';
  case errorReasons.AUDIENCE:
    return 'Please check the audience.';
  case errorReasons.OAUTH_URL:
    return 'Please check the OAuth URL.';
  }
  return '';
}
