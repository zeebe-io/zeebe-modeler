> __Note:__ If possible, execute the integration test on our [released artifacts](https://github.com/zeebe-io/zeebe-modeler/releases).


# Integration Test

We use a number of pre-defined steps to ensure the stability of our releases through integration tests.

__Target:__ Perform tests on nightly builds on supported platforms.


### Test Procedure

* [ ] fetch [latest release/nightly](https://github.com/zeebe-io/zeebe-modeler/releases)
* [ ] (linux only): run `$MODELER_DIR/support/xdg_register.sh`
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
* [ ] export as JPG (.jpeg extension for linux)
* [ ] SVG, PNG and JPG exports open in browser

##### Copy/Paste

* [ ] create a new diagram
* [ ] `CTRL + A` + `CTRL + C` in previously created diagram
* [ ] remove start event in empty diagram
* [ ] `CTRL + V` in empty diagram pastes all contents

##### properties panel

* [ ] configure service task in properties panel
* [ ] add input mapping
* [ ] Undo last step `CTRL + Z`; input mapping is gone
* [ ] Redo last step `CTRL + Y`; input mapping is back
* [ ] verify results in XML tab
* [ ] Copy / Paste service task; properties are kept
* [ ] Add output mapping
* [ ] Change service task to ReceiveTask; output parameters are kept    

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
