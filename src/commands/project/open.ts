import { Command, Flags } from '@oclif/core';
import { Arg } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import Conf from 'conf';
import { statSync } from 'fs';
import PATH from 'path';
import { prompt } from 'prompts';
import shell from 'shelljs';
import { PromptObject } from '../../types/prompts';

const config = new Conf();

export default class ProjectOpen extends Command {
    static description = 'Open a project';
    static aliases = ['open'];

    static args: Arg[] = [
        {
            name: 'project',
            required: false,
            description: 'The project to open',
        },
    ];

    static flags = {
        with: Flags.string({
            char: 'w',
            description: 'Where to open the project',
            multiple: true,
            helpLabel: 'Must be one --or more-- of terminal, browser and ide',
            required: false,
        }),
    };
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> My-Super-Project',
        '<%= config.bin %> open My-Super-Project --with terminal',
        '<%= config.bin %> open -w browser -w ide',
    ];

    public async run(): Promise<void> {
        const { flags, args } = await this.parse(ProjectOpen);

        const invalidFlagId = flags.with.findIndex(
            (t) => !['terminal', 'ide', 'browser'].includes(t)
        );

        if (invalidFlagId !== -1) {
            this.log(
                chalk.yellow(
                    'Invalid tool ' + chalk.bold('`' + flags.with[invalidFlagId] + '`') + '.'
                )
            );
            flags.with.splice(invalidFlagId, 1);
        }

        const homedir = this.config.home;
        const projectDir = <string>(
            config.get('project-dir', PATH.join(homedir, 'Documents/Development'))
        );

        const projectName =
            args.project ||
            (
                await prompt(<PromptObject[]>[
                    {
                        name: 'project',
                        type: 'text',
                        message: chalk.reset.blue.italic('Which project do you want to open?'),
                        validate(value) {
                            if (typeof value !== 'string') return 'Invalid input';

                            try {
                                statSync(PATH.join(projectDir, value, '.gabum'));
                            } catch (err) {
                                return 'This is not a gabum project !';
                            }

                            return true;
                        },
                        onRender(color) {
                            if (!this._value) return;

                            let c;
                            try {
                                statSync(PATH.join(projectDir, this._value, '.gabum'));
                                c = color.green;
                            } catch (err) {
                                c = color.red;
                            }

                            this.rendered = c(this.rendered);
                        },
                    },
                ])
            ).project;

        const projectPath = PATH.join(projectDir, projectName);
        try {
            statSync(PATH.join(projectPath, '.gabum'));
        } catch (err) {
            return this.log(chalk.red.bold('This is not a gabum project !'));
        }

        const actions =
            flags.with ||
            (
                await prompt(<PromptObject[]>[
                    {
                        name: 'actions',
                        type: 'multiselect',
                        message: chalk.reset.blue.italic(
                            'With what do you want to open this project?'
                        ),
                        hint: 'Space to select. Return to submit',
                        instructions: false,
                        min: 1,
                        choices: [
                            {
                                title: 'My Favorite IDE',
                                value: 'ide',
                            },
                            {
                                title: 'Browser',
                                value: 'browser',
                            },
                            {
                                title: 'A new Terminal',
                                value: 'terminal',
                            },
                        ],
                    },
                ])
            ).actions;

        if (actions.includes('ide')) {
            const cmd = config.get('ide-command');
            if (!cmd) this.log(chalk.yellow("Oups! you didn't configured an ide command !"));
            else
                await shell.exec(<string>cmd, {
                    cwd: projectPath,
                });
        }

        if (actions.includes('browser')) {
            await shell.exec('gh browse', { cwd: projectPath });
        }

        if (actions.includes('terminal')) {
            const cmd = config.get('terminal-command');
            if (!cmd) this.log(chalk.yellow("Oups! you didn't configured a terminal command !"));
            else
                await shell.exec(<string>cmd, {
                    cwd: projectPath,
                });
        }
    }
}
