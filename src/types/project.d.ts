declare interface ProjectInfos {
	name: string;
	description: string;
	private: boolean;
	type: ProjectType;
	language: ProjectLanguage;
	license: ProjectLicense;
}

declare type ProjectType = 'api' | 'blank' | 'cli' | 'discord' | 'simple' | 'webapp' | 'website';

declare type ProjectLanguage = 'js' | 'ts' | 'web' | 'rs' | 'other';
declare interface ProjectLicense {
	name: string;
	url: string;
	osiApproved: boolean;
}
