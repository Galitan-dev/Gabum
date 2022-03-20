import BaseCommand from '../base-command';

export default class Test extends BaseCommand {
    static description = 'test command';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    conf = undefined;

    public async run(): Promise<void> {
        this.l.info('Running Test Logs...');
        this.l.debug(this.config.topics);
        this.l.warn('Invalid config:', this.conf);
        this.l.error('Missing ideas for testing');
        this.l.critical('Giving up');

        // this.log('There is currently nothing to test.', 'warn');
    }
}
