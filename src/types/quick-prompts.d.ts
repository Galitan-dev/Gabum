import { PromptObject, PromptType } from './prompts';

export function quickPrompt(message: string, options: PromptType | PromptObject): Promise<unknown>;
export function quickPrompt(message: string, options: 'number'): Promise<number>;
export function quickPrompt(
    message: string,
    options: 'text' | 'password' | 'invisible'
): Promise<string>;
export function quickPrompt(message: string, options: 'confirm'): Promise<boolean>;
export function quickPrompt<T>(
    message: string,
    options: {
        type: 'select' | 'autocomplete';
        hint?: string;
        instructions?: boolean;
        initial?: string;
        choices: {
            title: string;
            value: T;
            description?: string;
        }[];
    }
): Promise<T>;
