import { readFileSync, writeFileSync } from 'fs';
import PATH from 'path';
import { parse, stringify } from 'yaml';
import { Config } from '../config';
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

    public static list(conf: Config): Project[] {
        return this.definitions.map((def) => new Project(def, conf));
    }

    public readonly def: ProjectDef & { path: string };
    public get path(): string {
        return this.def.path;
    }

    constructor(def: ProjectDef, conf: Config) {
        def.path = def.path ?? PATH.join(conf.projectDir, def.name);
        this.def = <ProjectDef & { path: string }>def;

        Project.definitions.push(this.def);
        Project.saveDefinitions();
    }

    get template() {
        return new Template(this.def.template);
    }

    async create() {
        await create(this);
    }
}
