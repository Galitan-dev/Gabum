import chalk from 'chalk';
import prompts, { PromptObject as PO } from 'prompts';
import { PromptObject, PromptType } from '../types/prompts';
// import { quickPrompt } from '../types/base-command';

export default (async function prompt(message: string, options: PromptType | PromptObject) {
    const q: PromptObject<string> =
        typeof options === 'string' ? { type: options, name: 'answer' } : options;
    q.message = chalk.blue.italic(message);
    q.name = 'answer';

    return (await prompts(<PO<string>>q)).answer;
});
