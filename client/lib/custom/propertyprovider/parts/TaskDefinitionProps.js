

var properties = require('./implementation/Headers'),
elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    is = require('bpmn-js/lib/util/ModelUtil').is;

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var extensionElementsHelper = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

module.exports = function(group, element, bpmnFactory) {

  if(!is(element, 'bpmn:ServiceTask')){
    return;
  }



	function getElements(bo, type, prop) {
		var elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
		return !prop ? elems : (elems[0] || {})[prop] || [];
	}

	function getTaskDefinition(element) {
		var bo = getBusinessObject(element);
		return (getElements(bo, 'zeebe:TaskDefinition') || [])[0];

	};


	group.entries.push(entryFactory.validationAwareTextField({
		id: 'taskDefinitionType',
		label: 'Type',
		modelProperty: 'type',

		getProperty: function(element, node) {
			return (getTaskDefinition(element, node) || {}).type;
		},

		setProperty: function(element, values, node) {
			var bo = getBusinessObject(element);
			var commands = [];


	  //extensionElemente erzeugen, falls nicht vorhanden
	  var extensionElements = bo.get('extensionElements');
	  if (!extensionElements) {
	  	extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
	  	commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
	  }


        //Task Definition erzeugen falls nicht vorhanden

        var taskDefinition = getTaskDefinition(element);

        if(!taskDefinition){
        	taskDefinition = elementHelper.createElement('zeebe:TaskDefinition', { }, extensionElements, bpmnFactory);
        	commands.push(cmdHelper.addAndRemoveElementsFromList(
        		element,
        		extensionElements,
        		'values',
        		'extensionElements',
        		[ taskDefinition ],
        		[]
        		));

        }

        commands.push(cmdHelper.updateBusinessObject(element, taskDefinition, values))


        return commands;
    },

    validate: function(element, values, node) {
    	var bo = getTaskDefinition(element, node);

    	var validation = {};
    	if (bo) {
    		var sourceValue = values.source;

    		if (sourceValue) {
    			if (utils.containsSpace(sourceValue)) {
    				validation.source = 'Type must not contain spaces';
    			}
    		}
    		else {
    			validation.source = 'ServiceTask must have a type';
    		}
    	}

    	return validation;
    }
}));

};








