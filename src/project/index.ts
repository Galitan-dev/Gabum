import Conf from 'conf';
import os from 'os';
import PATH from 'path';
import { ProjectInfos } from '../types/project';
import { create } from './create';

const config = new Conf();

export default class Project {
    infos: ProjectInfos;
    path: string;

    constructor(infos: ProjectInfos) {
        this.infos = infos;
        this.path = PATH.join(
            <string>config.get('project-dir', PATH.join(os.homedir(), 'Documents/Development')),
            this.infos.name
        );
    }

    async create() {
        await create(this);
    }
}
