'use strict';

var inherits = require('inherits');
var ReplaceMenuProvider = require('bpmn-js/lib/features/popup-menu/ReplaceMenuProvider');
var availableElements = require('./modeler-options/Options').AVAILABLE_REPLACE_ELEMENTS;
function CustomReplaceMenuProvider(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
  ReplaceMenuProvider.call(this, popupMenu, modeling, moddle, bpmnReplace, rules, translate);
};

inherits(CustomReplaceMenuProvider, ReplaceMenuProvider);

CustomReplaceMenuProvider.prototype._createEntries = function(element, replaceOptions) {
  var options = ReplaceMenuProvider.prototype._createEntries.call(this, element, replaceOptions);

  options = options.filter(function(option) {

    if (availableElements.indexOf(option.id) != -1) {
        //hier eigenen Filter aufsetzen
      return true;
    }
  });
  return options;
};

CustomReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];


module.exports = CustomReplaceMenuProvider;
