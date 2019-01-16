# Release Checklist

A list of things to perform with every Zeebe Modeler release.

__Hint:__ Create a release issue and copy the template below into it.


```markdown
* [ ] make sure dependencies are released (`rm -rf node_modules && npm i && npm run all` works)
    * `bpmn-js`, `*-properties-panel`, `*-moddle`, ...
* [ ] smoke test to verify all diagrams can be created
* [ ] update CHANGELOG before releasing
* [ ] semantic release (`npm run release`)
* [ ] wait for CI infrastructure to build the release
* [ ] execute [integration test](https://github.com/zeebe-io/zeebe-modeler/blob/master/docs/.project/INTEGRATION_TEST.md) on [released artifacts](https://github.com/zeebe-io/zeebe-modeler/releases)
    * [ ] Works on Linux
    * [ ] Works on Mac
    * [ ] Works on Windows
* [ ] Publish release on [Github Releases](https://github.com/zeebe-io/zeebe-modeler/releases)
* [ ] write blog post on _?_
* [ ] spread the word
    * [ ] tweet
* [ ] Close [current milestone](https://github.com/zeebe-io/zeebe-modeler/milestones), if it exists
```
