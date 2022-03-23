import chalk from 'chalk';
import { textSync as bigText } from 'figlet';
import { existsSync } from 'fs';
import PATH from 'path';
import BaseCommand from '../base-command';
import licenses from '../res/licenses.json';

export default class Config extends BaseCommand {
    static description = 'Configure Gabum CLI';
    static aliases = ['conf', 'settings'];
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> conf',
        '<%= config.bin %> settings',
    ];

    public async run(): Promise<void> {
        const config = this.conf;
        const homedir = this.config.home;
        while (true) {
            const color = chalk.greenBright;
            this.nt.print(
                bigText('  Gabum  Config  ', 'Star Wars')
                    .split('\n')
                    .map((l, i, a) => {
                        if (i === 0) {
                            return (
                                '  ' +
                                color.inverse(new Array(l.length - 4).fill(' ').join('')) +
                                '\n' +
                                color.bold.inverse(l)
                            );
                        }
                        if (i === a.length - 1) {
                            return (
                                color.bold.inverse(l) +
                                '\n  ' +
                                color.inverse(new Array(l.length - 4).fill(' ').join(''))
                            );
                        }
                        return color.inverse.bold(l);
                    })
                    .join('\n')
            );

            this.nl.print(config.toColoredString());
            this.nl;

            const action = await this.select<'cancel' | 'save' | 'reset' | 'set'>(
                'What do you want to do ?',
                {
                    [chalk.cyan('Modify settings')]: 'set',
                    [chalk.yellow('Reset to default settings')]: 'reset',
                    [chalk.green('Save and quit')]: 'save',
                    [chalk.red('Cancel')]: 'cancel',
                }
            );

            switch (action) {
                case 'cancel':
                    if (!(await this.confirm('Quit without saving?'))) break;
                    this.exit(0);
                case 'save':
                    config.save();
                    this.exit(0);
                case 'reset':
                    if (!(await this.confirm('Reset to default settings?'))) break;
                    this.log('Resetting settings...');
                    config.loadFile(PATH.join(__dirname, '../res/default-config.yml'));
                    this.log('Settings reset!');
                    break;
                case 'set': {
                    const setting = await chooseSetting(this);
                    const defaultProjectSettings = config.defaultProjectSettings;
                    const commands = config.commands;
                    switch (setting) {
                        case 'project-dir':
                            config.projectDir = await this.textInput('Project Directory?', {
                                initial: config.projectDir,
                                validate(value) {
                                    return (
                                        existsSync(value.replace(/<home-dir>/g, homedir)) ||
                                        'Directory does not exist'
                                    );
                                },
                            });
                            break;
                        case 'project-visibility':
                            defaultProjectSettings.private = await this.toggle(
                                'Project visibility',
                                'Private',
                                'Public',
                                defaultProjectSettings.private
                            );
                            break;
                        case 'project-description':
                            defaultProjectSettings.description = await this.textInput(
                                'Project Description',
                                {
                                    initial: defaultProjectSettings.description,
                                }
                            );
                            break;
                        case 'project-template':
                            // TODO
                            break;
                        case 'project-license':
                            defaultProjectSettings.license = <string>await this.select(
                                'Project License',
                                Object.values(licenses).map((l) => ({
                                    title: l.name,
                                    value: l.name,
                                }))
                            );
                            break;
                        case 'commands-ide':
                            commands.ide = await this.textInput('IDE Command', {
                                initial: commands.ide,
                            });
                            break;
                        case 'commands-terminal':
                            commands.terminal = await this.textInput('Terminal Command', {
                                initial: commands.terminal,
                            });
                            break;
                    }
                    config.defaultProjectSettings = defaultProjectSettings;
                    config.commands = commands;
                    break;
                }
            }
        }
    }

    exit(code?: number): void {
        process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
        console.clear();
        super.exit(code);
    }
}

async function chooseSetting<Cmd extends BaseCommand>(cmd: Cmd): Promise<Setting> {
    const setting = await cmd.select<'project-dir' | 'default-project-settings' | 'commands'>(
        'Wich setting?',
        {
            'Project Directory': 'project-dir',
            'Default Project Settings': 'default-project-settings',
            Commands: 'commands',
        }
    );

    switch (setting) {
        case 'default-project-settings':
            const projectSetting = await cmd.select<
                'description' | 'visibility' | 'license' | 'template'
            >('Wich project setting?', {
                Description: 'description',
                Visibility: 'visibility',
                License: 'license',
                Template: 'template',
            });

            return <Setting>('project-' + projectSetting);
        case 'commands':
            const command = await cmd.select<'ide' | 'terminal'>('Wich command?', {
                IDE: 'ide',
                Terminal: 'terminal',
            });

            return <Setting>('commands-' + command);
        default:
            return <Setting>setting;
    }
}

type Setting =
    | 'project-dir'
    | 'project-description'
    | 'project-visibility'
    | 'project-license'
    | 'project-template'
    | 'commands-ide'
    | 'commands-terminal';
