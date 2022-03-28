import { Arg } from '@oclif/core/lib/interfaces';
import BaseCommand from '../../base-command';
import Project from '../../project';

export default class ProjectDelete extends BaseCommand {
    static description = 'Delete a project';

    static args: Arg[] = [
        {
            name: 'project',
            required: false,
            description: 'The project to delete',
        },
    ];

    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> My-Bad-Project',
    ];

    public async run(): Promise<void> {
        const { args } = await this.parse(ProjectDelete);

        const projects = Project.list();
        let project: Project;

        if (args.project) {
            const p = projects.find((p) => p.def.name === args.project);
            if (!p) return this.l.error('This project does not exist !');
            project = p;
        } else {
            project = <Project>await this.select(
                'Which project do you want to delete?',
                projects.map((p) => ({
                    title: p.def.name,
                    value: p,
                    description: p.def.description,
                })),
                { autocomplete: true }
            );
        }

        if (!project) return;

        const confirmText = project.def.author + '/' + project.def.name;
        const confirm = await this.textInput('Type ' + confirmText + ' to confirm deletion:', {
            validate: (input) => input === confirmText || '',
            validateAsync: () => Promise.resolve(true),
        });

        if (confirm !== confirmText) {
            this.l.info('Ok, canceled deletion');
            this.exit(0);
        }

        this.l.info('Deleting project');
        project.delete();
    }
}
