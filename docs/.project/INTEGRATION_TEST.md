> __Note:__ If possible, execute the integration test on our [released artifacts](https://github.com/zeebe-io/zeebe-modeler/releases).


# Integration Test

We use a number of pre-defined steps to ensure the stability of our releases through integration tests.

__Target:__ Perform tests on nightly builds on supported platforms.


### Test Procedure

* [ ] fetch [latest release/nightly](https://github.com/zeebe-io/zeebe-modeler/releases)
* [ ] click like crazy (see [below](#test-checklist))


### Test Checklist

Manual integration tests:

#### BPMN Modeling

* [ ] create a new BPMN diagram
* [ ] build [this diagram](./test.bpmn.png) from scratch
* [ ] save file on disk as `test.bpmn`
* [ ] save file with other file name on disk
* [ ] export as SVG
* [ ] export as PNG
* [ ] export as JPG
* [ ] SVG, PNG and JPG exports open in browser

##### Copy/Paste

* [ ] create a new diagram
* [ ] `CTRL + A` + `CTRL + C` in previously created diagram
* [ ] remove start event in empty diagram
* [ ] `CTRL + V` in empty diagram pastes all contents

##### properties panel

* [ ] configure service task in properties panel
* [ ] add `async:before`
* [ ] add execution listener
* [ ] add input mapping
* [ ] verify results in XML tab

##### Keep implementation Details (Copy/Paste and Morph)

Based on the [test diagram](./test.bpmn.png):

* [ ] Add Form configuration (FormField + FormData) to "Inspect Invoice" UserTask
    * [ ] Copy / Paste task; properties are kept
    * [ ] Change task to ServiceTask; properties are gone from XML
    * [ ] Undo last step `CTRL + Z`; properties are back
    * [ ] Redo last step `CTRL + Y`; Task changed to Service Task without form properties
* [ ] Add Properties, Input/Output Mapping, `asyncBefore`, Retry Time Cycle and implementation to "Check" ServiceTask
    * [ ] Copy / Paste task; properties are kept
    * [ ] Change task to Send Task; properties are kept
    * [ ] Change task to UserTask; implementation property is gone from XML (except Retry Time Cycle, Input/output Mapping and `asyncBefore`)


#### FS integration (platform specific)

* [ ] external change detection works
    * [ ] change file in external editor
    * [ ] focus editor with file open
    * [ ] message to reload displays
* [ ] double click in FS opens file in editor (existing instance _?_)
    * [ ] `.bpmn`


#### Error Handling

* [ ] Open [`broken.bpmn`](./broken.bpmn) and verify a proper error message is shown (_No diagram to display_)


#### Installers (platform specific)

* [ ] MacOS
    * [ ] [Downloading archive](https://github.com/zeebe-io/zeebe-modeler/releases), extracting and starting application works
    * [ ] [Downloading DMG](https://github.com/zeebe-io/zeebe-modeler/releases), installing and starting it works


#### Other (platform specific)

* [ ] key bindings work (Mac = CMD, CMD+SHIFT+Z, Other = CTRL)
* [ ] restore workspace on reopen (diagrams, properties panel)
* [ ] drag and drop
* [ ] icons are present
* [ ] OS specific menus are being displayed
* [ ] menu bar (icons, correctly disabled + enabled)
* [ ] correct modeler version displayed in about menu
