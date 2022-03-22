import ZIP from 'adm-zip';
import events from 'events';
import { Listr } from 'listr2';
import PATH from 'path';
import { Observable } from 'rxjs';
import shell from 'shelljs';
import request from 'superagent';
import Project from '.';
import ProgressBar from '../helpers/progress';
import * as zip from '../helpers/zip';
import portableZip from '../helpers/zip-portable';

shell.config.silent = true;

export class Test extends events.EventEmitter {
    _: undefined;
}

export async function create(project: Project) {
    let templateArchive: Buffer;

    const tasks = new Listr(
        [
            {
                title: 'Downloading the template',
                task: () =>
                    new Listr([
                        {
                            title: 'Downloading template archive',
                            task: (): Observable<string> =>
                                new Observable((observer) => {
                                    const bar = new ProgressBar(
                                        'downloading <bar> <percent> | time left: <timeLeft>'
                                    );
                                    shell.mkdir('-p', project.path);
                                    zip.download(
                                        'https://github.com/galitan-dev/gabum/archive/main.zip',
                                        bar
                                    ).then((archive) => {
                                        templateArchive = archive;
                                        observer.complete();
                                    });
                                    const interval = setInterval(() => {
                                        if (bar.complete) {
                                            clearInterval(interval);
                                        } else {
                                            observer.next(bar.render());
                                        }
                                    });
                                }),
                            options: {
                                bottomBar: true
                            }
                        },
                        {
                            title: 'Extracting the template from the archive',
                            async task() {
                                await zip.extract(
                                    `templates/${project.infos.type}/${project.infos.language}`,
                                    templateArchive,
                                    project.path
                                );
                            }
                        }
                    ]),
                options: {
                    showTimer: true
                }
            },
            {
                title: 'Initializing the project',
                task() {
                    const filePath = PATH.join(project.path, '.gabum/init.js');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const mod = require(filePath);
                    return mod(project.infos, project.path, {
                        request,
                        Listr,
                        Observable,
                        ProgressBar,
                        zip: portableZip(ZIP, request),
                        shell
                    });
                },
                options: {
                    showTimer: true
                }
            },
            {
                title: 'Publising the project',
                task: () =>
                    new Listr([
                        {
                            title: 'Create local repository',
                            async task() {
                                await shell.exec('git init ' + project.path + ' --quiet');
                            }
                        },
                        {
                            title: 'Create a new repository on GitHub',
                            async task() {
                                await shell.exec(
                                    [
                                        'gh repo create',
                                        JSON.stringify(project.infos.name),
                                        '--description',
                                        JSON.stringify(project.infos.description),
                                        JSON.stringify(
                                            project.infos.private ? '--private' : '--public'
                                        ),
                                        '--source',
                                        JSON.stringify(project.path),
                                        '--remote upstream'
                                    ].join(' ')
                                );
                            }
                        },
                        {
                            title: 'Linking local repository to GitHub',
                            async task() {
                                await shell.exec(
                                    `git remote add origin https://github.com/${project.infos.author}/${project.infos.name}.git`,
                                    {
                                        cwd: project.path
                                    }
                                );
                            }
                        },
                        {
                            title: 'Pushing first changes to GitHub',
                            async task() {
                                await shell.exec('git add -A', { cwd: project.path });
                                await shell.exec('git commit -qm "Initial Commit (gabum)"', {
                                    cwd: project.path
                                });
                                await shell.exec('git push --quiet -u origin main', {
                                    cwd: project.path
                                });
                            }
                        }
                    ]),
                options: {
                    showTimer: true
                }
            }
        ],
        {
            rendererOptions: {
                collapse: false
            }
        }
    );

    await tasks.run();
}
