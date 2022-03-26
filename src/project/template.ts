import chalk from 'chalk';
import { readFileSync } from 'fs';
import PATH from 'path';
import { parse } from 'yaml';
import { TemplateDef, TemplateId } from '../types/project';

export default class Template {
    private static readonly definitions: TemplateDef[] = parse(
        readFileSync(PATH.join(__dirname, '../res/templates.yml'), 'utf-8')
    );

    private static list(): Template[] {
        return this.definitions.map((def) => new Template(def.id));
    }

    private readonly def: TemplateDef;
    public readonly id: TemplateId;

    constructor(id: TemplateId) {
        this.id = id;
        this.def = <TemplateDef>Template.definitions.find((def) => def.id === id);
    }

    get name() {
        return this.def.name;
    }

    get description() {
        return this.def.description
            .replace(/\*([^]*)\*/gi, chalk.italic('$1'))
            .replace(/<((yellow|blue))>([^]*)<\/\1>/gi, (_, color: string, __, inner: string) =>
                (<{ [key: string]: (m: string) => string }>(<unknown>chalk))[color](inner)
            );
    }
}
