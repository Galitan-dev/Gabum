import { Chalk } from 'chalk';

export interface NumberPromptOptions {
    max?: Validator<number>;
    min?: Validator<number>;
}

export type TextPromptOptions = NumberPromptOptions & {
    match?: Validator<RegExp>;
    style?: 'default' | 'password' | 'emoji' | 'invisible';
    initial?: string;
    validate?: (input: string) => string | true;
    validateAsync?: (input: string) => Promise<string | true>;
};

export interface SelectPromptOptions<T> {
    autocomplete?: boolean;
    multiple?: boolean;
    hint?: string;
    showInstructions?: boolean;
    initial?: string | T;
}

export interface PromptChoice<T> {
    title: string;
    value: T;
    color?: Color;
    description?: string;
    selected?: boolean;
    disabled?: boolean;
}

export type Validator<T extends number | RegExp> = T | [T, string];
export type ValidatorHandler<T extends number | RegExp> = [
    Validator<T> | undefined,
    (validator: T) => string | true
];
export type ValidatorHandlerEnum = ValidatorHandler<number> | ValidatorHandler<RegExp>;

export type Color =
    | Chalk
    | 'red'
    | 'black'
    | 'blue'
    | 'cyan'
    | 'white'
    | 'green'
    | 'grey'
    | 'magenta'
    | 'white'
    | 'yellow';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'critical';
