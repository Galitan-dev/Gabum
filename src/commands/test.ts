import BaseCommand from '../base-command';

export default class Test extends BaseCommand {
    static description = 'test command';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    public async run(): Promise<void> {
        this.l.info('Testing congig');

        this.l.debug('Actual config: \n' + this.conf.toColoredString());
        this.conf.defaultProjectSettings.description = 'The test worked !';
        this.l.debug('New config: \n' + this.conf.toColoredString());

        this.l.info("Don't worry, not saving this...");
    }
}
