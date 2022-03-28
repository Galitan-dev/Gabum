import { readFileSync, rmSync, writeFileSync } from 'fs';
import PATH from 'path';
import shell from 'shelljs';
import { parse, stringify } from 'yaml';
import { Logger } from '../base-command';
import config from '../config';
import { ProjectDef } from '../types/project';
import { create } from './create';
import Template from './template';

export default class Project {
    private static definitions: ProjectDef[];
    private static path = process.env.GABUM_CONFIG_PATH + '/projects.yml';

    static {
        try {
            this.definitions = parse(readFileSync(this.path, 'utf-8'));
        } catch {
            this.definitions = [];
        }
    }

    private static saveDefinitions() {
        writeFileSync(this.path, stringify(this.definitions), 'utf-8');
    }

    public static list(): Project[] {
        return this.definitions.map((def) => new Project(def));
    }

    public readonly def: ProjectDef & { path: string };
    public get path(): string {
        return this.def.path;
    }

    private readonly l = new Logger();
    private readonly conf = config();

    constructor(def: ProjectDef) {
        def.path = def.path ?? PATH.join(this.conf.projectDir, def.name);
        this.def = <ProjectDef & { path: string }>def;
    }

    public get template() {
        return new Template(this.def.template);
    }

    public async create() {
        await create(this);
        Project.definitions.push(this.def);
        Project.saveDefinitions();
    }

    public async open(actions: string[]) {
        if (actions.includes('ide')) {
            await shell.exec(this.conf.commands.ide, {
                cwd: this.path,
            });
        }

        if (actions.includes('browser')) {
            await shell.exec('gh browse', { cwd: this.path });
        }

        if (actions.includes('terminal')) {
            await shell.exec(this.conf.commands.terminal, {
                cwd: this.path,
            });
        }
    }

    public async delete() {
        await shell.exec('gh repo delete ' + this.def.author + '/' + this.def.name + ' --confirm');
        rmSync(this.path, { recursive: true });
        Project.definitions = Project.definitions.filter((p) => p.name !== this.def.name);
        Project.saveDefinitions();
    }
}
