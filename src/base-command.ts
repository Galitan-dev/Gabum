import { Command } from '@oclif/core';
import chalk from 'chalk';
import prompts, { Choice } from 'prompts';
import conf, { Config } from './config';
import { mapArray } from './helpers/arrays';
import search from './helpers/search';
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
    private readonly logger = new Logger();
    get l(): Logger {
        return this.logger;
    }
    /** Add a new line */
    get nl(): Logger {
        this.log();
        return this.logger;
    }

    /** Clear the terminal */
    get nt(): Logger {
        process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
        console.clear();
        return this.logger;
    }

    readonly conf: Config = conf();

    async textInput(msg: string, options?: TextPromptOptions): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'text',
            style: options?.style,
            message: chalk.italic.blue(msg),
            initial: options?.initial,
            async validate(value: string) {
                return await validateAllAsync(
                    options?.validateAsync?.bind(null, value) ?? // eslint-disable-next-line prettier/prettier
                    options?.validate?.bind(null, value),
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
                        options?.validate?.bind(null, value),
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

    async numberInput(msg: string, options?: NumberPromptOptions): Promise<number> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'number',
            message: chalk.italic.blue(msg),
            validate(value: number) {
                return validateAll(
                    undefined,
                    [options?.min, (min) => value >= <number>min || `Mininum number is ${min}`],
                    [options?.max, (max) => value <= <number>max || `Maximum number is ${max}`]
                );
            },
            onRender() {
                const value = <number>(<unknown>this._value);
                this.rendered = (
                    validateAll(
                        undefined,
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

    async select<T extends string | number | object | boolean | Date>(
        msg: string,
        choices: (PromptChoice<T> | (T & (string | number | boolean)))[] | { [key: string]: T },
        options?: SelectPromptOptions<T>
    ): Promise<T[] | T> {
        const cs = Array.isArray(choices)
            ? choices.map(mapChoice)
            : Object.entries(choices).map(([title, value]) => ({ title, value }));
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
            choices: cs,
            initial: options?.initial,
            async suggest(query) {
                const res = search(
                    query,
                    cs.map((c) => c.title)
                );

                return <unknown>res.map((s) => (<Choice[]>cs).find((c) => c.title === s));
            },
        }));

        return res.answer;
    }

    async confirm(msg: string, initial?: boolean): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await prompts(<any>(<PromptObject>{
            name: 'answer',
            type: 'confirm',
            message: chalk.italic.blue(msg),
            initial,
        }));

        return res.answer;
    }

    async toggle(
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

async function validateAllAsync(
    callback?: () => string | true | Promise<string | true>,
    ...handlers: ValidatorHandler<number | RegExp>[]
): Promise<string | true> {
    const res = validateAll(undefined, ...handlers);
    if (typeof res === 'string') return res;
    if (callback) {
        return await callback();
    }
    return true;
}

function validateAll(
    callback?: () => string | true,
    ...handlers: ValidatorHandler<number | RegExp>[]
) {
    for (const [validator, handler] of handlers) {
        const res = validate(validator, handler);
        if (typeof res === 'string') return res;
    }
    if (callback) {
        return callback();
    }
    return true;
}

export class Logger {
    print(msg: string, ...args: unknown[]): void {
        console.log(msg, ...args);
    }

    log(msg: string, level: LogLevel = 'info', ...args: unknown[]): void {
        switch (level) {
            case 'info':
                console.info(chalk.cyan(chalk.bold('[INFO]: ') + msg), ...args);
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
                break;
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
