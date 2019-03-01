/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global sinon */

import React from 'react';

import { shallow, mount } from 'enzyme';

import { DropdownButton } from '..';


describe('<DropdownButton>', function() {

  it('should render', function() {
    shallow(<DropdownButton />);
  });


  it('should accept custom className', function() {

    // when
    const wrapper = shallow(<DropdownButton className="foo" />);

    // then
    expect(wrapper.hasClass('foo')).to.be.true;
  });


  it('should be disabled', function() {

    // when
    const wrapper = shallow(<DropdownButton disabled />);

    // then
    expect(wrapper.hasClass('disabled')).to.be.true;
  });


  it('should open dropdown', function() {

    // given
    const wrapper = shallow(
      <DropdownButton
        items={ () => <span /> }
      />
    );

    // when
    wrapper.find('button').simulate('click');

    // then
    expect(wrapper.exists('.dropdown')).to.be.true;
  });


  it('should NOT open dropdown if disabled', function() {

    // given
    const wrapper = shallow(<DropdownButton disabled={ true } />);

    // when
    wrapper.find('button').simulate('click');

    // then
    expect(wrapper.exists('.dropdown')).to.be.false;
  });



  describe('close', function() {

    function openDropdown(props) {

      const items = [{
        text: 'foo'
      }, {
        text: 'bar'
      }];

      const wrapper = mount(<DropdownButton items={ items } { ...props } />);

      // open dropdown
      wrapper.setState({
        active: true
      });

      return wrapper;
    }


    it('should close dropdown on item click', function() {

      // given
      const wrapper = openDropdown();

      // when
      const item = wrapper.find('.item').first();

      item.simulate('click');

      // then
      expect(wrapper.state().active).to.be.false;
    });


    it('should close dropdown on global click', function() {

      // given
      const wrapper = openDropdown();

      // when
      document.body.click();

      // then
      expect(wrapper.state().active).to.be.false;
    });


    it('should NOT close on click if specified', function() {

      // given
      const wrapper = openDropdown({
        closeOnClick: false
      });

      // when
      const item = wrapper.find('.item').first();

      item.simulate('click');

      // then
      expect(wrapper.state().active).to.be.true;
    });

  });


  it('should call handler on item click', function() {

    // given
    const spy = sinon.spy();

    const items = [{
      text: 'foo',
      onClick: spy
    }];

    const wrapper = shallow(<DropdownButton items={ items } />);

    wrapper.find('button').simulate('click');

    // when
    wrapper.find('.item').simulate('click');

    // then
    expect(spy).to.have.been.called;
  });


  it('should accept custom dropdown children', function() {

    // when
    const wrapper = shallow(<DropdownButton><div className="foo"></div></DropdownButton>);

    wrapper.setState({
      active: true
    });

    // then
    expect(wrapper.exists('.foo')).to.be.true;
  });

});