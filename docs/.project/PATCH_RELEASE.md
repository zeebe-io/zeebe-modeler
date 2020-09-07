# Patch Release

__[Draft a patch release.](https://github.com/zeebe-io/zeebe-modeler/issues/new?body=%23%23+What+is+inside%3F%0A%0A*+...%0A*+...%0A*+...%0A%0A%0A%23%23+Release+Checklist%0A%0A_To+be+done+immediately+after+creating+this+issue._%0A%0A*+%5B+%5D+assign+release+manager+role%0A%0A_To+be+done+prior+to+the+release+day+to+prepare+and+build+the+release._%0A%0A*+%5B+%5D+make+sure+changes+in+upstream+libraries+are+merged+and+released%0A++++*+%60bpmn-js%60%2C+%60dmn-js%60%2C+%60cmmn-js%60%2C+%60*-properties-panel%60%2C+%60*-moddle%60%2C+...%0A*+%5B+%5D+make+sure+dependencies+to+upstream+libraries+are+updated+and+can+be+installed+%28%60rm+-rf+node_modules+%26%26+npm+i+%26%26+npm+run+all%60+works%29%0A*+%5B+%5D+close+all+issues+which+are+solved+by+dependency+updates%0A*+%5B+%5D+smoke+test+to+verify+all+diagrams+can+be+created%0A*+%5B+%5D+update+CHANGELOG%0A*+%5B+%5D+semantic+release+%28%60npm+run+release%60%29%2C+cf.+%5Brelease+schema%5D%28https%3A%2F%2Fgithub.com%2Fbpmn-io%2Finternal-docs%2Ftree%2Fmaster%2Frelease-schema%29%0A*+%5B+%5D+wait+for+%5BTravis%5D%28https%3A%2F%2Ftravis-ci.com%2Fzeebe-io%2Fzeebe-modeler%29+to+build+the+release%0A*+%5B+%5D+prepare+a+list+of+what+was+changed+or+needs+to+be+tested%0A*+%5B+%5D+execute+integration+test%2C+verifying+fixed+things+are+actually+fixed%0A*+%5B+%5D+%5Boptional%5D+trigger+QA+for+fuzzy+testing%0A%0A_To+be+done+on+release+day+to+announce+the+release+and+making+it+publically+available._%0A%0A*+%5B+%5D+publish+release+on+%5BGithub+Releases%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Freleases%29%0A*+%5B+%5D+close+%5Bcurrent+milestone%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Fmilestones%29&title=Release+Zeebe+Modeler+vX.X.X&labels=release)__ or head over to:
* [alpha release documentation](./ALPHA_RELEASE.md), or
* [minor and major release documentation](./RELEASE.md).

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

* [ ] make sure changes in upstream libraries are merged and released
    * `bpmn-js`, `dmn-js`, `cmmn-js`, `*-properties-panel`, `*-moddle`, ...
* [ ] make sure dependencies to upstream libraries are updated and can be installed (`rm -rf node_modules && npm i && npm run all` works)
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
