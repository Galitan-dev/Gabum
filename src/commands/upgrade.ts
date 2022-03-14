import { Command, Flags } from '@oclif/core';
import * as pm from 'detect-package-manager';
import shell from 'shelljs';

export default class Upgrade extends Command {
    static description = 'upgrade the package to the last version';

    static aliases = ['update', 'up'];

    static examples = ['<%= config.bin %> <%= command.id %>'];

    static flags = {
        // flag with a value (-w, --with=VALUE)
        with: Flags.string({
            char: 'w',
            description: 'package manager to use',
        }),
        // flag with no value (-f, --force)
        force: Flags.boolean({
            char: 'f',
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(Upgrade);

        const packageManager = flags.with ?? (await pm.detect());

        if (!['npm', 'yarn', 'pnpm'].includes(packageManager)) {
            return this.error('Invalid package manager. Should be one of npm, yarn, pnpm');
        }

        switch (packageManager) {
            case 'npm':
                shell.exec('npm install -g gabum@latest');
                break;
            case 'yarn':
                shell.exec('yarn global add gabum@latest');
                break;
            case 'pnpm':
                shell.exec('pnpm install -g gabum@latest');
                break;
        }
    }
}
