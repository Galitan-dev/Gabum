import { mkdirSync, writeFileSync } from 'fs';
import PATH from 'path';
import { Writable } from 'stream';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (ZIP: any, request: any) {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        download(fromInternet: string, bar?: any): Promise<Buffer> {
            return new Promise((resolve, reject) => {
                const writeStream = new Writable();

                let len = 0;
                let encoding: BufferEncoding = 'utf8';
                const chunks: Uint8Array[] = [];
                writeStream._write = function (chunk, _encoding, next) {
                    chunks.push(chunk);
                    encoding = _encoding || encoding;
                    bar?.tick((chunk.length / len) * 100);
                    next();
                };

                request
                    .get(fromInternet)
                    .set('Accept-Encoding', 'identity')
                    .on('error', (err: Error) => reject(err))
                    .on('response', (res: { headers: { [key: string]: string } }) => {
                        len = parseInt(res.headers['content-length'] || '1');
                        // if (len === 1) throw new Error('GitHub not passing content-length');
                    })
                    .pipe(writeStream)
                    .on('finish', async () => {
                        bar?.update(100);
                        resolve(Buffer.concat(chunks));
                    });
            });
        },
        async extract(directory: string, ofFileOrRawData: string | Buffer, toDirectory: string) {
            for (const e of new ZIP(ofFileOrRawData).getEntries()) {
                if (e.isDirectory) continue;

                const dir = e.entryName.split('/').slice(1, -1);
                if (!dir.join('/').startsWith(directory)) continue;

                const relativeDir = dir
                    .slice(directory.split('/').filter((s) => s.length > 0).length)
                    .join('/');

                mkdirSync(PATH.join(toDirectory, relativeDir), { recursive: true });
                writeFileSync(PATH.join(toDirectory, relativeDir, e.name), e.getData());
            }
        },
    };
}
