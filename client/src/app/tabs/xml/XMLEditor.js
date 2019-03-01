/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import {
  WithCache,
  WithCachedState,
  CachedComponent
} from '../../cached';

import CodeMirror from './CodeMirror';

import css from './XMLEditor.less';

import { getXMLEditMenu } from './getXMLEditMenu';

import getXMLWindowMenu from './getXMLWindowMenu';

import {
  isString
} from 'min-dash';


export class XMLEditor extends CachedComponent {

  constructor(props) {
    super(props);

    this.state = {};

    this.ref = React.createRef();
  }

  componentDidMount() {
    const {
      editor
    } = this.getCached();

    editor.attachTo(this.ref.current);

    editor.on('change', this.handleChanged);

    this.handleChanged();

    this.checkImport();
  }

  componentWillUnmount() {
    const {
      editor
    } = this.getCached();

    editor.detach();

    editor.off('change', this.handleChanged);
  }

  componentDidUpdate(prevProps) {
    if (isXMLChange(prevProps.xml, this.props.xml)) {
      this.checkImport();
    }

    if (isChachedStateChange(prevProps, this.props)) {
      this.handleChanged();
    }
  }

  triggerAction(action) {
    const {
      editor
    } = this.getCached();

    if (action === 'undo') {
      editor.doc.undo();
    }

    if (action === 'redo') {
      editor.doc.redo();
    }

    if (action === 'find') {
      editor.execCommand('findPersistent');
    }

    if (action === 'findNext') {
      editor.execCommand('findNext');
    }

    if (action === 'findPrev') {
      editor.execCommand('findPrev');
    }

    if (action === 'replace') {
      editor.execCommand('replace');
    }
  }

  checkImport() {
    const { xml } = this.props;

    const {
      editor,
      lastXML
    } = this.getCached();

    if (isXMLChange(lastXML, xml)) {
      editor.importXML(xml);

      const stackIdx = editor._stackIdx;

      this.setCached({
        lastXML: xml,
        stackIdx
      });
    }

    editor.refresh();
  }

  isDirty() {
    const {
      editor,
      stackIdx
    } = this.getCached();

    return editor._stackIdx !== stackIdx;
  }

  handleChanged = () => {
    const {
      onChanged
    } = this.props;

    const {
      editor
    } = this.getCached();

    const history = editor.doc.historySize();

    const editMenu = getXMLEditMenu({
      canRedo: !!history.redo,
      canUndo: !!history.undo
    });

    const dirty = this.isDirty();

    const newState = {
      canExport: false,
      dirty,
      redo: !!history.redo,
      undo: !!history.undo
    };

    // ensure backwards compatibility
    // https://github.com/camunda/camunda-modeler/commit/78357e3ed9e6e0255ac8225fbdf451a90457e8bf#diff-bd5be70c4e5eadf1a316c16085a72f0fL17
    newState.editable = true;
    newState.searchable = true;

    const windowMenu = getXMLWindowMenu();

    if (typeof onChanged === 'function') {
      onChanged({
        ...newState,
        editMenu,
        windowMenu
      });
    }

    this.setState({
      ...newState
    });
  }

  getXML() {
    const {
      editor
    } = this.getCached();

    const stackIdx = editor._stackIdx;

    const xml = editor.getValue();

    this.setCached({
      lastXML: xml,
      stackIdx
    });

    return xml;
  }

  render() {
    return (
      <div className={ css.XMLEditor }>
        <div className="content" ref={ this.ref }></div>
      </div>
    );
  }

  static createCachedState() {

    const editor = CodeMirror();

    const stackIdx = editor._stackIdx;

    return {
      __destroy: () => {
        editor.destroy();
      },
      editor,
      lastXML: null,
      stackIdx
    };
  }

}

export default WithCache(WithCachedState(XMLEditor));

// helpers //////////

function isXMLChange(prevXML, xml) {
  return trim(prevXML) !== trim(xml);
}

function trim(string) {
  if (isString(string)) {
    return string.trim();
  }

  return string;
}

function isChachedStateChange(prevProps, props) {
  return prevProps.cachedState !== props.cachedState;
}