export declare interface ProjectInfos {
    name: string;
    author: string;
    description: string;
    private: boolean;
    template: TemplateId;
    license: ProjectLicense;
}

export declare type ProjectType =
    | 'api'
    | 'blank'
    | 'cli'
    | 'discord'
    | 'simple'
    | 'webapp'
    | 'website';

export declare type ProjectLanguage = 'js' | 'ts' | 'web' | 'rs' | 'other';
export declare interface ProjectLicense {
    name: string;
    id: string;
}

export declare type TemplateId = 'simple/js' | 'discord/js' | 'simple/ts' | 'discord/ts';

export declare interface TemplateDef {
    id: TemplateId;
    name: string;
    description: string;
}
