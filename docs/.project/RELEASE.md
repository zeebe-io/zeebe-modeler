# Release

__[Draft a release](https://github.com/zeebe-io/zeebe-modeler/issues/new?body=%23%23%20What%27s%20inside%3F%0A%0A%2A%20...%0A%2A%20...%0A%2A%20...%0A%0A%0A%23%23%20Release%20Checklist%0A%0ANote%3A%20The%20release%20manager%20in%20charge%20will%20be%20determined%20by%20the%20Camunda%20Modeler%20Release%20Manager%20%28cf.%20%5BCamunda%20Modeler%20Release%20Checklist%5D%28https%3A%2F%2Fgithub.com%2Fcamunda%2Fcamunda-modeler%2Fblob%2Fmaster%2Fdocs%2F.project%2FRELEASE.md%29%29%0A%0A_To%20be%20done%20immediately%20after%20creating%20this%20issue._%0A%0A%2A%20%5B%20%5D%20put%20up%20code%20freeze%20appointment%20in%20calendar%20%28include%20%60modeling%60%2C%20%60qa%60%2C%20%60infra%60%2C%20%60zeebe%60%20and%20%60Team-Support%60%29%0A%2A%20%5B%20%5D%20put%20up%20release%20appointment%20in%20calendar%20%28include%20%60modeling%60%20and%20Marketing%20%5BCharley%20Mann%20%26%20Christopher%20Rogers%5D%29%0A%0A_To%20be%20done%20after%20code%20freeze%20and%20prior%20to%20the%20release%20day%20to%20prepare%20and%20build%20the%20release._%0A%0A%2A%20%5B%20%5D%20make%20sure%20dependencies%20are%20released%20%28%60rm%20-rf%20node_modules%20%26%26%20npm%20i%20%26%26%20npm%20run%20all%60%20works%29%0A%20%20%20%20%2A%20%60bpmn-js%60%2C%20%60dmn-js%60%2C%20%60cmmn-js%60%2C%20%60%2A-properties-panel%60%2C%20%60%2A-moddle%60%2C%20...%0A%2A%20%5B%20%5D%20close%20all%20issues%20which%20are%20solved%20by%20dependency%20updates%0A%2A%20%5B%20%5D%20verify%20%60develop%60%20is%20up%20to%20date%20with%20%60master%60%3A%20%60git%20checkout%20master%20%26%26%20git%20pull%20%26%26%20git%20checkout%20develop%20%26%26%20git%20merge%20master%60%0A%2A%20%5B%20%5D%20smoke%20test%20to%20verify%20all%20diagrams%20can%20be%20created%0A%2A%20%5B%20%5D%20update%20CHANGELOG%0A%2A%20%5B%20%5D%20merge%20to%20master%3A%20%60git%20checkout%20master%20%26%26%20git%20merge%20develop%60%0A%2A%20%5B%20%5D%20create%20release%20candidate%20%28%60npm%20run%20release%60%29%2C%20e.g.%20v1.0.0-rc.0%0A%20%20%20%20%2A%20%5B%20%5D%20wait%20for%20%5BTravis%5D%28https%3A%2F%2Ftravis-ci.com%2Fzeebe-io%2Fzeebe-modeler%29%20to%20build%20the%20executables%0A%2A%20%5B%20%5D%20execute%20%5Bintegration%20test%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Fblob%2Fmaster%2Fdocs%2F.project%2FINTEGRATION_TEST.md%29%20on%20%5Breleased%20artifacts%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Freleases%29%0A%20%20%20%20%2A%20%5B%20%5D%20Works%20on%20Linux%0A%20%20%20%20%2A%20%5B%20%5D%20Works%20on%20Mac%0A%20%20%20%20%2A%20%5B%20%5D%20Works%20on%20Windows%0A%2A%20%5B%20%5D%20trigger%20QA%20for%20fuzzy%20testing%0A%0A_To%20be%20done%20after%20integration%20test%20was%20successful%20or%20if%20not%20issues%20were%20fixed._%0A%0A%2A%20%5B%20%5D%20create%20release%20%28%60npm%20run%20release%60%29%2C%20cf.%20%5Brelease%20schema%5D%28https%3A%2F%2Fgithub.com%2Fbpmn-io%2Finternal-docs%2Ftree%2Fmaster%2Frelease-schema%29%0A%20%20%20%20%2A%20%5B%20%5D%20wait%20for%20%5BTravis%5D%28https%3A%2F%2Ftravis-ci.com%2Fzeebe-io%2Fzeeber-modeler%29%20to%20build%20the%20executables%0A%0A_To%20be%20done%20on%20release%20day%20to%20announce%20the%20release%20and%20making%20it%20publically%20available._%0A%0A%2A%20%5B%20%5D%20publish%20release%20on%20%5BGithub%20Releases%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Freleases%29%0A%2A%20%5B%20%5D%20write%20blog%20post%20on%20%5BZeebe%20Blog%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe.io%2Ftree%2Fmaster%2Fcontent%2Fblog%29%2C%20if%20applicable%0A%2A%20%5B%20%5D%20spread%20the%20word%0A%20%20%20%20%2A%20%5B%20%5D%20send%20%5Brelease%20notice%20email%5D%28https%3A%2F%2Fgithub.com%2Fbpmn-io%2Finternal-docs%2Fblob%2Fmaster%2Fzeebe-modeler%2FREADME.md%23release-notice-email%29%0A%20%20%20%20%2A%20%5B%20%5D%20tweet%0A%2A%20%5B%20%5D%20close%20%5Bcurrent%20milestone%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Fmilestones%29&title=Release+Zeebe+Modeler+vX.X.X&labels=release)__ or head over to [patch release documentation](./PATCH_RELEASE.md).


## Template

A list of activities to perform to cut a Zeebe Modeler minor or major release.

For patch releases turn to [this documentation](./PATCH_RELEASE.md).

```markdown
## What's inside?

* ...
* ...
* ...


## Release Checklist

Note: The release manager in charge will be determined by the Camunda Modeler Release Manager (cf. [Camunda Modeler Release Checklist](https://github.com/camunda/camunda-modeler/blob/master/docs/.project/RELEASE.md))

_To be done immediately after creating this issue._

* [ ] put up code freeze appointment in calendar (include `modeling`, `qa`, `infra`, `zeebe` and `Team-Support`)
* [ ] put up release appointment in calendar (include `modeling` and Marketing [Charley Mann & Christopher Rogers])

_To be done after code freeze and prior to the release day to prepare and build the release._

* [ ] make sure dependencies are released (`rm -rf node_modules && npm i && npm run all` works)
    * `bpmn-js`, `dmn-js`, `cmmn-js`, `*-properties-panel`, `*-moddle`, ...
* [ ] close all issues which are solved by dependency updates
* [ ] verify `develop` is up to date with `master`: `git checkout master && git pull && git checkout develop && git merge master`
* [ ] smoke test to verify all diagrams can be created
* [ ] update CHANGELOG
* [ ] merge to master: `git checkout master && git merge develop`
* [ ] create release candidate (`npm run release`), e.g. v1.0.0-rc.0
    * [ ] wait for [Travis](https://travis-ci.com/zeebe-io/zeebe-modeler) to build the executables
* [ ] execute [integration test](https://github.com/zeebe-io/zeebe-modeler/blob/master/docs/.project/INTEGRATION_TEST.md) on [released artifacts](https://github.com/zeebe-io/zeebe-modeler/releases)
    * [ ] Works on Linux
    * [ ] Works on Mac
    * [ ] Works on Windows
* [ ] trigger QA for fuzzy testing

_To be done after integration test was successful or if not issues were fixed._

* [ ] create release (`npm run release`), cf. [release schema](https://github.com/bpmn-io/internal-docs/tree/master/release-schema)
    * [ ] wait for [Travis](https://travis-ci.com/zeebe-io/zeeber-modeler) to build the executables

_To be done on release day to announce the release and making it publically available._

* [ ] publish release on [Github Releases](https://github.com/zeebe-io/zeebe-modeler/releases)
* [ ] write blog post on [Zeebe Blog](https://github.com/zeebe-io/zeebe.io/tree/master/content/blog), if applicable
* [ ] spread the word
    * [ ] send [release notice email](https://github.com/bpmn-io/internal-docs/blob/master/zeebe-modeler/README.md#release-notice-email)
    * [ ] tweet
* [ ] close [current milestone](https://github.com/zeebe-io/zeebe-modeler/milestones)
```

You may create a blank issue and copy the template into it.