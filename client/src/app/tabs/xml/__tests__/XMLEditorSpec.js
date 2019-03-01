/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { mount } from 'enzyme';

import {
  Cache,
  WithCachedState
} from '../../../cached';

import { XMLEditor } from '../XMLEditor';

import CodeMirror from 'test/mocks/code-mirror/CodeMirror';

/* global sinon */

const XML = '<xml></xml>';


describe('<XMLEditor>', function() {

  describe('#render', function() {

    it('should render with NO xml', function() {

      const {
        instance
      } = renderEditor();

      expect(instance).to.exist;
    });


    it('should render with xml', function() {

      const {
        instance
      } = renderEditor(XML);

      expect(instance).to.exist;
    });

  });


  it('#getXML', function() {

    // given
    const {
      instance
    } = renderEditor(XML);

    // when
    // then
    expect(instance.getXML()).to.be.equal(XML);
  });


  describe('#handleChanged', function() {

    it('should notify about changes', function() {

      // given
      const changedSpy = (state) => {

        // then
        expect(state).to.include({
          dirty: true,
          redo: true,
          undo: true
        });
      };

      const cache = new Cache();

      cache.add('editor', {
        cached: {
          lastXML: XML,
          editor: CodeMirror({
            undo: 1,
            redo: 1
          }),
          stackIdx: 2
        },
        __destroy: () => {}
      });

      const { instance } = renderEditor(XML, {
        id: 'editor',
        cache,
        onChanged: changedSpy
      });

      // when
      instance.handleChanged();
    });


    it('should notify about plugin related changes', function() {
      // given
      const changedSpy = sinon.spy();

      const { instance } = renderEditor(XML, {
        id: 'editor',
        onChanged: changedSpy
      });

      changedSpy.resetHistory();

      // when
      instance.handleChanged();

      // then
      expect(changedSpy).to.be.calledOnce;

      const state = changedSpy.firstCall.args[0];

      expect(state).to.have.property('editable');
      expect(state).to.have.property('searchable');
    });

  });


  describe('dirty state', function() {

    let instance;

    beforeEach(function() {
      instance = renderEditor(XML).instance;
    });


    it('should NOT be dirty initially', function() {

      // then
      const dirty = instance.isDirty();

      expect(dirty).to.be.false;
    });


    it('should be dirty after modeling', function() {

      // given
      const { editor } = instance.getCached();

      // when
      // execute 1 command
      editor.doc.execute(1);

      // then
      const dirty = instance.isDirty();

      expect(dirty).to.be.true;
    });


    it('should NOT be dirty after modeling -> undo', function() {

      // given
      const { editor } = instance.getCached();

      editor.doc.execute(1);

      // when
      editor.doc.undo();

      // then
      const dirty = instance.isDirty();

      expect(dirty).to.be.false;
    });


    it('should NOT be dirty after save', async function() {

      // given
      const { editor } = instance.getCached();

      // execute 1 command
      editor.doc.execute(1);

      // when
      await instance.getXML();

      // then
      const dirty = instance.isDirty();

      expect(dirty).to.be.false;
    });

  });

});

// helpers //////////

function noop() {}

const TestEditor = WithCachedState(XMLEditor);

function renderEditor(xml, options = {}) {
  const {
    id,
    onChanged,
  } = options;

  const slotFillRoot = mount(
    <TestEditor
      id={ id || 'editor' }
      xml={ xml }
      activeSheet={ options.activeSheet || { id: 'xml' } }
      onChanged={ onChanged || noop }
      cache={ options.cache || new Cache() }
    />
  );

  const wrapper = slotFillRoot.find(XMLEditor);

  const instance = wrapper.instance();

  return {
    instance,
    wrapper
  };
}