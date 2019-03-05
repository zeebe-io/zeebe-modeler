# Zeebe Modeler

[![Build Status](https://travis-ci.com/zeebe-io/zeebe-modeler.svg?branch=master)](https://travis-ci.com/zeebe-io/zeebe-modeler)

The visual workflow editor for [Zeebe](https://zeebe.io/) based on [bpmn.io](http://bpmn.io).

![Zeebe Modeler](docs/screenshot.png)


## Installation

#### All Platforms

[Download](https://github.com/zeebe-io/zeebe-modeler/releases), extract and execute app.

#### MacOSX

Requires [homebrew](https://brew.sh/index_de.html) and [cask](https://caskroom.github.io):

```sh
brew cask install zeebe-modeler
```


## Resources

* [Changelog](./CHANGELOG.md)
* [Download](https://github.com/zeebe-io/zeebe-modeler/releases) (see also [nightly builds](https://zeebe-modeler-nightly.s3.eu-central-1.amazonaws.com/))
* [Give Feedback](https://forum.zeebe.io/)
* [Report a Bug](https://github.com/zeebe-io/zeebe-modeler/issues/new/choose)


## Building the Application

```sh
# checkout a tag
git checkout v1.1.0

# install dependencies
npm install

# execute all checks (lint, test and build)
npm run all

# build the application to ./dist
npm run build
```


### Development Setup

Spin up the application for development, all strings attached:

```sh
npm run dev
```


## Upstream Sync

We use a `sync` task to keep up with changes in the upstream [Camunda Modeler](https://github.com/camunda/camunda-modeler) repository. Execute it via:

```sh
npm run sync
```

The synchronized upstream branch will be `master` by default. You can specify the branch (`--branch` or `-b`) or even the tag (`--tag` or `-t`) by giving the according argument.

```sh
npm run sync -- -b master
```

If no merge conflicts appeared, the synchronization task is done and the changes can be pushed remotely. If there were merge conflicts detected, the task automatically exclude unrelated files from the conflicts (e.g. changes inside `tabs/dmn/*`). Other merge conflicts must be resolved manually.


## Code of Conduct

This project adheres to the Contributor Covenant [Code of
Conduct](/CODE_OF_CONDUCT.md). By participating, you are expected to uphold
this code. Please report unacceptable behavior to
code-of-conduct@zeebe.io.


## License

MIT

Contains parts ([bpmn-js](https://github.com/bpmn-io/bpmn-js)) released under the [bpmn.io license](http://bpmn.io/license).
