/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import {
  bootstrapModeler,
  inject
} from 'bpmn-js/test/helper';

import {
  triggerValue,
  triggerEvent
} from './helper';

import TestContainer from 'mocha-test-container-support';

import propertiesPanelModule from 'bpmn-js-properties-panel';

import {
  query as domQuery,
  classes as domClasses
} from 'min-dom';

import {
  find
} from 'lodash';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper';

import coreModule from 'bpmn-js/lib/core';
import selectionModule from 'diagram-js/lib/features/selection';
import modelingModule from 'bpmn-js/lib/features/modeling';
import propertiesProviderModule from '..';

function getGeneralTab(container) {
  return domQuery('div[data-tab="general"]', container);
}

function getDetailsGroup(container) {
  const tab = getGeneralTab(container);
  return domQuery('div[data-group="details"]', tab);
}

function getEntry(container, entryId) {
  return domQuery('div[data-entry="' + entryId + '"]', getDetailsGroup(container));
}

function getInputField(container, entryId, inputName) {
  const selector = 'input' + (inputName ? '[name="' + inputName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
}

function getSelectField(container, entryId, selectName) {
  const selector = 'select' + (selectName ? '[name="' + selectName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
}

function getTimerDefinitionTypeField(container) {
  return getSelectField(container, 'timer-event-definition-type', 'timerDefinitionType');
}

function selectTimerDefinitionType(type, container) {
  const selectBox = getTimerDefinitionTypeField(container);
  let option = find(selectBox.options, function(o) {
    return o.value === type;
  });
  option.selected = 'selected';
  triggerEvent(selectBox, 'change');
}

function getTimerDefinitionField(container) {
  return getInputField(container, 'timer-event-definition', 'timerDefinition');
}

function isInputInvalid(node) {
  return domClasses(node).has('invalid');
}

function isHidden(node) {
  return domClasses(node).has('bpp-hidden');
}

function isInputHidden(node) {
  return isHidden(node.parentNode);
}

describe('event-sub-process-timer-start', function() {

  const diagramXML = require('./EventSubProcessTimerEventDefinitionSpec.bpmn');

  const testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  beforeEach(inject(function(commandStack, propertiesPanel) {

    let undoButton = document.createElement('button');
    undoButton.textContent = 'UNDO';

    undoButton.addEventListener('click', function() {
      commandStack.undo();
    });

    container.appendChild(undoButton);

    propertiesPanel.attachTo(container);
  }));


  describe('property controls', function() {

    let container;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));


    it('should fetch no timer definition type', inject(function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('WITHOUT_TYPE');

      // when
      selection.select(shape);

      // then
      expect(getTimerDefinitionTypeField(container).value).to.equal('');
      expect(isInputHidden(getTimerDefinitionField(container))).to.be.true;
    }));


    it('should fetch timeDuration as timer definition type', inject(function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('TIME_DURATION');

      // when
      selection.select(shape);

      // then
      expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
      expect(getTimerDefinitionField(container).value).to.equal('duration');
    }));


    it('should fetch timeCycle as timer definition type', inject(function(elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('TIME_CYCLE');

      // when
      selection.select(shape);

      // then
      expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
      expect(getTimerDefinitionField(container).value).to.equal('cycle');
    }));

  });


  describe('change timer definition type', function() {

    let container;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));

    describe('availability', function() {

      beforeEach(inject(function(elementRegistry, selection) {
        const shape = elementRegistry.get('INTERRUPTED');
        selection.select(shape);
      }));


      it('should have no <cycle> selection option', function() {

        // given
        const selectBox = getTimerDefinitionTypeField(container);

        let option = find(selectBox.options, function(o) {
          return o.value === 'cylce';
        });

        // then
        expect(option).not.to.exist;
      });

    });


    describe('from undefined', function() {

      let timerDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // when
        const shape = elementRegistry.get('WITHOUT_TYPE');
        selection.select(shape);

        const bo = getBusinessObject(shape);
        timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
      }));


      describe('to timeCycle', function() {

        beforeEach(function() {

          // when
          selectTimerDefinitionType('timeCycle', container);

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            // then
            expect(timerDefinition.timeCycle).to.be.ok;
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(timerDefinition.timeCycle).not.to.be.ok;
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(timerDefinition.timeCycle).to.be.ok;
          }));

        });

      });


      describe('to timeDuration', function() {

        beforeEach(function() {

          // when
          selectTimerDefinitionType('timeDuration', container);

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            // then
            expect(timerDefinition.timeDuration).to.be.ok;
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(timerDefinition.timeDuration).not.to.be.ok;
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(timerDefinition.timeDuration).to.be.ok;
          }));

        });

      });

    });

    describe('from timeCycle', function() {

      let timerDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // when
        const shape = elementRegistry.get('TIME_CYCLE');
        selection.select(shape);

        const bo = getBusinessObject(shape);
        timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
      }));

      describe('to undefined', function() {

        beforeEach(function() {

          // when
          selectTimerDefinitionType('', container);

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('');
          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            // then
            expect(timerDefinition.timeCycle).not.to.be.ok;
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(timerDefinition.timeCycle).to.be.ok;
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(timerDefinition.timeCycle).not.to.be.ok;
          }));

        });

      });


      describe('to timeDuration', function() {

        beforeEach(function() {

          // when
          selectTimerDefinitionType('timeDuration', container);

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
            expect(getTimerDefinitionField(container).value).to.equal('cycle');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
            expect(getTimerDefinitionField(container).value).to.equal('cycle');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
            expect(getTimerDefinitionField(container).value).to.equal('cycle');
          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            // then
            expect(timerDefinition.timeDuration).to.be.ok;
            expect(timerDefinition.timeDuration.body).to.equal('cycle');
            expect(timerDefinition.timeCycle).not.to.be.ok;
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(timerDefinition.timeDuration).not.to.be.ok;
            expect(timerDefinition.timeCycle).to.be.ok;
            expect(timerDefinition.timeCycle.body).to.equal('cycle');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(timerDefinition.timeDuration).to.be.ok;
            expect(timerDefinition.timeDuration.body).to.equal('cycle');
            expect(timerDefinition.timeCycle).not.to.be.ok;
          }));

        });

      });

    });


    describe('from timeDuration', function() {

      let timerDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // when
        const shape = elementRegistry.get('TIME_DURATION');
        selection.select(shape);

        const bo = getBusinessObject(shape);
        timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
      }));

      describe('to undefined', function() {

        beforeEach(function() {

          // when
          selectTimerDefinitionType('', container);

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('');
          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            // then
            expect(timerDefinition.timeDuration).not.to.be.ok;
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(timerDefinition.timeDuration).to.be.ok;
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(timerDefinition.timeDuration).not.to.be.ok;
          }));

        });

      });


      describe('to timeCycle', function() {

        beforeEach(function() {

          // when
          selectTimerDefinitionType('timeCycle', container);

        });

        describe('in the DOM', function() {

          it('should execute', function() {

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
            expect(getTimerDefinitionField(container).value).to.equal('duration');
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
            expect(getTimerDefinitionField(container).value).to.equal('duration');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
            expect(getTimerDefinitionField(container).value).to.equal('duration');
          }));

        });


        describe('on the business object', function() {

          it('should execute', function() {

            // then
            expect(timerDefinition.timeCycle).to.be.ok;
            expect(timerDefinition.timeCycle.body).to.equal('duration');
            expect(timerDefinition.timeDuration).not.to.be.ok;
          });


          it('should undo', inject(function(commandStack) {

            // when
            commandStack.undo();

            // then
            expect(timerDefinition.timeCycle).not.to.be.ok;
            expect(timerDefinition.timeDuration).to.be.ok;
            expect(timerDefinition.timeDuration.body).to.equal('duration');
          }));


          it('should redo', inject(function(commandStack) {

            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(timerDefinition.timeCycle).to.be.ok;
            expect(timerDefinition.timeCycle.body).to.equal('duration');
            expect(timerDefinition.timeDuration).not.to.be.ok;
          }));

        });

      });

    });

  });


  describe('change timer definition', function() {

    let container;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));

    describe('of time duration', function() {

      let input, timeDuration;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('TIME_DURATION');
        selection.select(shape);

        const bo = getBusinessObject(shape);
        const timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
        timeDuration = timerDefinition.timeDuration;

        input = getTimerDefinitionField(container);

        // when
        triggerValue(input, 'foo', 'change');
      }));

      describe('in the DOM', function() {

        it('should execute', function() {

          // then
          expect(input.value).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(input.value).to.equal('duration');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(input.value).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {

          // then
          expect(timeDuration.body).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(timeDuration.body).to.equal('duration');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(timeDuration.body).to.equal('foo');
        }));

      });

    });


    describe('of time cycle', function() {

      let input, timeCycle;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        const shape = elementRegistry.get('TIME_CYCLE');
        selection.select(shape);

        const bo = getBusinessObject(shape);
        const timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
        timeCycle = timerDefinition.timeCycle;

        input = getTimerDefinitionField(container);

        // when
        triggerValue(input, 'foo', 'change');
      }));

      describe('in the DOM', function() {

        it('should execute', function() {

          // then
          expect(input.value).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(input.value).to.equal('cycle');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(input.value).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {

          // then
          expect(timeCycle.body).to.equal('foo');
        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(timeCycle.body).to.equal('cycle');
        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(timeCycle.body).to.equal('foo');
        }));

      });

    });

  });


  describe('validation', function() {

    it('should set timer event definition field as invalid', inject(function(propertiesPanel, elementRegistry, selection) {

      // given
      const shape = elementRegistry.get('TIME_CYCLE');
      selection.select(shape);

      const container = propertiesPanel._container;
      const input = getTimerDefinitionField(container);

      // when
      triggerValue(input, '', 'change');

      // then
      expect(isInputInvalid(input)).to.be.true;
    }));

  });

});