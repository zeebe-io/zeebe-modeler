/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

const MODAL_TITLE = 'Deploy Diagram';
const INTRO = 'Specify deployment details and deploy this diagram to Camunda.';
const DEPLOYMENT_DETAILS_TITLE = 'Deployment Details';
const ENDPOINT_CONFIGURATION_TITLE = 'Endpoint Configuration';
const CANCEL = 'Cancel';
const DEPLOY = 'Deploy';
const START = 'Start';

const NAME = 'Name';
const METHOD = 'Method';
const SELF_HOSTED_TEXT = 'Self hosted';
const OAUTH_TEXT = 'Oauth';
const CAMUNDA_CLOUD_TEXT = 'Camunda Cloud';
const CONTACT_POINT = 'Contact point';
const DEPLOYMENT_NAME_HINT = 'Default value is the file name.';
const CONTACT_POINT_HINT = 'Default value is 0.0.0.0:26500';
const CONTACT_POINT_HINT_OAUTH = 'Should point to a running Zeebe broker.';
const OAUTH_URL = 'OAuth URL';
const AUDIENCE = 'Audience';
const CLIENT_ID = 'Cliend Id';
const CLIENT_SECRET = 'Client Secret';
const CLUSTER_ID = 'Cluster Id';
const REMEMBER_CREDENTIALS = 'Remember credentials';

const VALIDATING_CONNECTION = 'Validating connection.';
const CONNECTED_SUCCESSFULLY = 'Connected successfully.';
const UNABLE_TO_CONNECT = 'Unable to connect.';

const MUST_PROVIDE_A_VALUE = 'Must provide a value.';
const CONTACTPOINT_MUST_NOT_BE_EMPTY = 'Contactpoint must not be empty.';
const OAUTH_URL_MUST_NOT_BE_EMPTY = 'OAuth URL must not be empty.';
const AUDIENCE_MUST_NOT_BE_EMPTY = 'Audience must not be empty.';
const CLIENT_ID_MUST_NOT_BE_EMPTY = 'Client Id must not be empty.';
const CLIENT_SECRET_MUST_NOT_BE_EMPTY = 'Client Secret must not be empty.';
const CLUSTER_ID_MUST_NOT_BE_EMPTY = 'Cluster Id must not be empty.';
const FILL_IN_ALL_THE_FIELDS = 'You must fill in all the fields';

export {
  MODAL_TITLE,
  INTRO,
  DEPLOYMENT_DETAILS_TITLE,
  ENDPOINT_CONFIGURATION_TITLE,
  CANCEL,
  DEPLOY,
  START,
  VALIDATING_CONNECTION,
  CONNECTED_SUCCESSFULLY,
  UNABLE_TO_CONNECT,
  MUST_PROVIDE_A_VALUE,
  CONTACTPOINT_MUST_NOT_BE_EMPTY,
  OAUTH_URL_MUST_NOT_BE_EMPTY,
  AUDIENCE_MUST_NOT_BE_EMPTY,
  CLIENT_ID_MUST_NOT_BE_EMPTY,
  CLIENT_SECRET_MUST_NOT_BE_EMPTY,
  CLUSTER_ID_MUST_NOT_BE_EMPTY,
  NAME,
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
  FILL_IN_ALL_THE_FIELDS
};
