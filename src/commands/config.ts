import { Command } from '@oclif/core';
import chalk from 'chalk';
import { existsSync } from 'fs';
import PATH from 'path';
import conf from '../config';
import prompt from '../helpers/prompt';
import { PromptObject } from '../types/prompts';

export default class Config extends Command {
    static description = 'Configure Gabum CLI';
    static aliases = ['conf', 'settings'];
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> conf',
        '<%= config.bin %> settings',
    ];

    public async run(): Promise<void> {
        const config = conf();
        const homedir = this.config.home;

        while (true) {
            this.log(config.toColoredString());
            this.log();
            const action = await prompt<'cancel' | 'save' | 'reset' | 'get' | 'set'>(
                'What do you want to do ?',
                {
                    type: 'select',
                    hint: 'Space to select. Return to submit',
                    instructions: false,
                    choices: [
                        {
                            title: chalk.cyan('Get a setting'),
                            value: 'get',
                        },
                        {
                            title: chalk.cyan('Modify settings'),
                            value: 'set',
                        },
                        {
                            title: chalk.yellow('Reset to default settings'),
                            value: 'reset',
                        },
                        {
                            title: chalk.green('Save and quit'),
                            value: 'save',
                        },
                        {
                            title: chalk.red('Cancel'),
                            value: 'cancel',
                        },
                    ],
                }
            );

            switch (action) {
                case 'cancel':
                    if (!(await prompt('Quit without saving?', 'confirm'))) break;
                    this.log('Okay, Bye 👋');
                    this.exit(0);

                case 'save':
                    this.log('Saving changes...');
                    config.save();
                    this.log('Saved! Bye 👋');
                    this.exit(0);

                case 'reset':
                    if (!(await prompt('Reset to default settings?', 'confirm'))) break;
                    this.log('Resetting settings...');
                    config.loadFile(PATH.join(__dirname, '../res/default-config.yml'));
                    this.log('Settings reset!');
                    break;

                case 'set': {
                    const setting = await chooseSetting();

                    switch (setting) {
                        case 'project-dir':
                            const newPath = await prompt('Project Directory?', <PromptObject>{
                                type: 'text',
                                hint: 'You can use <home-dir> alias',
                                validate(value) {
                                    if (typeof value !== 'string') return 'Invalid input';
                                    if (!existsSync(value.replace(/<home-dir>/g, homedir)))
                                        return 'Directory does not exist';
                                    return true;
                                },
                                onRender(color) {
                                    if (!this._value) return;

                                    const exists = existsSync(
                                        this._value.replace(/<home-dir>/g, homedir)
                                    );

                                    const newRender = this.rendered
                                        ?.replace(/(["#%/<>|])+/g, color.red('$1'))
                                        .replace(/\s+(\S+)/g, color.grey('-') + '$1')
                                        .replace(/\s+/g, '');

                                    this.rendered = (exists ? color.green : color.red)(
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
                            });

                            config.projectDir = <string>newPath;
                            break;
                    }

                    break;
                }
            }

            this.log();
        }
    }
}

async function chooseSetting(): Promise<Setting> {
    const setting = await prompt<'project-dir' | 'default-project-settings' | 'commands'>(
        'Wich setting?',
        {
            type: 'select',
            hint: 'Space to select. Return to submit',
            instructions: false,
            choices: [
                {
                    title: 'Project Directory',
                    value: 'project-dir',
                },
                {
                    title: 'Default Project Settings',
                    value: 'default-project-settings',
                },
                {
                    title: 'Commands',
                    value: 'commands',
                },
            ],
        }
    );

    switch (setting) {
        case 'default-project-settings':
            const projectSetting = await prompt<
                'description' | 'visibility' | 'license' | 'template'
            >('Wich project setting?', {
                type: 'select',
                hint: 'Space to select. Return to submit',
                instructions: false,
                choices: [
                    {
                        title: 'Description',
                        value: 'description',
                    },
                    {
                        title: 'Visibility',
                        value: 'visibility',
                    },
                    {
                        title: 'License',
                        value: 'license',
                    },
                    {
                        title: 'Template',
                        value: 'template',
                    },
                ],
            });

            return <Setting>('project-' + projectSetting);
        case 'commands':
            const command = await prompt<'ide' | 'terminal'>('Wich command?', {
                type: 'select',
                hint: 'Space to select. Return to submit',
                instructions: false,
                choices: [
                    {
                        title: 'IDE',
                        value: 'ide',
                    },
                    {
                        title: 'Terminal',
                        value: 'terminal',
                    },
                ],
            });

            return <Setting>('commands-' + command);
        default:
            return <Setting>setting;
    }
}

type Setting =
    | 'project-dir'
    | 'project-description'
    | 'project-visibility'
    | 'project-license'
    | 'project-template'
    | 'commands-ide'
    | 'commands-terminal';
