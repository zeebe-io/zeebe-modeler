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
