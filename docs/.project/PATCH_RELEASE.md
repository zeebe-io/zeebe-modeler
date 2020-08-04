# Patch Release

__[Draft a patch release.](https://github.com/zeebe-io/zeebe-modeler/issues/new?title=Release%20Zeebe%20Modeler%20vX.X.X&body=%23%23%20What%20is%20inside%3F%0A%0A%2A%20...%0A%2A%20...%0A%2A%20...%0A%0A%0A%23%23%20Release%20Checklist%0A%0A_To%20be%20done%20immediately%20after%20creating%20this%20issue._%0A%0A%2A%20%5B%20%5D%20assign%20release%20manager%20role%0A%0A_To%20be%20done%20prior%20to%20the%20release%20day%20to%20prepare%20and%20build%20the%20release._%0A%0A%2A%20%5B%20%5D%20make%20sure%20dependencies%20are%20released%20%28%60rm%20-rf%20node_modules%20%26%26%20npm%20i%20%26%26%20npm%20run%20all%60%20works%29%0A%20%20%20%20%2A%20%60bpmn-js%60%2C%20%60dmn-js%60%2C%20%60cmmn-js%60%2C%20%60%2A-properties-panel%60%2C%20%60%2A-moddle%60%2C%20...%0A%2A%20%5B%20%5D%20close%20all%20issues%20which%20are%20solved%20by%20dependency%20updates%0A%2A%20%5B%20%5D%20smoke%20test%20to%20verify%20all%20diagrams%20can%20be%20created%0A%2A%20%5B%20%5D%20update%20CHANGELOG%0A%2A%20%5B%20%5D%20semantic%20release%20%28%60npm%20run%20release%60%29%2C%20cf.%20%5Brelease%20schema%5D%28https%3A%2F%2Fgithub.com%2Fbpmn-io%2Finternal-docs%2Ftree%2Fmaster%2Frelease-schema%29%0A%2A%20%5B%20%5D%20wait%20for%20%5BTravis%5D%28https%3A%2F%2Ftravis-ci.com%2Fzeebe-io%2Fzeebe-modeler%29%20to%20build%20the%20release%0A%2A%20%5B%20%5D%20prepare%20a%20list%20of%20what%20was%20changed%20or%20needs%20to%20be%20tested%0A%2A%20%5B%20%5D%20execute%20integration%20test%2C%20verifying%20fixed%20things%20are%20actually%20fixed%0A%2A%20%5B%20%5D%20%5Boptional%5D%20trigger%20QA%20for%20fuzzy%20testing%0A%0A_To%20be%20done%20on%20release%20day%20to%20announce%20the%20release%20and%20making%20it%20publically%20available._%0A%0A%2A%20%5B%20%5D%20publish%20release%20on%20%5BGithub%20Releases%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Freleases%29%0A%2A%20%5B%20%5D%20close%20%5Bcurrent%20milestone%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Fmilestones%29&labels=release)__

## Template

A list of things to perform to cut a Zeebe Modeler patch release.

```markdown
## What is inside?

* ...
* ...
* ...


## Release Checklist

_To be done immediately after creating this issue._

* [ ] assign release manager role

_To be done prior to the release day to prepare and build the release._

* [ ] make sure dependencies are released (`rm -rf node_modules && npm i && npm run all` works)
    * `bpmn-js`, `dmn-js`, `cmmn-js`, `*-properties-panel`, `*-moddle`, ...
* [ ] close all issues which are solved by dependency updates
* [ ] smoke test to verify all diagrams can be created
* [ ] update CHANGELOG
* [ ] semantic release (`npm run release`), cf. [release schema](https://github.com/bpmn-io/internal-docs/tree/master/release-schema)
* [ ] wait for [Travis](https://travis-ci.com/zeebe-io/zeebe-modeler) to build the release
* [ ] prepare a list of what was changed or needs to be tested
* [ ] execute integration test, verifying fixed things are actually fixed
* [ ] [optional] trigger QA for fuzzy testing

_To be done on release day to announce the release and making it publically available._

* [ ] publish release on [Github Releases](https://github.com/zeebe-io/zeebe-modeler/releases)
* [ ] close [current milestone](https://github.com/zeebe-io/zeebe-modeler/milestones)
```

You may create a blank issue and copy the template into it.