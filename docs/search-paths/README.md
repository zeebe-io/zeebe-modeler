# Search Paths

Features like [Element Templates](../element-templates) and [Plugins](../plugins) allow you to add your own resources to the Zeebe Modeler. For these resources to be found, they have to be in one of two directories depending on how local or global you want them to be.

## App Data Directory

The `resources` directory relative to the directory containing the Zeebe Modeler executable file. In our documentation we refer to it as `{APP_DATA_DIRECTORY}`.

Resources in the app data directory will be found by any local Zeebe Modeler instance.

### Example (Windows):

```
└── zeebe-modeler-0.8.0-win-x64
    ├── Zeebe Modeler.exe
    └── resources
        └── plugins
            └── my-plugin
                └── index.js
```

## User Data Directory

The `zeebe-modeler/resources` directory relative to the per-user application data directory, which by default points to:

* `%APPDATA%` on [Windows](https://www.pcworld.com/article/2690709/whats-in-the-hidden-windows-appdata-folder-and-how-to-find-it-if-you-need-it.html)
* `$XDG_CONFIG_HOME` or `~/.config` on [Linux](https://wiki.archlinux.org/index.php/XDG_user_directories)
* `~/Library/Application Support` on macOS

In our documentation we refer to it as `{USER_DATA_DIRECTORY}`.

Resources in the user data directory will be found by all Zeebe Modeler instances.

### Example (Windows):

```
└── AppData
    └── Roaming
        └── zeebe-modeler
            └── resources
                └── plugins
                    └── my-plugin
                        └── index.js
```

It is possible to change the user data directory using the `--user-data-dir` option via when starting the Zeebe Modeler from the command line. Refer to the [flags documentation](../flags) on how to configure the application with a flags file.
