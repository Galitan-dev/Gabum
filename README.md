<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GitHub pull requests][pr-shield]][pr-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Galitan-dev/Gabum">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Gabum</h3>

  <p align="center">
    A simple project manager made with Node JS.
    <br />
    <a href="https://github.com/Galitan-dev/Gabum/tree/main/docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Galitan-dev/Gabum">View Demo</a>
    ·
    <a href="https://github.com/Galitan-dev/Gabum/issues">Report Bug</a>
    ·
    <a href="https://github.com/Galitan-dev/Gabum/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><details>
      <summary><a href="#about-the-project">About The Project</a></summary>
      <ul>
      <li><a href="#built-with">Built With</a></li>
      </ul>
    </details></li>
    <li><details>
      <summary><a href="#getting-started">Getting Started</a></summary>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </details></li>
    <li><details>
      <summary><a href="#usage">Usage</a></summary>
      <ul>
        <li><a href="#crate-a-new-project">Create a new project</a></li>
        <li><a href="#open-a-project">Open a project</a></li>
        <li><a href="#get-additional-help">Get additional help</a></li>
        <li><a href="#other-commands">Other Commands</a></li>
      </ul>
    </details></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

A simple project manager made with Node JS. Currently in the form of CLI, soon in the form of an Electron application offering voice recognition.

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

* [Oclif](https://oclif.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [NodeJS](https://nodejs.org/en/)
* [Yaml](https://yaml.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Here are the simple steps to install and use gabum:

### Prerequisites

Gabum needs some other softwares to work. 
Here is a list of them and where to install them.
* [nodejs](https://nodejs.org/en/download/): Okay, it's basically the runner of the code
* [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable): Just a NodeJs Package Manager like npm. You can use another if you want.
* [git](https://git-scm.com/downloads): You should probably already have it installed, it's usefull to push your code to github.
* [gh](https://github.com/cli/cli#installation): The official cli of githyb, usefull to create repository remotely

### Installation

Install CLI with yarn 
   ```sh
   yarn global add gabum
   ```

Or with npm (no judgments)
   ```sh
   npm install -g gabum
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
### Usage

Create a new project
```sh-session
$ gabum project create
Follow the instructions
```

### Open a project
```sh-session
$ gabum project open
Follow the instructions
$ gabum open My-Super-Project --with ide
Opening project in VSCode, for example
```

### Get additional help
```sh-session
$ gabum --help [COMMAND]
USAGE
  $ gabum COMMAND
...
```

I'll yet Oclif explain you how the other commands work.

<!-- commands -->
# Command Topics

* [`gabum commands`](docs/commands.md) - list all the commands
* [`gabum conf`](docs/conf.md) - manage configuration
* [`gabum help`](docs/help.md) - Display help for gabum.
* [`gabum project`](docs/project.md) - Project Management
* [`gabum test`](docs/test.md) - test command
* [`gabum upgrade`](docs/upgrade.md) - upgrade the package to the last version
* [`gabum which`](docs/which.md) - Show which plugin a command is in.

<!-- commandsstop -->

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

 - [x] Project Creation
 - [x] Open Project
 - [x] Use a New Readme Template (like in templates)
 - [ ] Configuration
   - [x] New Config Manager
   - [x] Config Hook
   - [ ] Config Command
 - [ ] Project Definitions Storage
   - [ ] In User Configs
   - [ ] In Project
 - [ ] Template Definitions
 - [ ] More Templates
   - [ ] Blank
   - [ ] Simple TS
   - [ ] CLI (JS/TS) (With Oclif)
   - [ ] Discord (JS/TS/Rust)
   - [ ] Website
   - [ ] API (JS/TS) (With Adonis)
   - [ ] VueJs
   - [ ] ReactJs
   - [ ] Find Ideas
 - [ ] Some Coding Tools
   - [ ] Find Ideas
 - [ ] Electron App
 - [ ] Voice Recognition

See the [open issues](https://github.com/Galitan-dev/Gabum/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

More infos in [CONTRIBUTING.md][contributing-url]

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See [LICENSE][license-url] for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Galitan - [@Galitan33](https://twitter.com/Galitan33) - galitan.dev@google.com

Discord: [Send me a private message](https://discord.com/channels/@me/572442722057715722) - [Join my server](https://discord.gg/bAG6GA5qSX)

Project Link: [https://github.com/Galitan-dev/Gabum](https://github.com/Galitan-dev/Gabum)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Progress Bar Generator](https://github.com/Changaco/unicode-progress-bars) - CC0 - Public Domain
* [Raraph84](https://github.com/Raraph84) for just being a friend

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Galitan-dev/Gabum.svg?style=for-the-badge
[contributors-url]: https://github.com/Galitan-dev/Gabum/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Galitan-dev/Gabum.svg?style=for-the-badge
[forks-url]: https://github.com/Galitan-dev/Gabum/network/members
[stars-shield]: https://img.shields.io/github/stars/Galitan-dev/Gabum.svg?style=for-the-badge
[stars-url]: https://github.com/Galitan-dev/Gabum/stargazers
[issues-shield]: https://img.shields.io/github/issues/Galitan-dev/Gabum.svg?style=for-the-badge
[issues-url]: https://github.com/Galitan-dev/Gabum/issues
[license-shield]: https://img.shields.io/github/license/Galitan-dev/Gabum.svg?style=for-the-badge
[license-url]: https://github.com/Galitan-dev/Gabum/blob/main/LICENSE
[contributinh-url]: https://github.com/Galitan-dev/Gabum/blob/main/CONTRIBUTING.md
[product-screenshot]: images/screenshot.png
[pr-shield]: https://img.shields.io/github/issues-pr/galitan-dev/gabum?style=for-the-badge
[pr-url]: https://github.com/Galitan-dev/Gabum/pulls
