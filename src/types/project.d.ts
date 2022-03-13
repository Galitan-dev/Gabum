export declare interface ProjectInfos {
    name: string;
    author: string;
    description: string;
    private: boolean;
    type: ProjectType;
    language: ProjectLanguage;
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
