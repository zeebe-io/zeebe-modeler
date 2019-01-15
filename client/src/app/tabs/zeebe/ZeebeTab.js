import ZeebeEditor from './ZeebeEditor';
import XMLEditor from '../xml';

import { createTab } from '../EditorTab';


const ZeebeTab = createTab('ZeebeTab', [
  {
    type: 'bpmn',
    editor: ZeebeEditor,
    defaultName: 'Diagram'
  },
  {
    type: 'xml',
    editor: XMLEditor,
    isFallback: true,
    defaultName: 'XML'
  }
]);

export default ZeebeTab;