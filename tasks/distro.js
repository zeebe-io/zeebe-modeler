#!/usr/bin/env node

const argv = require('yargs').argv;

const exec = require('execa').sync;

const getVersion = require('../app/util/get-version');

const pkg = require('../app/package');

const {
  nightly,
  publish,
  config
} = argv;

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