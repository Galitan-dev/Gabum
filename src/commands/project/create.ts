import chalk from 'chalk';
import request from 'superagent';
import BaseCommand from '../../base-command';
import Project from '../../project';
import Template from '../../project/template';
import licenses from '../../res/licenses.json';
import { ProjectLicense, TemplateId } from '../../types/project';

export default class ProjectCreate extends BaseCommand {
    static description = 'Create a new project';
    static aliases = ['create', 'new'];

    static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> create'];

    public async run(): Promise<void> {
        this.l.info("It's a great day to start a new project!");
        this.l.print(chalk.blue.italic('\nWhat is the new project about?'));

        const projects = Project.list();
        const name = await this.textInput('Project Name', {
            min: [3, 'Oh, you have really no imagination!'],
            max: [30, 'Okay, calm down with your keyboard!'],
            match: [/^[a-zA-Z\d-_]+$/g, 'What a strange name!'],
            validate: (value) =>
                !projects.some((p) => p.def.name === value) || 'This project already exists!',
        });

        if (!name) return;

        const description = await this.textInput('Project Description', {
            min: [10, 'Please make an effort!'],
            max: [100, 'Such a really big description!'],
            initial: this.conf.defaultProjectSettings.description,
        });

        const isPrivate = await this.toggle(
            'Project Visibility',
            'Private',
            'Public',
            this.conf.defaultProjectSettings.private
        );

        const template = <TemplateId>await this.select(
            'Project Template',
            Template.list().map((template) => ({
                title: template.name,
                description: template.description,
                value: template.id,
            })),
            {
                autocomplete: true,
                initial: this.conf.defaultProjectSettings.template,
            }
        );

        const license = <ProjectLicense>await this.select(
            'Project License',
            Object.values(licenses).map((l) => ({
                title: l.name,
                value: l,
            })),
            { autocomplete: true, initial: this.conf.defaultProjectSettings.license }
        );

        let author = await this.conf.author;
        const version = this.config.version;
        if (!author) {
            author = await this.textInput('Github Username', {
                async validateAsync(input: string): Promise<string | true> {
                    try {
                        const res = await request
                            .get('https://api.github.com/users/' + input)
                            .set('user-agent', 'Gabum v' + version + ' (Node.js)');

                        return typeof res.body.id === 'number' || 'Invalid user';
                    } catch (e) {
                        if ((<Error>e).message === 'Not Found') return 'Invalid user';
                        return 'Network Error: ' + (<Error>e).message;
                    }
                },
            });
            this.conf.author = author;
            this.conf.save();
        }

        if (!(await this.confirm('Confirm Project Creation ?', true))) {
            this.nl.info('Okay, no problem.');
            this.exit(0);
        }

        const project = new Project({
            name,
            description,
            private: isPrivate,
            license,
            author,
            template,
        });

        this.nl.info("Okay, I'm creating the project...");
        await project.create();
        this.l.info('The project was successfully created!');
        this.nl;

        this.config.runCommand('project:open', [project.def.name]);
    }
}
