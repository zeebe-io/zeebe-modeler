import Ids from 'ids';

import zeebeDiagram from './tabs/zeebe/diagram.bpmn';

import EmptyTab from './EmptyTab';

import { forEach } from 'min-dash';

import parseDiagramType from './util/parseDiagramType';

const ids = new Ids([ 32, 36, 1 ]);
const createdByType = {};

const noopProvider = {
  getComponent() {
    return null;
  },
  getInitialContents() {
    return null;
  }
};

const ENCODING_BASE64 = 'base64',
      ENCODING_UTF8 = 'utf8';

const EXPORT_JPG = {
  name: 'JPG',
  encoding: ENCODING_BASE64,
  extensions: [ '.jpg' ]
};

const EXPORT_PNG = {
  name: 'PNG',
  encoding: ENCODING_BASE64,
  extensions: [ '.png' ]
};

const EXPORT_SVG = {
  name: 'SVG',
  encoding: ENCODING_UTF8,
  extensions: [ '.svg' ]
};

/**
 * A provider that allows us to customize available tabs.
 */
export default class TabsProvider {

  constructor() {

    this.providers = {
      empty: {
        getComponent() {
          return EmptyTab;
        }
      },
      bpmn: {
        name: 'BPMN',
        encoding: ENCODING_UTF8,
        exports: {
          jpg: EXPORT_JPG,
          png: EXPORT_PNG,
          svg: EXPORT_SVG
        },
        extensions: [ 'bpmn', 'xml' ],
        getComponent(options) {
          return import('./tabs/zeebe');
        },
        getInitialContents(options) {
          return zeebeDiagram;
        },
        getHelpMenu() {
          return [{
            label: 'Zeebe Modeling Tutorial',
            action: 'https://docs.zeebe.io/bpmn-modeler/introduction.html'
          }];
        },
        getNewFileMenu() {
          return [{
            label: 'BPMN Diagram',
            accelerator: 'CommandOrControl+T',
            action: 'create-bpmn-diagram'
          }];
        }
      }
    };

  }

  getProviderNames() {
    const names = [];

    forEach(this.providers, (provider) => {
      const { name } = provider;

      if (name) {
        names.push(name);
      }
    });

    return names;
  }

  getProviders() {
    return this.providers;
  }

  hasProvider(type) {
    return !!this.providers[type];
  }

  getProvider(type) {
    return (this.providers[type] || noopProvider);
  }

  getTabComponent(type, options) {
    return this.getProvider(type).getComponent(options);
  }

  getInitialFileContents(type, options) {
    return this.getProvider(type).getInitialContents(options);
  }

  createFile(type, options) {

    const counter = (
      type in createdByType
        ? (++createdByType[type])
        : (createdByType[type] = 1)
    );

    const name = `diagram_${counter}.${type}`;

    const rawContents = this.getInitialFileContents(type, options);

    const contents = rawContents && rawContents.replace('{{ ID }}', ids.next());

    return {
      name,
      contents,
      path: null
    };
  }

  createTab(type, options) {

    const file = this.createFile(type, options);

    return this.createTabForFile(file);
  }

  getTabType(file) {

    const {
      name,
      contents
    } = file;

    const typeFromExtension = name.substring(name.lastIndexOf('.') + 1).toLowerCase();

    if (this.hasProvider(typeFromExtension)) {
      return typeFromExtension;
    }

    const typeFromContents = parseDiagramType(contents);

    if (typeFromContents && this.hasProvider(typeFromContents)) {
      return typeFromContents;
    }

    return null;
  }

  createTabForFile(file) {

    const id = ids.next();

    const type = this.getTabType(file);

    if (!type) {
      return null;
    }

    return {
      file,
      id,
      get name() {
        return this.file.name;
      },
      set name(newName) {
        this.file.name = newName;
      },
      get title() {
        return this.file.path || 'unsaved';
      },
      type
    };

  }

}