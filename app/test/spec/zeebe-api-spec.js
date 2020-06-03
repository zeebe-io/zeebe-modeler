/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

'use strict';

const sinon = require('sinon');

const ZeebeAPI = require('../../lib/zeebe-api');


describe('ZeebeAPI', function() {

  describe('#checkConnectivity', function() {

    it('should set success=true for correct check', async () => {

      // given
      const zbAPI = mockZB();
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'https://google.com'
        }
      };

      // when
      const result = await zbAPI.checkConnectivity(parameters);

      // then
      expect(result).to.have.property('success', true);
    });


    it('should set success=false on failure', async () => {

      // given
      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            topology: function() {
              throw new Error('TEST ERROR.');
            }
          };
        }
      });
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'https://google.com'
        }
      };

      // when
      const result = await zbAPI.checkConnectivity(parameters);

      // then
      expect(result).to.have.property('success', false);
    });

    // TODO @barmac: add missing tests
    describe.skip('should return correct error reason on failure');
  });

  describe('#run', function() {


    it('should set success=true for successful instance run', async () => {

      // given
      const zbAPI = mockZB();
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      const result = await zbAPI.run(parameters);

      // then
      expect(result).to.exist;
      expect(result).to.have.property('success', true);
      expect(result).to.have.property('response');
    });


    it('should set success=false on failure', async () => {

      // given
      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            createWorkflowInstance: function() {
              throw new Error('TEST ERROR.');
            }
          };
        }
      });
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      const result = await zbAPI.run(parameters);

      // then
      expect(result).to.exist;
      expect(result).to.have.property('success', false);
      expect(result).to.have.property('response');
      expect(result.response.message).to.be.eql('TEST ERROR.');
    });
  });

  describe('#deploy', function() {


    it('should set success=true for successful deployment', async () => {

      // given
      const zbAPI = mockZB();
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      const result = await zbAPI.deploy(parameters);

      // then
      expect(result).to.exist;
      expect(result).to.have.property('success', true);
      expect(result).to.have.property('response');
    });


    it('should set success=false for failure', async () => {

      // given
      const error = new Error('test');
      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            deployWorkflow: function() {
              throw error;
            }
          };
        }
      });
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      const result = await zbAPI.deploy(parameters);

      // then
      expect(result).to.exist;
      expect(result).to.have.property('success', false);
      expect(result).to.have.property('response', error);
    });


    it('should reuse the client instance if config is the same', async () => {

      // given
      let firstInstance;
      const zbAPI = mockZB();
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      await zbAPI.deploy(parameters);
      firstInstance = zbAPI.zbClientInstanceCache;

      await zbAPI.deploy(parameters);

      // then
      const isSameObject = zbAPI.zbClientInstanceCache === firstInstance;

      expect(firstInstance).to.exist;
      expect(zbAPI.zbClientInstanceCache).to.exist;
      expect(isSameObject).to.be.true;
    });


    it('should create new client instance if config is different', async () => {

      // given
      let firstInstance;
      const closeSpy = sinon.spy();
      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            deployWorkflow: noop,
            close: closeSpy
          };
        }
      });
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      await zbAPI.deploy(parameters);
      firstInstance = zbAPI.zbClientInstanceCache;

      await zbAPI.deploy({
        ...parameters,
        endpoint: {
          type: 'oauth',
          url: 'testURL'
        }
      });

      // then
      const isSameObject = zbAPI.zbClientInstanceCache === firstInstance;

      expect(firstInstance).to.exist;
      expect(zbAPI.zbClientInstanceCache).to.exist;
      expect(isSameObject).to.be.false;
      expect(closeSpy).to.have.been.calledOnce;
    });


    it('should read file as buffer', async () => {

      // given
      const fs = {
        readFile: sinon.spy(() => ({}))
      };
      const zbAPI = mockZB({ fs });
      const parameters = {
        filePath: 'filePath',
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      };

      // when
      await zbAPI.deploy(parameters);

      // then
      expect(fs.readFile).to.have.been.calledOnce;
      expect(fs.readFile.args).to.eql([
        [ parameters.filePath, { encoding: false } ]
      ]);
    });


    it('should suffix deployment name with .bpmn if necessary', async () => {

      // given
      const deployWorkflowSpy = sinon.spy();

      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            deployWorkflow: deployWorkflowSpy,
          };
        }
      });

      // when
      await zbAPI.deploy({
        filePath: 'filePath',
        name: 'not_suffixed',
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      });

      const { args } = deployWorkflowSpy.getCall(0);

      // then
      expect(args[0].name).to.eql('not_suffixed.bpmn');
    });


    it('should not suffix deployment name with .bpmn if not necessary', async () => {

      // given
      const deployWorkflowSpy = sinon.spy();

      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            deployWorkflow: deployWorkflowSpy,
          };
        }
      });

      // when
      await zbAPI.deploy({
        filePath: 'filePath',
        name: 'suffixed.bpmn',
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      });

      const { args } = deployWorkflowSpy.getCall(0);

      // then
      expect(args[0].name).to.eql('suffixed.bpmn');
    });


    it('should use file path if deployment name is empty', async () => {

      // given
      const deployWorkflowSpy = sinon.spy();

      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            deployWorkflow: deployWorkflowSpy,
          };
        }
      });

      // when
      await zbAPI.deploy({
        filePath: '/Users/Test/Stuff/Zeebe/process.bpmn',
        name: '',
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      });

      const { args } = deployWorkflowSpy.getCall(0);

      // then
      expect(args[0].name).to.eql('process.bpmn');
    });


    it('should add bpmn suffix to filename if extension is other than bpmn', async () => {

      // given
      const deployWorkflowSpy = sinon.spy();

      const zbAPI = mockZB({
        ZBClient: function() {
          return {
            deployWorkflow: deployWorkflowSpy,
          };
        }
      });

      // when
      await zbAPI.deploy({
        filePath: '/Users/Test/Stuff/Zeebe/xmlFile.xml',
        name: '',
        endpoint: {
          type: 'selfHosted',
          url: 'testURL'
        }
      });

      const { args } = deployWorkflowSpy.getCall(0);

      // then
      expect(args[0].name).to.eql('xmlFile.bpmn');
    });
  });


  describe('create client', () => {

    it('should create client with correct url', async () => {

      // given
      let usedConfig;
      const zbAPI = mockZB({
        ZBClient: function(...args) {
          usedConfig = args;

          return {
            deployWorkflow: noop
          };
        }
      });
      const parameters = {
        endpoint: {
          type: 'selfHosted',
          url: 'https://camunda.com'
        }
      };

      // when
      await zbAPI.deploy(parameters);

      // then
      expect(usedConfig[0]).to.eql('https://camunda.com');
    });
  });
});

function mockZB(parameters = {}) {
  const fs = {
    readFile: () => ({})
  };

  const ZB = {
    ZBClient: parameters.ZBClient || function() {
      return {
        topology: noop,
        deployWorkflow: noop,
        createWorkflowInstance: noop,
        close: noop
      };
    }
  };

  return new ZeebeAPI(parameters.fs || fs, ZB);
}

function noop() {}
