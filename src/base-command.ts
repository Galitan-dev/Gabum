import { Command } from '@oclif/core';
import chalk from 'chalk';
import prompts from 'prompts';
import conf, { Config } from './config';
import { mapArray } from './helpers/arrays';
import {
    LogLevel,
    NumberPromptOptions,
    PromptChoice,
    SelectPromptOptions,
    TextPromptOptions,
    Validator,
    // eslint-disable-next-line prettier/prettier
    ValidatorHandler
} from './types/base-command';
import { PromptObject } from './types/prompts';

export default abstract class BaseCommand extends Command {
    protected readonly logger = new Logger();
    protected get l(): Logger {
        return this.logger;
    }
    protected get nl(): Logger {
        this.log();
        return this.logger;
    }

    protected get nt(): Logger {
        process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
        console.clear();
        return this.logger;
    }

    protected readonly conf: Config = conf();

    protected async textInput(msg: string, options?: TextPromptOptions): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'text',
            style: options?.style,
            message: chalk.italic.blue(msg),
            validate(value: string) {
                return validateAll(
                    [
                        options?.min,
                        (min) => value.length >= <number>min || `Mininum text length is ${min}`,
                    ],
                    [
                        options?.max,
                        (max) => value.length <= <number>max || `Maximum text length is ${max}`,
                    ],
                    [
                        options?.match,
                        (regexp) =>
                            (<RegExp>regexp).test(value) || `Text does not match regexp ${regexp}`,
                    ]
                );
            },
            onRender() {
                const value = <string>(<unknown>this._value);
                this.rendered = (
                    validateAll(
                        [options?.min, (min) => value.length >= <number>min || ''],
                        [options?.max, (max) => value.length <= <number>max || ''],
                        [options?.match, (regexp) => value.match(<RegExp>regexp) !== null || '']
                    ) === true
                        ? chalk.green
                        : chalk.red
                )(this.rendered);
            },
        }));

        return res.answer;
    }

    protected async numberInput(msg: string, options?: NumberPromptOptions): Promise<number> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'number',
            message: chalk.italic.blue(msg),
            validate(value: number) {
                return validateAll(
                    [options?.min, (min) => value >= <number>min || `Mininum number is ${min}`],
                    [options?.max, (max) => value <= <number>max || `Maximum number is ${max}`]
                );
            },
            onRender() {
                const value = <number>(<unknown>this._value);
                this.rendered = (
                    validateAll(
                        [options?.min, (min) => value >= <number>min || ''],
                        [options?.max, (max) => value <= <number>max || '']
                    ) === true
                        ? chalk.green
                        : chalk.red
                )(this.rendered);
            },
        }));

        return res.answer;
    }

    protected async select<T extends string | number | object | boolean | Date>(
        msg: string,
        choices: (PromptChoice<T> | (T & (string | number | boolean)))[] | { [key: string]: T },
        options?: SelectPromptOptions
    ): Promise<T[] | T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: mapArray(
                [options?.multiple ?? false, options?.autocomplete ?? false],
                [[false, false], 'select'],
                [[true, false], 'multiselect'],
                [[false, true], 'autocomplete'],
                [[true, true], 'autocompleteMultiselect']
            ),
            message: chalk.italic.blue(msg),
            hint: options?.hint ?? 'Space to select. Return to submit',
            instructions: options?.showInstructions ?? false,
            choices: Array.isArray(choices)
                ? choices.map(mapChoice)
                : Object.entries(choices).map(([title, value]) => ({ title, value })),
        }));

        return res.answer;
    }

    protected async confirm(msg: string, initial?: boolean): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'confirm',
            message: chalk.italic.blue(msg),
            initial,
        }));

        return res.answer;
    }

    protected async toggle(
        msg: string,
        active?: string,
        inactive?: string,
        initial?: boolean
    ): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'toggle',
            message: chalk.italic.blue(msg),
            initial,
            active,
            inactive,
        }));

        return res.answer;
    }
}

function mapChoice<T>(c: PromptChoice<T> | T) {
    const ch = <PromptChoice<T>>c;
    if (typeof c === 'object')
        return {
            title: (typeof ch.color === 'string' ? chalk[ch.color] : ch.color ?? chalk)(ch.title),
            value: ch.value,
            disabled: ch.disabled,
            description: ch.description,
            selected: ch.selected,
        };
    return { title: ch.toString(), value: ch };
}

function validate<T extends number | RegExp>(
    validator: Validator<T> | undefined,
    handler: (validator: T) => string | true
): string | undefined {
    if (!validator) return undefined;
    const result = handler(Array.isArray(validator) ? validator[0] : validator);
    if (result === true) return undefined;
    return Array.isArray(validator) ? validator[1] : result;
}

function validateAll(...handlers: ValidatorHandler<number | RegExp>[]): string | true {
    let result: string | true = true;
    for (const [validator, handler] of handlers) {
        const res = validate(validator, handler);
        if (typeof res === 'string') result = res;
        else continue;
        break;
    }
    return result;
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
