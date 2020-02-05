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
  UNABLE_TO_CONNECT
} from '../DeploymentPluginConstants';

export default function ConnectionFeedback(props) {

  const {
    isValidating,
    validationSuccessful
  } = props;

  if (isValidating) {
    return (
      <div className="configuration-status configuration-status__loading">
        { VALIDATING_CONNECTION }
      </div>
    );
  }

  if (validationSuccessful) {
    return (
      <div className="configuration-status configuration-status__success">
        { CONNECTED_SUCCESSFULLY }
      </div>
    );
  }

  return (
    <div className="configuration-status configuration-status__error">
      { UNABLE_TO_CONNECT }
    </div>
  );

}
