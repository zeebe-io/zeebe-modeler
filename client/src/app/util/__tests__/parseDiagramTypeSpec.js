/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import parseDiagramType from '../parseDiagramType';

var files = {
  bpmn: require('./file-types/basic.bpmn20.xml'),
  bpmnWithDmnUri: require('./file-types/bpmnWithDmnUri.xml'),
  cmmn: require('./file-types/basic.cmmn11.xml'),
  dmn: require('./file-types/basic.dmn11.xml'),
  nyan: require('./file-types/nyan_cat.png'),
  random: require('./file-types/random.xml'),
  noNs: require('./file-types/no-ns.xml')
};

function getFile(type) {
  return files[type];
}


describe('util - parseDiagramType', function() {

  it('should identify bpmn file', function() {
    // given
    var bpmnFile = getFile('bpmn');

    // when
    var notation = parseDiagramType(bpmnFile);

    // then
    expect(notation).to.equal('bpmn');
  });


  it('should identify bpmn file regardless of dmn uri', function() {
    // given
    var bpmnFile = getFile('bpmnWithDmnUri');

    // when
    var notation = parseDiagramType(bpmnFile);

    // then
    expect(notation).to.equal('bpmn');
  });


  it('should identify cmmn file', function() {
    // given
    var dmnFile = getFile('cmmn');

    // when
    var notation = parseDiagramType(dmnFile);

    // then
    expect(notation).to.equal('cmmn');
  });


  it('should identify dmn file', function() {
    // given
    var dmnFile = getFile('dmn');

    // when
    var notation = parseDiagramType(dmnFile);

    // then
    expect(notation).to.equal('dmn');
  });


  it('should return null on random xml file', function() {
    // given
    var randomFile = getFile('random');

    // when
    var notation = parseDiagramType(randomFile);

    // then
    expect(notation).to.equal(null);
  });


  it('should return null on empty file', function() {
    // when
    var notation = parseDiagramType('');

    // then
    expect(notation).to.equal(null);
  });


  it('should return null on no-ns file', function() {
    // given
    var contents = getFile('noNs');

    // when
    var notation = parseDiagramType(contents);

    // then
    expect(notation).to.equal(null);
  });


  it('should return null on nyan cat image', function() {
    // given
    var nyanCatImage = getFile('nyan');

    // when
    var notation = parseDiagramType(nyanCatImage);

    // then
    expect(notation).to.equal(null);
  });

});
