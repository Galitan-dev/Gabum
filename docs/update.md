`gabum update`
==============

update the gabum CLI

* [`gabum update [CHANNEL]`](#gabum-update-channel)

## `gabum update [CHANNEL]`

update the gabum CLI

```
USAGE
  $ gabum update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the gabum CLI

EXAMPLES
  Update to the stable channel:

    $ gabum update stable

  Update to a specific version:

    $ gabum update --version 1.0.0

  Interactively select version:

    $ gabum update --interactive

  See available versions:

    $ gabum update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.0.0/src/commands/update.ts)_
