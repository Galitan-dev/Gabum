const { writeFileSync, rmSync, renameSync } = require('fs');
const PATH = require('path');
const { Writable } = require('stream');

/**
 * @param {object} infos
 * @param {string} infos.name
 * @param {string} infos.author
 * @param {string} infos.description
 * @param {boolean} infos.boolean
 * @param {string} infos.type
 * @param {string} infos.language
 * @param {object} infos.license
 * @param {string} infos.license.id
 * @param {string} infos.license.name
 * @param {string} path
 * @returns {Listr}
 */
module.exports = function (infos, path, { Listr, Observable, ProgressBar, request, zip, shell }) {
    /** @type {license} */
    let licenseModel, license, templateArchive;

    return new Listr([
        {
            title: 'Creating License File',
            task: () =>
                new Listr([
                    {
                        title: 'Downloading license model',
                        task: () =>
                            new Observable((observer) => {
                                const bar = new ProgressBar(
                                    'downloading <bar> <percent> | time left: <timeLeft>'
                                );

                                let len = 0;
                                const chunks = [];
                                const writeStream = new Writable();
                                writeStream._write = function (chunk, _, next) {
                                    chunks.push(chunk);
                                    bar.tick((chunk.length / len) * 100);
                                    observer.next(bar.render());
                                    next();
                                };

                                request
                                    .get(
                                        `https://raw.githubusercontent.com/licenses/license-templates/master/templates/${infos.license.id}.txt`
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
                                .replace(/{{ organization }}/g, infos.author)
                                .replace(/{{ year }}/g, new Date().getFullYear())
                                .replace(/{{ project }}/g, infos.name);
                        },
                    },
                    {
                        title: 'Saving license',
                        task() {
                            writeFileSync(PATH.join(path, 'LICENSE'), license, 'utf8');
                        },
                    },
                ]),
        },
        {
            title: 'Generating Community Standards',
            task: () =>
                new Listr([
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
                    },
                    {
                        title: 'Extracting the template from the archive',
                        async task() {
                            await zip.extract('', templateArchive, path);
                        },
                    },
                    {
                        title: 'Moving files',
                        task() {
                            rmSync(PATH.join(path, 'LICENCE.txt'));
                            rmSync(PATH.join(path, 'README.md'));
                            renameSync(
                                PATH.join(path, 'BLANK_README.md'),
                                PATH.join(path, 'README.md')
                            );
                        },
                    },
                ]),
        },
    ]);
};

/**
 * @typedef license
 * @type {object}
 * @property {string} key
 * @property {string} name
 * @property {string} spdx_id
 * @property {string} node_id
 * @property {string} html_url
 * @property {string} description
 * @property {string} implementation
 * @property {string[]} permissions
 * @property {string[]} conditions
 * @property {string[]} limitations
 * @property {string} body
 * @property {boolean} featured
 */
