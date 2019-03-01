#!/usr/bin/env node

/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const argv = require('mri')(process.argv);

const exec = require('execa').sync;

const getVersion = require('../app/util/get-version');

const pkg = require('../app/package');

const {
  nightly,
  publish,
  config
} = argv;

// in case of --nightly, update all package versions to the
// next minor version with the nightly preid. This will
// result in app and client being versioned like `v1.2.3-nightly.0`.

const nightlyVersion = nightly && getVersion(pkg, {
  nightly: 'nightly'
});

if (nightlyVersion) {

  const publishNightlyArgs = [
    'version',
    `${nightlyVersion}`,
    '--no-git-tag-version',
    '--no-push',
    '--yes'
  ];

  console.log(`
Bumping ${pkg.name} version to ${nightlyVersion}

---

lerna ${ publishNightlyArgs.join(' ') }

---
`);

  exec('lerna', publishNightlyArgs, {
    stdio: 'inherit'
  });
}

// ensure nightly releases are named ${appName}-nightly-${...}
// this allows expert users to always fetch the nightly artifacts
// from the same url

const replaceVersion = nightly
  ? s => s.replace('${version}', 'nightly')
  : s => s;

const artifactOptions = [
  '-c.artifactName=${name}-${version}-${os}-${arch}.${ext}',
  '-c.dmg.artifactName=${name}-${version}-${os}.${ext}',
  '-c.nsis.artifactName=${name}-${version}-${os}-setup.${ext}',
  '-c.nsisWeb.artifactName=${name}-${version}-${os}-web-setup.${ext}',
  argv.compress === false && '-c.compression=store'
].filter(f => f).map(replaceVersion);

// interpret shorthand target options
// --win, --linux, --mac
const platforms = [
  argv.win ? 'win' : null,
  argv.linux ? 'linux': null,
  argv.mac ? 'mac' : null
].filter(f => f);

const platformOptions = platforms.map(p => `--${p}`);

const publishOptions = typeof publish !== undefined ? [
  `--publish=${ publish ? 'always' : 'never' }`,
  publish && nightly && '-c.publish.provider=s3',
  publish && nightly && '-c.publish.bucket=zeebe-modeler-nightly'
].filter(f => f) : [];

const signingOptions = [
  `-c.forceCodeSigning=${false}`
];

if (publish && (argv.ia32 || argv.x64)) {
  console.error('Do not override arch; is manually pinned');
  process.exit(1);
}

const archOptions = [ 'x64', 'ia32' ].filter(a => argv[a]).map(a => `--${a}`);

const args = [
  ...[ config && `-c=${config}` ].filter(f => f),
  ...archOptions,
  ...signingOptions,
  ...platformOptions,
  ...publishOptions,
  ...artifactOptions
];

console.log(`
Building ${pkg.name} distro

---

  version: ${nightlyVersion || pkg.version}
  platforms: [${ platforms.length && platforms || 'current' }]
  publish: ${publish || false}

---

electron-builder ${ args.join(' ') }
`
);

exec('electron-builder', args, {
  stdio: 'inherit'
});