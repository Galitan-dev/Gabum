import { Hook } from '@oclif/core';
import shell from 'shelljs';

export default <Hook<'init'>>async function () {
    const yarn = await shell.which('yarn'),
        git = await shell.which('git'),
        gh = await shell.which('gh');

    if (yarn?.code !== 0) {
        process.stdout.write(
            'Gabum requires yarn to be installed.\nPlease install it at https://classic.yarnpkg.com/lang/en/docs/install/'
        );
        process.exit(1);
    }

    if (git?.code !== 0) {
        process.stdout.write(
            'Gabum requires git to be installed.\nPlease install it at https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Installation-de-Git'
        );
        process.exit(1);
    }

    if (gh?.code !== 0) {
        process.stdout.write(
            'Gabum requires gh to be installed.\nPlease install it at https://github.com/cli/cli#installation'
        );
    }
};
