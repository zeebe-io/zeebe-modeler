# Alpha Release

__[Draft an alpha release](https://github.com/zeebe-io/zeebe-modeler/issues/new?body=%23%23+What+is+inside%3F%0A%0A*+...%0A*+...%0A*+...%0A%0A%0A%23%23+Release+Checklist%0A%0ANote%3A+The+release+manager+in+charge+will+be+determined+by+the+Camunda+Modeler+Release+Manager+%28cf.+%5BCamunda+Modeler+Release+Checklist%5D%28https%3A%2F%2Fgithub.com%2Fcamunda%2Fcamunda-modeler%2Fblob%2Fmaster%2Fdocs%2F.project%2FRELEASE.md%29%29%0A%0A_To+be+done+immediately+after+creating+this+issue._%0A%0A*+%5B+%5D+put+up+code+freeze+appointment+in+calendar+%28include+%60modeling%60%2C+%60qa%60%2C+%60zeebe%60%2C+%60infra%60%2C+and+%60Team-Support%60%29%0A%0A_To+be+done+after+code+freeze+and+prior+to+the+release+day+to+prepare+and+build+the+release._%0A%0A*+%5B+%5D+make+sure+changes+in+upstream+libraries+are+merged+and+released%0A++++*+%60bpmn-js%60%2C+%60dmn-js%60%2C+%60cmmn-js%60%2C+%60*-properties-panel%60%2C+%60*-moddle%60%2C+...%0A*+%5B+%5D+make+sure+dependencies+to+upstream+libraries+are+updated+and+can+be+installed+%28%60rm+-rf+node_modules+%26%26+npm+i+%26%26+npm+run+all%60+works%29%0A*+%5B+%5D+close+all+issues+which+are+solved+by+dependency+updates%0A*+%5B+%5D+verify+%60develop%60+is+up+to+date+with+%60master%60%3A+%60git+checkout+master+%26%26+git+pull+%26%26+git+checkout+develop+%26%26+git+merge+master%60%0A*+%5B+%5D+smoke+test+to+verify+all+diagrams+can+be+created%0A*+%5B+%5D+update+CHANGELOG%0A*+%5B+%5D+semantic+release+%28%60npm+run+release%60%29+from+%60develop%60%2C+cf.+%5Brelease+schema%5D%28https%3A%2F%2Fgithub.com%2Fbpmn-io%2Finternal-docs%2Ftree%2Fmaster%2Frelease-schema%29%0A*+%5B+%5D+wait+for+%5BTravis%5D%28https%3A%2F%2Ftravis-ci.com%2Fzeebe-io%2Fzeebe-modeler%29+to+build+the+release%0A*+%5B+%5D+execute+%5Bintegration+test%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Fblob%2Fmaster%2Fdocs%2F.project%2FINTEGRATION_TEST.md%29+on+%5Breleased+artifacts%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Freleases%29%0A++++*+%5B+%5D+Works+on+Linux%0A++++*+%5B+%5D+Works+on+Mac%0A++++*+%5B+%5D+Works+on+Windows%0A*+%5B+%5D+trigger+QA+for+fuzzy+testing%0A%0A_To+be+done+on+release+day+to+announce+the+release+and+making+it+publically+available._%0A%0A*+%5B+%5D+publish+release+on+%5BGithub+Releases%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Freleases%29%0A*+%5B+%5D+write+blog+post+on+%5BZeebe+Blog%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe.io%2Ftree%2Fmaster%2Fcontent%2Fblog%29%2C+if+applicable%0A*+%5B+%5D+spread+the+word%0A++++*+%5B+%5D+send+%5Brelease+notice+email%5D%28https%3A%2F%2Fgithub.com%2Fbpmn-io%2Finternal-docs%2Fblob%2Fmaster%2Fzeebe-modeler%2FREADME.md%23release-notice-email%29%0A++++*+%5B+%5D+tweet%0A*+%5B+%5D+close+%5Bcurrent+milestone%5D%28https%3A%2F%2Fgithub.com%2Fzeebe-io%2Fzeebe-modeler%2Fmilestones%29&title=Release+Zeebe+Modeler+vX.X.X-alphaX&labels=release)__ or head over to:
* [patch release documentation](./PATCH_RELEASE.md), or
* [minor and major release documentation](./RELEASE.md).


## Template

A list of activities to perform to cut a Zeebe Modeler alpha release.

For minor or major releases turn to [this documentation](./RELEASE.md), while for patch releases turn to [that documentation](./PATCH_RELEASE.md).

```markdown
## What is inside?

* ...
* ...
* ...


## Release Checklist

Note: The release manager in charge will be determined by the Camunda Modeler Release Manager (cf. [Camunda Modeler Release Checklist](https://github.com/camunda/camunda-modeler/blob/master/docs/.project/RELEASE.md))

_To be done immediately after creating this issue._

* [ ] put up code freeze appointment in calendar (include `modeling`, `qa`, `zeebe`, `infra`, and `Team-Support`)

_To be done after code freeze and prior to the release day to prepare and build the release._

* [ ] make sure changes in upstream libraries are merged and released
    * `bpmn-js`, `dmn-js`, `cmmn-js`, `*-properties-panel`, `*-moddle`, ...
* [ ] make sure dependencies to upstream libraries are updated and can be installed (`rm -rf node_modules && npm i && npm run all` works)
* [ ] close all issues which are solved by dependency updates
* [ ] verify `develop` is up to date with `master`: `git checkout master && git pull && git checkout develop && git merge master`
* [ ] smoke test to verify all diagrams can be created
* [ ] update CHANGELOG
* [ ] semantic release (`npm run release`) from `develop`, cf. [release schema](https://github.com/bpmn-io/internal-docs/tree/master/release-schema)
* [ ] wait for [Travis](https://travis-ci.com/zeebe-io/zeebe-modeler) to build the release
* [ ] execute [integration test](https://github.com/zeebe-io/zeebe-modeler/blob/master/docs/.project/INTEGRATION_TEST.md) on [released artifacts](https://github.com/zeebe-io/zeebe-modeler/releases)
    * [ ] Works on Linux
    * [ ] Works on Mac
    * [ ] Works on Windows
* [ ] trigger QA for fuzzy testing

_To be done on release day to announce the release and making it publically available._

* [ ] publish release on [Github Releases](https://github.com/zeebe-io/zeebe-modeler/releases)
* [ ] write blog post on [Zeebe Blog](https://github.com/zeebe-io/zeebe.io/tree/master/content/blog), if applicable
* [ ] spread the word
    * [ ] send [release notice email](https://github.com/bpmn-io/internal-docs/blob/master/zeebe-modeler/README.md#release-notice-email)
    * [ ] tweet
* [ ] close [current milestone](https://github.com/zeebe-io/zeebe-modeler/milestones)
```

You may create a blank issue and copy the template into it.
