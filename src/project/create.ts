import ZIP from 'adm-zip';
import { readFileSync, renameSync, rmSync, writeFileSync } from 'fs';
import { Listr } from 'listr2';
import PATH from 'path';
import { Observable } from 'rxjs';
import shell from 'shelljs';
import { Writable } from 'stream';
import request from 'superagent';
import Project from '.';
import ProgressBar from '../helpers/progress';
import * as zip from '../helpers/zip';
import portableZip from '../helpers/zip-portable';

shell.config.silent = true;

export async function create(project: Project) {
    const tasks = new Listr(
        [
            {
                title: 'Downloading the template',
                task: downloadTemplate.bind(null, project),
                options: {
                    showTimer: true,
                },
            },
            {
                title: 'Creating License File',
                task: generateLicense.bind(null, project),
                options: {
                    showTimer: true,
                },
            },
            {
                title: 'Generating Community Standards',
                task: generateCommunityStandards.bind(null, project),
                options: {
                    showTimer: true,
                },
            },
            {
                title: 'Initializing the project',
                task: runInitializationScript.bind(null, project),
                options: {
                    showTimer: true,
                },
            },
            {
                title: 'Publising the project',
                task: publishProject.bind(null, project),
                options: {
                    showTimer: true,
                },
            },
        ],
        {
            rendererOptions: {
                collapse: false,
            },
        }
    );

    await tasks.run();
}

function downloadTemplate(project: Project) {
    let templateArchive: Buffer;
    return new Listr([
        {
            title: 'Downloading template archive',
            task: (): Observable<string> =>
                new Observable((observer) => {
                    const bar = new ProgressBar(
                        'downloading <bar> <percent> | time left: <timeLeft>'
                    );
                    shell.mkdir('-p', project.path);
                    zip.download('https://github.com/galitan-dev/gabum/archive/main.zip', bar).then(
                        (archive) => {
                            templateArchive = archive;
                            observer.complete();
                        }
                    );
                    const interval = setInterval(() => {
                        if (bar.complete) {
                            clearInterval(interval);
                        } else {
                            observer.next(bar.render());
                        }
                    });
                }),
            options: {
                bottomBar: true,
            },
        },
        {
            title: 'Extracting the template from the archive',
            async task() {
                await zip.extract(
                    'templates/' + project.template.id,
                    templateArchive,
                    project.path
                );
            },
        },
    ]);
}

function generateLicense(project: Project) {
    let licenseModel: string, license: string;
    return new Listr([
        {
            title: 'Downloading license model',
            task: () =>
                new Observable((observer) => {
                    const bar = new ProgressBar(
                        'downloading <bar> <percent> | time left: <timeLeft>'
                    );

                    let len = 0;
                    const chunks: Uint8Array[] = [];
                    const writeStream = new Writable();
                    writeStream._write = function (chunk, _, next) {
                        chunks.push(chunk);
                        bar.tick((chunk.length / len) * 100);
                        observer.next(bar.render());
                        next();
                    };

                    request
                        .get(
                            'https://raw.githubusercontent.com/licenses/license-templates/master/templates/' + // eslint-disable-next-line prettier/prettier
                            project.def.license.id + // eslint-disable-next-line prettier/prettier
                            '.txt'
                        )
                        .set('user-agent', 'node.js')
                        .on('error', (err) => {
                            throw err;
                        })
                        .on('response', (res) => {
                            len = parseInt(res.headers['content-length'] || 0);
                        })
                        .pipe(writeStream)
                        .on('finish', () => {
                            licenseModel = Buffer.concat(chunks).toString('utf8');

                            observer.complete();
                        });
                }),
        },
        {
            title: 'Generating license',
            task() {
                license = licenseModel
                    .replace(/{{ organization }}/g, project.def.author)
                    .replace(/{{ year }}/g, new Date().getFullYear().toString())
                    .replace(/{{ project }}/g, project.def.name);
            },
        },
        {
            title: 'Saving license',
            task() {
                writeFileSync(PATH.join(project.path, 'LICENSE'), license, 'utf8');
            },
        },
    ]);
}

function generateCommunityStandards(project: Project) {
    let templateArchive: Buffer;
    return new Listr([
        {
            title: 'Downloading template archive',
            task: () =>
                new Observable((observer) => {
                    const bar = new ProgressBar(
                        'downloading <bar> <percent> | time left: <timeLeft>'
                    );

                    zip.download(
                        'https://github.com/othneildrew/Best-README-Template/archive/master.zip',
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
                bottomBar: true,
            },
        },
        {
            title: 'Extracting the template from the archive',
            async task() {
                await zip.extract('', templateArchive, project.path);
            },
        },
        {
            title: 'Moving files',
            task() {
                rmSync(PATH.join(project.path, 'LICENSE.txt'));
                rmSync(PATH.join(project.path, 'README.md'));
                renameSync(
                    PATH.join(project.path, 'BLANK_README.md'),
                    PATH.join(project.path, 'README.md')
                );
            },
        },
        {
            title: 'Editing ReadMe',
            task() {
                const readmeTemplate = readFileSync(PATH.join(project.path, 'README.md'), 'utf-8');
                const readme = readmeTemplate
                    .replace(
                        '`github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`',
                        '`twitter_handle`, `linkedin_username`, `email_client`, `email`'
                    )
                    .replace(/github_username/g, project.def.author)
                    .replace(/repo_name/g, project.def.name)
                    .replace(/project_title/g, project.def.name)
                    .replace(/project_description/g, project.def.description)
                    .replace(/MIT License/g, project.def.license.name)
                    .replace(/LICENSE\.txt/g, 'LICENSE')
                    .replace(/Your Name/, project.def.author);

                writeFileSync(PATH.join(project.path, 'README.md'), readme, 'utf-8');
            },
        },
    ]);
}

function runInitializationScript(project: Project) {
    const filePath = PATH.join(project.path, '.gabum/init.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(filePath);
    return mod(project.def, project.path, {
        request,
        Listr,
        Observable,
        ProgressBar,
        zip: portableZip(ZIP, request),
        shell,
    });
}

function publishProject(project: Project) {
    return new Listr([
        {
            title: 'Create local repository',
            async task() {
                await shell.exec('git init ' + project.path + ' --quiet');
            },
        },
        {
            title: 'Create a new repository on GitHub',
            async task() {
                await shell.exec(
                    [
                        'gh repo create',
                        JSON.stringify(project.def.name),
                        '--description',
                        JSON.stringify(project.def.description),
                        JSON.stringify(project.def.private ? '--private' : '--public'),
                        '--source',
                        JSON.stringify(project.path),
                        '--remote upstream',
                    ].join(' ')
                );
            },
        },
        {
            title: 'Linking local repository to GitHub',
            async task() {
                await shell.exec(
                    `git remote add origin https://github.com/${project.def.author}/${project.def.name}.git`,
                    {
                        cwd: project.path,
                    }
                );
            },
        },
        {
            title: 'Pushing first changes to GitHub',
            async task() {
                await shell.exec('git add -A', { cwd: project.path });
                await shell.exec('git commit -qm "Initial Commit (gabum)"', {
                    cwd: project.path,
                });
                await shell.exec('git push --quiet -u origin main', {
                    cwd: project.path,
                });
            },
        },
    ]);
}
