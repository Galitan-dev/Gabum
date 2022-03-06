`gabum update`
==============

Updates the gabum CLI. This will check for the latest version available on the requested channel and fetch it from remote

* [`gabum update [CHANNEL]`](#gabum-update-channel)

## `gabum update [CHANNEL]`

Updates the gabum CLI. This will check for the latest version available on the requested channel and fetch it from remote

```
USAGE
  $ gabum update [CHANNEL] [--from-local]

ARGUMENTS
  CHANNEL  Specify a channel (ex: stable,alpha,beta,next). An error will be thrown if this channel is invalid.

FLAGS
  --from-local  interactively choose an already installed version

DESCRIPTION
  Updates the gabum CLI. This will check for the latest version available on the requested channel and fetch it from
  remote
```

_See code: [@sumwatshade/oclif-plugin-update](https://github.com/sumwatshade/plugin-update/blob/v1.9.4/src/commands/update.ts)_
