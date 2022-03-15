import { Command } from '@oclif/core';
import chalk from 'chalk';

export default class Test extends Command {
    static description = 'test command';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    public async run(): Promise<void> {
        this.log(chalk.yellow('There is currently nothing to test.'));
    }
}
