const { Writable } = require('stream');
const { writeFileSync } = require('fs');
const PATH = require('path');

/**
 * @param {object} infos
 * @param {string} infos.name
 * @param {string} infos.description
 * @param {boolean} infos.boolean
 * @param {string} infos.type
 * @param {string} infos.language
 * @param {object} infos.license
 * @param {string} path
 * @returns {Listr}
 */
module.exports = function (infos, path, { Listr, Observable, ProgressBar, request }) {
    /** @type {license} */
    let licenseModel;
    let license;

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
                                    .get(infos.license.url)
                                    .set('user-agent', 'node.js')
                                    .on('error', (err) => {
                                        throw err;
                                    })
                                    .on('response', (res) => {
                                        len = parseInt(res.headers['content-length'] || 0);
                                    })
                                    .pipe(writeStream)
                                    .on('finish', () => {
                                        licenseModel = JSON.parse(
                                            Buffer.concat(chunks).toString('utf8')
                                        );
                                        observer.complete();
                                    });
                            }),
                    },
                    {
                        title: 'Generating license',
                        task() {
                            license = licenseModel.body;
                            //.replace(...)
                        },
                    },
                    {
                        title: 'Saving license',
                        task() {
                            writeFileSync(
                                PATH.join(path, 'gabum/license.json'),
                                JSON.stringify(licenseModel, null, 4)
                            );
                            writeFileSync(PATH.join(path, 'LICENSE'), license, 'utf8');
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
 */
