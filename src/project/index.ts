import * as Conf from 'conf';
import * as os from 'os';
import * as PATH from 'path';

const config = new Conf();

export default class Project {
	infos: ProjectInfos;
	path: string;

	constructor(infos: ProjectInfos) {
		this.infos = infos;
		this.path = PATH.join(
			<string>config.get('project-dir', PATH.join(os.homedir(), 'Documents/Development')),
			this.infos.language
		);
	}

	// create() {

	// }
}
