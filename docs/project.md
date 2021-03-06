`gabum project`
===============

Project Management

* [`gabum project create`](#gabum-project-create)
* [`gabum project delete [PROJECT]`](#gabum-project-delete-project)
* [`gabum project open [PROJECT]`](#gabum-project-open-project)

## `gabum project create`

Create a new project

```
USAGE
  $ gabum project create

DESCRIPTION
  Create a new project

ALIASES
  $ gabum create
  $ gabum new

EXAMPLES
  $ gabum project create

  $ gabum create
```

## `gabum project delete [PROJECT]`

Delete a project

```
USAGE
  $ gabum project delete [PROJECT]

ARGUMENTS
  PROJECT  The project to delete

DESCRIPTION
  Delete a project

EXAMPLES
  $ gabum project delete

  $ gabum project delete My-Bad-Project
```

## `gabum project open [PROJECT]`

Open a project

```
USAGE
  $ gabum project open [PROJECT] [-w <value>]

ARGUMENTS
  PROJECT  The project to open

FLAGS
  Must be one --or more-- of terminal, browser and ide=<value>...  Where to open the project

DESCRIPTION
  Open a project

ALIASES
  $ gabum open

EXAMPLES
  $ gabum project open

  $ gabum project open My-Super-Project

  $ gabum project open My-Super-Project --with terminal

  $ gabum open -w browser ide
```
