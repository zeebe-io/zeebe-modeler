import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';

import {
  AVAILABLE_REPLACE_ELEMENTS as availableElements
} from './modeler-options/Options';

export default class CustomReplaceMenuProvider extends ReplaceMenuProvider {

  constructor(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
    super(popupMenu, modeling, moddle, bpmnReplace, rules, translate);
  }

  // For future element support!!
  _createEntries(element, replaceOptions) {
    let options = ReplaceMenuProvider.prototype._createEntries.call(this, element, replaceOptions);
    return options.filter(option => availableElements.indexOf(option.id) != -1);
  }

  _getLoopEntries(element) {
    return [];
  }

  getHeaderEntries(element) {
    return [];
  }
}

CustomReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];