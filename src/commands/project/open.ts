import { Flags } from '@oclif/core';
import { Arg } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import { statSync } from 'fs';
import PATH from 'path';
import shell from 'shelljs';
import BaseCommand from '../../base-command';

export default class ProjectOpen extends BaseCommand {
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

        if (flags.with) {
            const invalidFlagId = flags.with?.findIndex(
                (t) => !['terminal', 'ide', 'browser'].includes(t)
            );

            if (invalidFlagId !== -1) {
                this.l.warn(
                    'Invalid tool ' + chalk.bold('`' + flags.with[invalidFlagId] + '`') + '.'
                );
                flags.with.splice(invalidFlagId, 1);
            }
        }

        const projectDir = this.conf.projectDir;

        const projectName =
            args.project ||
            (await this.textInput('Which project do you want to open?', {
                validate(value) {
                    try {
                        statSync(PATH.join(projectDir, value, '.gabum'));
                        return true;
                    } catch (err) {
                        return 'This is not a gabum project !';
                    }
                },
            }));

        const projectPath = PATH.join(projectDir, projectName);
        try {
            statSync(PATH.join(projectPath, '.gabum'));
        } catch (err) {
            this.l.error('This is not a gabum project !');
            this.exit(1);
        }

        const actions =
            flags.with ||
            (await this.select<'ide' | 'browser' | 'terminal'>(
                'With what do you want to open this project?',
                {
                    'My Favorite IDE': 'ide',
                    Browser: 'browser',
                    'A new Terminal': 'terminal',
                },
                { multiple: true }
            ));

        if (actions.includes('ide')) {
            const cmd = this.conf.commands.ide;
            if (!cmd) this.l.warn("Oups! you didn't configured an ide command !");
            else
                await shell.exec(<string>cmd, {
                    cwd: projectPath,
                });
        }

        if (actions.includes('browser')) {
            await shell.exec('gh browse', { cwd: projectPath });
        }

        if (actions.includes('terminal')) {
            const cmd = this.conf.commands.terminal;
            if (!cmd) this.l.warn("Oups! you didn't configured a terminal command !");
            else
                await shell.exec(<string>cmd, {
                    cwd: projectPath,
                });
        }
    }
}
