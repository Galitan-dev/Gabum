import chalk from 'chalk';
import BaseCommand from '../base-command';

export default class Test extends BaseCommand {
    static description = 'Test command';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    public async run(): Promise<void> {
        this.l.info('Testing prompter');

        const name = await this.textInput("What's your name?", {
            match: /^([A-Z][a-z]+-?)+$/g,
            min: 2,
            max: 20,
        });

        const age = await this.numberInput("What's your age?", {
            min: [13, 'This CLI is only for people over 12 years old'],
            max: [70, 'You should enjoy yourself of your last few years of your life'],
        });

        const country = await this.select<string>(
            "What's your contry?",
            [
                'France',
                'Spain',
                'The United Kingdom',
                'Italia',
                'The United States of America',
                'Germany',
                'Mexico',
                'Russia',
                'China',
                'Japan',
                'Australia',
            ],
            {
                autocomplete: true,
            }
        );

        const gender = await this.toggle("What's your gender?", 'Male', 'Female');

        if (
            !(await this.confirm(
                'We might store some data, are you sure you want to continue?',
                true
            ))
        ) {
            this.l.error('Okay, we respect your choices');
            this.exit(0);
        }

        this.l.info(
            'Now we have all this informations about you:',
            [
                '',
                ...Object.entries({
                    name,
                    age,
                    country,
                    gender,
                }).map(
                    ([k, v]) =>
                        chalk.red(k[0].toUpperCase() + k.slice(1)) +
                        ': ' +
                        chalk.green(v ?? "I don't know")
                ),
            ].join('\n  ')
        );
    }
}
