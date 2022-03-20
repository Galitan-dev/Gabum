import { Command } from '@oclif/core';
import chalk from 'chalk';
import conf, { Config } from './config';

export default abstract class BaseCommand extends Command {
    protected readonly logger = new Logger();
    protected get l(): Logger {
        return this.logger;
    }

    protected readonly conf: Config = conf();
}

export class Logger {
    log(msg: string, level: LogLevel = 'info', ...args: unknown[]): void {
        switch (level) {
            case 'info':
                console.info(chalk.blue(chalk.bold('[INFO]: ') + msg), ...args);
                break;
            case 'warn':
                console.warn(chalk.yellow(chalk.bold('[WARN]: ') + msg), ...args);
                break;
            case 'debug':
                console.debug(chalk.grey(chalk.bold('[DEBUG]: ') + msg), ...args);
                break;
            case 'error':
                console.error(chalk.red(chalk.bold('[ERROR]: ') + msg), ...args);
                break;
            case 'critical':
                console.error(chalk.magenta(chalk.bold('[CRITICAL]: ') + msg), ...args);
        }
    }

    info(msg: string, ...args: unknown[]): void {
        this.log(msg, 'info', ...args);
    }

    debug(...args: unknown[]): void {
        if (typeof args[0] === 'string') this.log(args[0], 'debug', ...args.slice(1));
        else
            this.log(
                `At ${new Error().stack
                    ?.split('\n')[1]
                    .match(/\(.*\)/g)
                    ?.toString()
                    .replace(/[()]/g, '')}`,
                'debug',
                ...args
            );
    }

    warn(msg: string, ...args: unknown[]): void {
        this.log(msg, 'warn', ...args);
    }

    error(msg: string | Error, ...args: unknown[]): void {
        this.log(msg.toString(), 'error', ...args);
    }

    critical(msg: string, ...args: unknown[]): void {
        this.log(msg, 'critical', ...args);
    }
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'critical';
