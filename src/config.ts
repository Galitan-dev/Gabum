import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import os from 'os';
import { parse, stringify } from 'yaml';
import { Commands, DefaultProjectSettings } from './types/config';

export class Config {
    public static instance: Config;

    private path: string;
    private doc!: {
        'project-dir': string;
        'default-project-settings': DefaultProjectSettings;
        author: string;
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

    set author(author: string) {
        this.doc['author'] = author;
    }

    get author(): string {
        return this.doc['author'];
    }

    toString(): string {
        return stringify(this.doc);
    }

    toColoredString(): string {
        return chalk.white(
            stringify(this.doc, { indent: 4 })
                .replace(/([a-z\-]+):([\s\n])/gi, chalk.red('$1') + ':$2')
                .replace(/<(home-dir)>/g, chalk.blue('<$1>') + '\x1B[32m')
                .replace(/: (false|true)/gi, ': ' + chalk.yellow('$1'))
                .replace(/: (.+)/gi, ': ' + chalk.green('$1'))
                .slice(0, -2)
        );
    }

    save() {
        writeFileSync(this.path, this.toString(), 'utf8');
    }
}

export default () => Config.instance;
