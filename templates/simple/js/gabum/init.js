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
    let licenseModel, license;

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

                                let len = 0,
                                    encoding = 'utf8';
                                const chunks = [];
                                const writeStream = new Writable();
                                writeStream._write = function (chunk, enc, next) {
                                    encoding = enc || encoding;
                                    chunks.push(chunk);
                                    bar.tick((chunk.length / len) * 100);
                                    observer.next(bar.render());
                                    next();
                                };

                                request
                                    .get(infos.license.url)
                                    .on('error', (err) => {
                                        throw err;
                                    })
                                    .on('response', (res) => {
                                        len = parseInt(res.headers['content-length'] || 0);
                                    })
                                    .pipe(writeStream)
                                    .on('finish', () => {
                                        licenseModel = Buffer.concat(chunks).toString(encoding);
                                        setTimeout(() => observer.complete(), 2000);
                                    });
                            }),
                    },
                    {
                        title: 'Generating license',
                        task() {
                            license = licenseModel;
                            //.replace(...)
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
    ]);
};
