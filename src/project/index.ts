import PATH from 'path';
import { Config } from '../config';
import { ProjectInfos } from '../types/project';
import { create } from './create';
import Template from './template';

export default class Project {
    infos: ProjectInfos;
    path: string;

    constructor(infos: ProjectInfos, conf: Config) {
        this.infos = infos;
        this.path = PATH.join(conf.projectDir, this.infos.name);
    }

    get template() {
        return new Template(this.infos.template);
    }

    async create() {
        await create(this);
    }
}
