/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
  var tab = getGeneralTab(container);
  return domQuery('div[data-group="details"]', tab);
}

function getEntry(container, entryId) {
  return domQuery('div[data-entry="' + entryId + '"]', getDetailsGroup(container));
}

function getInputField(container, entryId, inputName) {
  var selector = 'input' + (inputName ? '[name="' + inputName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
}

function getSelectField(container, entryId, selectName) {
  var selector = 'select' + (selectName ? '[name="' + selectName + '"]' : '');
  return domQuery(selector, getEntry(container, entryId));
}

function getTimerDefinitionTypeField(container) {
  return getSelectField(container, 'timer-event-definition-type', 'timerDefinitionType');
}

function selectTimerDefinitionType(type, container) {
  var selectBox = getTimerDefinitionTypeField(container);
  var option = find(selectBox.options, function(o) {
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

describe('boundary-event-timer-event-properties', function() {

  var diagramXML = require('./BoundaryEventTimerEventDefinition.bpmn');

  var testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  beforeEach(inject(function(commandStack, propertiesPanel) {

    var undoButton = document.createElement('button');
    undoButton.textContent = 'UNDO';

    undoButton.addEventListener('click', function() {
      commandStack.undo();
    });

    container.appendChild(undoButton);

    propertiesPanel.attachTo(container);
  }));


  describe('property controls', function() {

    var container;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));


    it('should fetch no timer definition type', inject(function(elementRegistry, selection) {

      // given
      var shape = elementRegistry.get('WITHOUT_TYPE');

      // when
      selection.select(shape);

      // then
      expect(getTimerDefinitionTypeField(container).value).to.equal('');
      expect(isInputHidden(getTimerDefinitionField(container))).to.be.true;
    }));


    it('should fetch timeDuration as timer definition type', inject(function(elementRegistry, selection) {

      // given
      var shape = elementRegistry.get('TIME_DURATION');

      // when
      selection.select(shape);

      // then
      expect(getTimerDefinitionTypeField(container).value).to.equal('timeDuration');
      expect(getTimerDefinitionField(container).value).to.equal('duration');
    }));


    it('should fetch timeCycle as timer definition type', inject(function(elementRegistry, selection) {

      // given
      var shape = elementRegistry.get('TIME_CYCLE');

      // when
      selection.select(shape);

      // then
      expect(getTimerDefinitionTypeField(container).value).to.equal('timeCycle');
      expect(getTimerDefinitionField(container).value).to.equal('cycle');
    }));

  });


  describe('change timer definition type', function() {

    var container;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));

    describe('from undefined', function() {

      var timerDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // when
        var shape = elementRegistry.get('WITHOUT_TYPE');
        selection.select(shape);

        var bo = getBusinessObject(shape);
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

      var timerDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // when
        var shape = elementRegistry.get('TIME_CYCLE');
        selection.select(shape);

        var bo = getBusinessObject(shape);
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

      var timerDefinition;

      beforeEach(inject(function(elementRegistry, selection) {

        // when
        var shape = elementRegistry.get('TIME_DURATION');
        selection.select(shape);

        var bo = getBusinessObject(shape);
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

    var container;

    beforeEach(inject(function(propertiesPanel) {
      container = propertiesPanel._container;
    }));

    describe('of time duration', function() {

      var input, timeDuration;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        var shape = elementRegistry.get('TIME_DURATION');
        selection.select(shape);

        var bo = getBusinessObject(shape);
        var timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
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

      var input, timeCycle;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        var shape = elementRegistry.get('TIME_CYCLE');
        selection.select(shape);

        var bo = getBusinessObject(shape);
        var timerDefinition = eventDefinitionHelper.getTimerEventDefinition(bo);
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
      var shape = elementRegistry.get('TIME_CYCLE');
      selection.select(shape);

      var container = propertiesPanel._container;
      var input = getTimerDefinitionField(container);

      // when
      triggerValue(input, '', 'change');

      // then
      expect(isInputInvalid(input)).to.be.true;
    }));

  });

});