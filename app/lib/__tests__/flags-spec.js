/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const Flags = require('../flags');


describe('flags', function() {

  it('should instantiate', function() {

    // when
    const flags = new Flags({
      paths: [
        absPath('flags/1'),
        absPath('flags/2')
      ],
      overrides: {
        TWO: 'overridden'
      }
    });


    // then
    expect(flags.getAll()).to.eql({
      ONE: true,
      TWO: 'overridden'
    });

  });

});


function absPath(file) {
  return path.resolve(__dirname, file);
}