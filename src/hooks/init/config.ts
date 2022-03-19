import { Hook } from '@oclif/core';
import { copyFileSync, statSync } from 'fs';
import PATH from 'path';
import { Config } from '../../config';

export default <Hook<'prerun'>>async function (opts) {
    const configPath = opts.config.home + '/.config/gabum/config.yml';

    try {
        statSync(configPath);
    } catch {
        copyFileSync(PATH.join(__dirname, '../../res/default-config.yml'), configPath);
    } finally {
        new Config(configPath);
    }
};
