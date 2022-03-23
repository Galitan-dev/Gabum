import { Chalk } from 'chalk';

export interface NumberPromptOptions {
    max?: Validator<number>;
    min?: Validator<number>;
}

export type TextPromptOptions = NumberPromptOptions & {
    match?: Validator<RegExp>;
    style?: 'default' | 'password' | 'emoji' | 'invisible';
    initial?: string;
};

export interface SelectPromptOptions {
    autocomplete?: boolean;
    multiple?: boolean;
    hint?: string;
    showInstructions?: boolean;
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
