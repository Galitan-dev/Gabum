import { Command } from '@oclif/core';
import Conf from 'conf';
import shell from 'shelljs';
import Project from '../project';
import licenses from '../res/licenses.json';
import { ProjectLicense } from '../types/project';
const config = new Conf();

export default class Test extends Command {
    static description = 'test command';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    public async run(): Promise<void> {
        const project = new Project({
            name: 'Test5',
            author: <string>config.get('author', 'Anonymous'),
            description: 'Just a test project for gabum',
            private: true,
            type: 'simple',
            language: 'js',
            license: <ProjectLicense>licenses.find((l) => l.id === 'mit'),
        });

        shell.rm('-rf', project.path);

        await project.create();
    }
}
