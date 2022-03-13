# Gabum 
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/Galitan-dev/Gabum/blob/main/LICENSE) 
[![GitHub maintainer](https://img.shields.io/badge/maintainer-galitan--dev-informational)](https://github.com/galitan-dev)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/galitan-dev/gabum)
![Lines of code](https://img.shields.io/tokei/lines/github/galitan-dev/gabum)

![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/galitan-dev/gabum)
![npm](https://img.shields.io/npm/dt/gabum)
![npm](https://img.shields.io/npm/v/gabum)




A simple project manager made with Node JS. Currently in the form of CLI, soon in the form of an Electron application offering voice recognition.

# Summary

- [Gabum](#gabum)
- [Summary](#summary)
- [Demo](#demo)
- [Features](#features)
- [Usage](#usage)
- [Commands](#commands)
- [Command Topics](#command-topics)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

# Demo

Insert gif or link to demo

# Features

- Cross platform

# Usage

<!-- usage -->
```sh-session
$ npm install -g gabum
$ gabum COMMAND
running command...
$ gabum (--version)
gabum/1.0.0 darwin-x64 node-v16.14.0
$ gabum --help [COMMAND]
USAGE
  $ gabum COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`gabum commands`](#gabum-commands)
* [`gabum conf [KEY] [VALUE]`](#gabum-conf-key-value)
* [`gabum help [COMMAND]`](#gabum-help-command)
* [`gabum project create`](#gabum-project-create)
* [`gabum test`](#gabum-test)
* [`gabum upgrade`](#gabum-upgrade)
* [`gabum which`](#gabum-which)

## `gabum commands`

list all the commands

```
USAGE
  $ gabum commands [--json] [-h] [--hidden] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.1.0/src/commands/commands.ts)_

## `gabum conf [KEY] [VALUE]`

manage configuration

```
USAGE
  $ gabum conf [KEY] [VALUE] [-h] [-k <value>] [-v <value>] [-d] [-p <value>] [-n <value>] [-d <value>]

ARGUMENTS
  KEY    key of the config
  VALUE  value of the config

FLAGS
  -d, --cwd=<value>      config file location
  -d, --delete           delete?
  -h, --help             show CLI help
  -k, --key=<value>      key of the config
  -n, --name=<value>     config file name
  -p, --project=<value>  project name
  -v, --value=<value>    value of the config

DESCRIPTION
  manage configuration
```

_See code: [conf-cli](https://github.com/natzcam/conf-cli/blob/v0.1.9/src/commands/conf.ts)_

## `gabum help [COMMAND]`

Display help for gabum.

```
USAGE
  $ gabum help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gabum.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.11/src/commands/help.ts)_

## `gabum project create`

Create a new project

```
USAGE
  $ gabum project create

DESCRIPTION
  Create a new project

ALIASES
  $ gabum create

EXAMPLES
  $ gabum project create
```

## `gabum test`

test command

```
USAGE
  $ gabum test

DESCRIPTION
  test command

EXAMPLES
  $ gabum test
```

_See code: [dist/commands/test.ts](https://github.com/Galitan-dev/Gabum/blob/v1.0.0/dist/commands/test.ts)_

## `gabum upgrade`

upgrade the package to the last version

```
USAGE
  $ gabum upgrade [-w <value>] [-f]

FLAGS
  -f, --force
  -w, --with=<value>  package manager to use

DESCRIPTION
  upgrade the package to the last version

ALIASES
  $ gabum update
  $ gabum up

EXAMPLES
  $ gabum upgrade
```

_See code: [dist/commands/upgrade.ts](https://github.com/Galitan-dev/Gabum/blob/v1.0.0/dist/commands/upgrade.ts)_

## `gabum which`

Show which plugin a command is in.

```
USAGE
  $ gabum which

DESCRIPTION
  Show which plugin a command is in.
```

_See code: [@oclif/plugin-which](https://github.com/oclif/plugin-which/blob/v2.1.0/src/commands/which.ts)_
<!-- commandsstop -->

# Tech Stack

**CLI:** TypeScript, NodeJS

**Config:** Yaml

# Roadmap

May change in the future

- Long Start

- Open Project

- Default Settings

- Quick Start

- Templates

- Electron App

- Voice Recognition

# Contributing

Contributions are always welcome!

See [Contributing](https://github.com/Galitan-Dev/Gabum/blob/main/CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [Code of Conduct](https://github.com/Galitan-Dev/Gabum/blob/main/CODE_OF_CONDUCT.md).

# Authors

- [@Galitan-dev](https://www.github.com/Galitan-dev)

# License

See in [LICENSE](https://github.com/Galitan-dev/Gabum/blob/main/LICENSE)

© Galitan-dev 2022
