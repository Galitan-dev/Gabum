import chalk from 'chalk';
import Conf from 'conf';
import fs from 'fs';
import PATH from 'path';
import shell from 'shelljs';
import BaseCommand from '../../base-command';
import Project from '../../project';
import licenses from '../../res/licenses.json';
import { ProjectLanguage, ProjectLicense, ProjectType } from '../../types/project';

const config = new Conf();

export default class ProjectCreate extends BaseCommand {
    static description = 'Create a new project';
    static aliases = ['create'];

    static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> create'];

    public async run(): Promise<void> {
        const homedir = this.config.home;
        const projectDir = <string>(
            config.get('project-dir', PATH.join(homedir, 'Documents/Development'))
        );

        this.l.info("It's a great day to start a new project!");
        this.l.print(chalk.blue.italic('\nWhat is the new project about?'));

        const name = await this.textInput('Project Name', {
            min: [3, 'Oh, you have really no imagination!'],
            max: [30, 'Okay, calm down with your keyboard!'],
            match: [/^[a-zA-Z\d-_]+$/g, 'What a strange name!'],
            validate: (value) =>
                !fs.existsSync(PATH.join(projectDir, value)) || 'This project already exists!',
        });

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

        // TODO
        const template = this.conf.defaultProjectSettings.template;

        const license = <ProjectLicense>await this.select(
            'Project License',
            Object.values(licenses).map((l) => ({
                title: l.name,
                value: l,
            }))
        );

        let author = await this.conf.author;
        if (!author) {
            author = await this.textInput('Github Username', {
                validate() {
                    // TODO: check on github (need to be async)
                    return true;
                },
            });
            this.conf.author = author;
            this.conf.save();
        }

        const project = new Project({
            name,
            description,
            private: isPrivate,
            license,
            author,
            type: <ProjectType>template.split('/')[0],
            language: <ProjectLanguage>template.split('/')[1],
        });

        this.nl.info("Okay, I'm creating the project...");
        await project.create();
        this.l.info('The project was created successfully!');
        this.nl;

        const actions = await this.select<'ide' | 'browse' | 'terminal'>(
            'With what do you want to open this project?',
            {
                'Open in favorite IDE': 'ide',
                'Open in Browser': 'browse',
                'Open in a new Terminal': 'terminal',
            },
            { multiple: true }
        );

        if (actions.includes('ide')) {
            const cmd = config.get('ide-command');
            if (!cmd) this.l.warn("Oups! you didn't configured an ide command !");
            else
                await shell.exec(<string>cmd, {
                    cwd: project.path,
                });
        }

        if (actions.includes('browse')) {
            await shell.exec('gh browse', { cwd: project.path });
        }

        if (actions.includes('terminal')) {
            const cmd = config.get('terminal-command');
            if (!cmd) this.l.warn("Oups! you didn't configured a terminal command !");
            else
                await shell.exec(<string>cmd, {
                    cwd: project.path,
                });
        }
    }
}
