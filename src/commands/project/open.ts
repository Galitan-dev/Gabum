import { Flags } from '@oclif/core';
import { Arg } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import BaseCommand from '../../base-command';
import Project from '../../project';

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

        const projects = Project.list(this.conf);
        let project: Project;

        if (args.project) {
            const p = projects.find((p) => p.def.name === args.project);
            if (!p) return this.l.error('This project does not exist !');
            project = p;
        } else {
            project = <Project>await this.select(
                'Which project do you want to open?',
                projects.map((p) => ({
                    title: p.def.name,
                    value: p,
                    description: p.def.description,
                    // TODO color: p.template.color,
                })),
                { autocomplete: true }
            );
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

        project.open(actions);
    }
}
