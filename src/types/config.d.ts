import { TemplateId } from './project';

export declare interface DefaultProjectSettings {
    description: string;
    private: boolean;
    template: TemplateId;
    license: string;
}

export declare interface Commands {
    ide: string;
    terminal: string;
    others: { name: string; cmd: string }[];
}
