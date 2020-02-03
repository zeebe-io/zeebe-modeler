> :warning: This feature got introduced in Camunda Modeler `v3.0.0` and may be subject to change at any time.


# Flags

Flags allow you to control the availability of certain features within the application.


## Configuring Flags

You may configure flags in a `flags.json` file or pass them via CLI.

### Configure in `flags.json`

Place a `flags.json` file inside the `resources` folder of your local [`{USER_DATA}`](../search-paths#user-data-directory) or [`{APP_HOME}`](../search-paths#application-home-directory) directory to persist them.

### Configure via CLI

Pass flags via the command line when starting the application.

```
zeebe-modeler --disable-plugins
```

Flags passed as command line arguments take precedence over those configured via a configuration file.


## Available Flags

| flag | default value |
| ------------- | ------------- |
| "disable-plugins"  | false  |
| "disable-adjust-origin"  | false  |
| "single-instance" | false |
| "user-data-dir" | [Electron default](../search-paths) |
