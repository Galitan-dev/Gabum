import { Command } from '@oclif/core';
import chalk from 'chalk';
import Conf from 'conf';
import fs from 'node:fs';
import path from 'node:path';
import { prompt } from 'prompts';
import shell from 'shelljs';
import Project from '../../project';
import licenses from '../../res/licenses.json';
import { PromptObject } from '../../types/prompts';

const config = new Conf();

export default class ProjectCreate extends Command {
    static description = 'Create a new project';
    static aliases = ['create'];

    static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> open'];

    public async run(): Promise<void> {
        const homedir = this.config.home;
        const projectDir = <string>(
            config.get('project-dir', path.join(homedir, 'Documents/Development'))
        );

        this.log(chalk.greenBright.bold("It's a great day to start a new project!"));
        this.log(chalk.blue.italic('\nWhat is the new project about?'));

        const questions = (<PromptObject[]>[
            {
                name: 'name',
                type: 'text',
                message: 'Project Name',
                validate(value) {
                    if (typeof value !== 'string') return 'Invalid input';
                    if (value.length > 30) return 'Too long project name';
                    if (value.length === 0) return 'Please provide a project name';
                    if (value.length < 3) return 'Too small project name';
                    if (fs.existsSync(path.join(projectDir, value)))
                        return 'Project already exists';
                    return true;
                },
                onRender(color) {
                    if (!this._value) return;

                    const exists = fs.existsSync(path.join(projectDir, this._value));

                    const newRender = this.rendered
                        ?.replace(/(["#%/<>|])+/g, color.red('$1'))
                        .replace(/\s+(\S+)/g, color.grey('-') + '$1')
                        .replace(/\s+/g, '');

                    this.rendered = (exists ? color.red : color.green)(
                        this.rendered?.match(/[\s"#%/<>|]+([^\s"#%/<>|]+)/g)
                            ? newRender
                            : this.rendered
                    );
                },
                format(input) {
                    return (<string>input)
                        .replace(/["#%/<>|]+/g, '-')
                        .replace(/\s+(\S+)/g, '-$1')
                        .replace(/\s+/g, '');
                },
            },
            {
                name: 'description',
                type: 'text',
                message: 'Project Description',
                validate(value) {
                    if (typeof value !== 'string') return 'Invalid input';
                    if (value.length > 100) return 'Too long project description';
                    if (value.length === 0) return 'Please provide a project description';
                    if (value.length < 10) return 'Too small project description';
                    return true;
                },
                initial: 'I am to lazy to write a small description',
            },
            {
                name: 'private',
                type: 'toggle',
                message: 'Project Visibility',
                initial: <boolean>config.get('default-project-private', false),
                active: 'Private',
                inactive: 'Public',
            },
            {
                type: 'autocomplete',
                name: 'type',
                message: 'Project Type',
                initial: <string>config.get('default-project-type', 'simple'),
                choices: [
                    {
                        title: 'API',
                        value: 'api',
                    },
                    {
                        title: 'Blank',
                        value: 'blank',
                    },
                    {
                        title: 'CLI',
                        value: 'cli',
                    },
                    {
                        title: 'Discord Bot',
                        value: 'discord',
                    },
                    {
                        title: 'Simple',
                        value: 'simple',
                    },
                    {
                        title: 'Web App',
                        value: 'webapp',
                    },
                    {
                        title: 'Website',
                        value: 'website',
                    },
                ],
            },
            {
                type: 'autocomplete',
                name: 'language',
                message: 'Project Language',
                initial: <string>config.get('default-project-language', 'js'),
                choices: [
                    {
                        title: 'JavaScript',
                        value: 'js',
                    },
                    {
                        title: 'TypeScript',
                        value: 'ts',
                    },
                    {
                        title: 'Web (HTML, CSS, JS)',
                        value: 'web',
                    },
                    {
                        title: 'Rust',
                        value: 'rs',
                    },
                    {
                        title: 'Other',
                        value: 'other',
                    },
                ],
            },
            {
                type: 'autocomplete',
                name: 'license',
                message: 'Project License',
                initial: <string>config.get('default-project-license', 'MIT License'),
                choices: Object.values(licenses).map((l) => ({
                    title: l.name,
                    value: l,
                })),
            },
        ]).map((msg) => {
            msg.message = chalk.reset(msg.message);
            return msg;
        });

        const answers = await prompt(questions);

        if (!config.get('author')) {
            config.set(
                'author',
                (
                    await prompt([
                        {
                            name: 'author',
                            type: 'text',
                            message: 'Github Username',
                            validate(value: string) {
                                if (typeof value !== 'string') return 'Invalid input';
                                if (value.length > 30) return 'Too long project author';
                                if (value.length === 0) return 'Please provide a project author';
                                if (value.length < 3) return 'Too small project author';
                                return true;
                            },
                        },
                    ])
                ).author
            );
        }

        answers.author = config.get('author');

        const project = new Project(answers);

        this.log(chalk.green.bold("\nOkay, I'm creating the project..."));
        await project.create();
        this.log(chalk.green.bold('The project was created successfully!\n'));

        const actions = await prompt(<PromptObject[]>[
            {
                name: 'toDo',
                type: 'multiselect',
                message: chalk.reset.blue.italic('What do you want to do?'),
                hint: 'Space to select. Return to submit',
                instructions: false,
                choices: [
                    {
                        title: 'Open in Favorite IDE',
                        value: 'ide',
                    },
                    {
                        title: 'Open in Browser',
                        value: 'browse',
                    },
                    {
                        title: 'Open in a new Terminal',
                        value: 'terminal',
                    },
                ],
            },
        ]);

        if (actions.toDo.includes('ide')) {
            const cmd = config.get('ide-command');
            if (!cmd) this.log(chalk.yellow("Oups! you didn't configured an ide command !"));
            else
                await shell.exec(<string>cmd, {
                    cwd: project.path,
                });
        }

        if (actions.toDo.includes('browse')) {
            await shell.exec('gh browse', { cwd: project.path });
        }

        if (actions.toDo.includes('terminal')) {
            const cmd = config.get('terminal-command');
            if (!cmd) this.log(chalk.yellow("Oups! you didn't configured a terminal command !"));
            else
                await shell.exec(<string>cmd, {
                    cwd: project.path,
                });
        }
    }
}
