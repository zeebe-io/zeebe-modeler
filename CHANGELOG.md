# Changelog

All notable changes to the [Zeebe Modeler](https://github.com/zeebe-io/zeebe-modeler) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.11.0
* `FEAT`: use improved I/O mapping component ([#265](https://github.com/zeebe-io/zeebe-modeler/issues/265))
* `FEAT`: support and allow editing propagateAllChildVariables of CallActivities ([#252](https://github.com/zeebe-io/zeebe-modeler/issues/252))
* `FEAT`: implement toggle switch for propagateAllChildVariables setting ([#267](https://github.com/zeebe-io/zeebe-modeler/issues/267))
* `FIX`: add missing class to input clear button in properties panel ([#268](https://github.com/zeebe-io/zeebe-modeler/issues/268))
* `FEAT`: integrate zeebe-bpmn-moddle extension ([#274](https://github.com/zeebe-io/zeebe-modeler/pull/274))

## 0.10.0

* `FEAT`: disallow non-blank start events inside embedded sub process ([#69](https://github.com/zeebe-io/zeebe-modeler/issues/69))
* `FEAT`: allow expressions for task definitions ([#240](https://github.com/zeebe-io/zeebe-modeler/pull/240))
* `FEAT`: allow configuration of outputMappings for all bpmn:Event shapes ([#242](https://github.com/zeebe-io/zeebe-modeler/issues/242))
* `FEAT`: change application icon ([#220](https://github.com/zeebe-io/zeebe-modeler/issues/220))
* `CHORE`: migrate to Zeebe node client v0.23 ([#230](https://github.com/zeebe-io/zeebe-modeler/issues/230))
* `CHORE`: extract Zeebe moddle extension to separate module ([#107](https://github.com/zeebe-io/zeebe-modeler/issues/107))
* `CHORE`: update foundation to Camunda Modeler v4.2 ([#241](https://github.com/zeebe-io/zeebe-modeler/issues/241))

## 0.9.1

* `FIX`: prevent flickering on auth change ([#208](https://github.com/zeebe-io/zeebe-modeler/issues/208))
* `FIX`: use user-provided deployment name ([#215](https://github.com/zeebe-io/zeebe-modeler/issues/215))
* `FIX`: fix Camunda Cloud connection error ([#216](https://github.com/zeebe-io/zeebe-modeler/issues/216))
* `CHORE`: refactor connection checking ([#214](https://github.com/zeebe-io/zeebe-modeler/issues/214))
* `CHORE`: log Zeebe API errors ([#217](https://github.com/zeebe-io/zeebe-modeler/issues/217))

## 0.9.0

* `FEAT`: add support for error end events ([#162](https://github.com/zeebe-io/zeebe-modeler/issues/162))
* `FEAT`: remove support for modeling collapsed sub processes ([#94](https://github.com/zeebe-io/zeebe-modeler/issues/94))
* `FEAT`: ability to set correlation key for message event sub processes ([#151](https://github.com/zeebe-io/zeebe-modeler/issues/151))
* `FEAT`: deploy diagrams from the Modeler ([#53](https://github.com/zeebe-io/zeebe-modeler/issues/53))
* `FEAT`: start process instances from the Modeler ([#177](https://github.com/zeebe-io/zeebe-modeler/issues/177))
* `FIX`: align timer event definition options in the properties panel ([#156](https://github.com/zeebe-io/zeebe-modeler/issues/156))
* `CHORE`: notarize application artifacts ([#148](https://github.com/zeebe-io/zeebe-modeler/issues/148))
* `CHORE`: update foundation to Camunda Modeler `v4-alpha.1` ([#187](https://github.com/zeebe-io/zeebe-modeler/issues/187))

## 0.8.0

* `FEAT`: add support for non-execution relevant BPMN symbols ([#112](https://github.com/zeebe-io/zeebe-modeler/issues/112))
* `FEAT`: align Palette visually with Camunda Modeler ([#113](https://github.com/zeebe-io/zeebe-modeler/issues/113))
* `FEAT`: align Context Pad visually with Camunda Modeler ([#114](https://github.com/zeebe-io/zeebe-modeler/issues/114))
* `FEAT`: align Replace Menu visually with Camunda Modeler ([#115](https://github.com/zeebe-io/zeebe-modeler/issues/115))
* `FEAT`: align Properties Panel visually with Camunda Modeler ([#116](https://github.com/zeebe-io/zeebe-modeler/issues/116))
* `FEAT`: add support for call activities ([#118](https://github.com/zeebe-io/zeebe-modeler/issues/118))
* `FIX`: fix copy and pasting to new diagrams ([#134](https://github.com/zeebe-io/zeebe-modeler/issues/134))
* `CHORE`: remove payload mapping support ([#138](https://github.com/zeebe-io/zeebe-modeler/issues/138))
* `CHORE`: update foundation to Camunda Modeler `v3.4` ([#126](https://github.com/zeebe-io/zeebe-modeler/pull/126))

## 0.7.0

* `FEAT`: add feature parity with Zeebe 0.21.0 ([#87](https://github.com/zeebe-io/zeebe-modeler/issues/87))
* `FIX`: fix task definition validation ([`1f115`](https://github.com/zeebe-io/zeebe-modeler/commit/1f115b3e3491320fc1e4f1806d57b20a20b3c7e6))
* `FIX`: restrict context pad for labels ([#104](https://github.com/zeebe-io/zeebe-modeler/issues/104))
* `FIX`: draw connections after context pad dragging ([#110](https://github.com/zeebe-io/zeebe-modeler/issues/110))
* `CHORE`: properly escape HTML entities ([#83](https://github.com/zeebe-io/zeebe-modeler/issues/83))
* `CHORE`: update foundation to Camunda Modeler `v3.3.2` ([#84](https://github.com/zeebe-io/zeebe-modeler/pull/84))

## 0.6.2

_Republish of `v0.6.0` with build error fixed._

## 0.6.1

_Republish of `v0.6.0` with actual changelog._

## 0.6.0

* `FEAT`: add feature parity with Zeebe 0.16.0 ([#62](https://github.com/zeebe-io/zeebe-modeler/pull/62))
* `CHORE`: update foundation to Camunda Modeler `v3.0.0-beta.2`

## ...

Check `git log` for earlier history.
