#!/usr/bin/env node

/**
 * js task for keep Zeebe Modeler in sync with original camunda modeler
 */
const git = require('simple-git')('');

const mri = require('mri');

const CAMUNDA_MODELER_UPSTREAM = 'camunda';
const CAMUNDA_MODELER_REPOSITORY = 'https://github.com/camunda/camunda-modeler.git';

const CAMUNDA_MODELER_BRANCH = 'master';

const {
  help,
  ...args
} = mri(process.argv, {
  alias: {
    branch: [ 'b' ],
    help: [ 'h' ],
    tag: [ 't' ],
  },
  default: {
    branch: CAMUNDA_MODELER_BRANCH,
    help: false,
    tag: false
  }
});

if (help) {
  console.log(`usage: node tasks/sync-fork.js [-b BRANCH_NAME] [-t TAG_NAME]

Synchronize with latest Camunda Modeler changes.

Options:

  -b, --branch=BRANCH_NAME      synchronize with upstream branch
  -t, --tag=TAG_NAME            synchronize with upstream tag

  -h, --help                    print this help
`);

  process.exit(0);
}

run(args);

/**
 * $ git remote add @upstream @repository
 * @param {String} options.repository
 * @param {String} options.upstream
 */
async function createUpstream(options) {

  const {
    repository,
    upstream
  } = options;

  console.log(`Sync: Execute 'git remote add ${upstream} ${repository}'.`);

  return new Promise((resolve, reject) => {
    git.addRemote(
      upstream,
      repository,
      (err, res) => {

        if (err) {
          reject(err);
        }

        console.log(`Sync: Created new upstream '${upstream}'.`);

        resolve(res);
      });
  });
}

/**
 * $ git remote -v
 * Fetches all remote and check whether given @upstream is included
 * @param {String} options.upstream
 */
async function hasUpstream(options) {

  const {
    upstream
  } = options;

  return new Promise((resolve, reject) => {
    git.getRemotes((err, remotes) => {

      if (err) {
        reject(err);
      }

      remotes.forEach(r => {
        if (r.name === upstream) {
          resolve(true);
        }
      });

      resolve(false);
    });
  });

}

/**
 * $ git fetch @upstream
 * @param {String} options.upstream
 */
async function fetchUpstream(options) {

  const {
    upstream
  } = options;

  console.log(`Sync: Execute 'git fetch ${upstream} ${CAMUNDA_MODELER_BRANCH}'.`);

  return new Promise((resolve, reject) => {
    git.fetch(upstream, CAMUNDA_MODELER_BRANCH, (err, res) => {

      if (err) {
        reject(err);
      }

      console.log(`Sync: Fetched actual state of upstream '${upstream}'.`);

      resolve();
    });
  });
}


/**
 * $ git commit -m @message
 * @param {String} options.message
 */
async function setCommitMessage(options) {

  const {
    message
  } = options;

  console.log(`Sync: Execute 'git commit -m "${message}"'`);

  return new Promise((resolve, reject) => {
    git.raw([
      'commit',
      '-m',
      message
    ], (err, res) => {

      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

/**
 * $ git clean -@mode
 * @param {String} options.mode
 */
async function cleanUp(options) {

  const {
    mode
  } = options;

  console.log(`Sync: Execute 'git clean -${mode}'.`);

  return new Promise((resolve, reject) => {
    git.clean(mode, (err, res) => {

      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

/**
 * $ git reset HEAD -- @files
 * exclude files that should be ignored in the merge procedure
 * @param {Array<String>} options.conflicts
 * @param {Array<String>} options.files
 */
async function excludeFilesFromMerge(options) {

  const {
    conflicts,
    files
  } = options;

  console.log(`Sync: Execute 'git reset HEAD -- ${files.join(' ')}'.`);

  let resetCmd = [
    'reset',
    'HEAD',
    '--'
  ];

  resetCmd.push(... files);

  return new Promise((resolve, reject) => {

    git.raw(resetCmd, async (err, res) => {

      if (err) {
        reject(err);
        return;
      }

      // cleanup working tree
      await cleanUp({
        mode: 'fd'
      });

      const filteredConflicts = conflicts.filter(c => {

        // filter out excluded conflicts
        const includedPaths = (files || []).filter(f => {
          return c.file.includes(f);
        });

        // remove if in unrelated files or just 'modify/delete' error
        return includedPaths.length === 0 && c.reason !== 'modify/delete';
      });

      console.log('Sync: Excluded non related files from merge conflicts. There could ' +
      'be another untracked changes after synching. Give them a review and decide ' +
      'whether they are related!');

      resolve({
        conflicts: filteredConflicts
      });

    });
  });

}

/**
 * $ git merge @upstream/@branch --no-commit --no-ff
 * Overall syncing procedure
 * @param {String} options.branch
 * @param {String} options.tag
 * @param {String} options.upstream
 */
async function sync(options) {

  const {
    branch,
    tag,
    upstream
  } = options;

  // no need do especially declare upstream if tag is selected
  let syncPath = tag || `${upstream}/${branch}`;

  console.log(`Sync: Execute 'git merge --no-commit --no-ff ${syncPath}'.`);

  return new Promise((resolve, reject) => {

    const _success = async function(response) {

      if ((response.files || []).length || (response.merges || []).length) {
        await setCommitMessage({
          message: 'chore(project): synchronize with base modeler'
        });

        console.log('Sync: Syncing is done locally! Changes needs to be pushed remotely.');
      } else {
        console.log('Sync: No changes to be adopted. Stopped syncing!');
      }

      resolve();
    };

    git.merge([
      '--no-commit',
      '--no-ff',
      syncPath
    ], async (err, res) => {

      if (!res) {

        if ((err.conflicts || []).length) {

          console.log('Sync: Syncing was not successful! There might be some merge' +
          'conflicts which have to be fixed before.');

          // exclude files that should not be synced
          const result = await excludeFilesFromMerge({
            conflicts: err.conflicts,
            files: [
              'client/src/app/tabs/dmn/',
              'client/src/app/tabs/cmmn/',
              'client/test/mocks/cmmn-js/',
              'client/test/mocks/dmn-js/',
              'client/src/app/tabs/bpmn/modeler/features/apply-default-templates/',
              'client/src/app/tabs/bpmn/util/**/*namespace*'
            ]
          });

          if (result.conflicts && result.conflicts.length == 0) {
            await _success(err);
          }

          // todo(pinussilvestrus): offer auto-merge tool for left merge conflicts?

          reject(new Error('merge conflicts'));
        } else {
          reject(err);
        }

        return;

      }

      await _success(res);
    });
  });
}

async function run(options) {

  const {
    branch,
    tag
  } = options;

  console.log('##### Started syncing #####');

  const hasOrigin = await hasUpstream({
    upstream: CAMUNDA_MODELER_UPSTREAM
  });

  if (!hasOrigin) {
    await createUpstream({
      repository: CAMUNDA_MODELER_REPOSITORY,
      upstream: CAMUNDA_MODELER_UPSTREAM
    });
  }

  await fetchUpstream({
    upstream: CAMUNDA_MODELER_UPSTREAM
  });

  try {
    await sync({
      branch,
      tag,
      upstream: CAMUNDA_MODELER_UPSTREAM
    });
  } catch (e) {

    // todo(pinussilvestrus): catch errors properly
  }

  console.log('##### Stoped syncing #####');

}
