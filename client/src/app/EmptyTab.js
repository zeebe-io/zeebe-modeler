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

import Slot from './slot-fill/Slot';

import css from './EmptyTab.less';

import {
  Tab
} from './primitives';


export default class EmptyTab extends PureComponent {

  componentDidMount() {
    this.props.onShown();
  }

  triggerAction() {}

  render() {

    const {
      onAction
    } = this.props;

    return (
      <Tab className={ css.EmptyTab }>
        <p className="create-buttons">
          <span>Create a </span>
          <button className="create-bpmn btn btn-secondary" onClick={ () => onAction('create-bpmn-diagram') }>BPMN diagram</button>
        </p>

        <Slot name="empty-tab-buttons" />
      </Tab>
    );
  }
}
