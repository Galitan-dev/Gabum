import { Hook } from '@oclif/core';
import { copyFileSync, statSync } from 'fs';
import PATH from 'path';
import { Config } from '../../config';

export default <Hook<'init'>>async function () {
    const configPath = process.env.GABUM_CONFIG_PATH + '/config.yml';

    try {
        statSync(configPath);
    } catch {
        copyFileSync(PATH.join(__dirname, '../../res/default-config.yml'), configPath);
    } finally {
        new Config(configPath);
    }
};
