import { readFileSync, writeFileSync } from 'fs';
import os from 'os';
import { parse, stringify } from 'yaml';
import { Commands, DefaultProjectSettings } from '../types/config';

export class Config {
    public static instance: Config;

    private path: string;
    private doc!: {
        'project-dir': string;
        'default-project-settings': DefaultProjectSettings;
        commands: Commands;
    };

    constructor(configPath: string) {
        Config.instance = this;
        this.path = configPath;
        this.loadFile(configPath);
    }

    loadFile(path: string) {
        this.load(readFileSync(path, 'utf8'));
    }

    load(yaml: string) {
        this.doc = parse(yaml) || this.doc || {};
    }

    get projectDir(): string {
        return this.doc['project-dir'].replace(/<home-dir>/g, os.homedir()).replace(/\\/, '/');
    }

    set projectDir(projectDir: string) {
        this.doc['project-dir'] = projectDir;
    }

    get defaultProjectSettings(): DefaultProjectSettings {
        return this.doc['default-project-settings'];
    }

    set defaultProjectSettings(projectSettings: DefaultProjectSettings) {
        this.doc['default-project-settings'] = projectSettings;
    }

    get commands(): Commands {
        return this.doc['commands'];
    }

    set commands(commands: Commands) {
        this.doc['commands'] = commands;
    }

    toString(): string {
        return stringify(this.doc);
    }

    save() {
        writeFileSync(this.path, stringify(this.doc), 'utf8');
    }
}

export default () => Config.instance;
