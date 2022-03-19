import chalk from 'chalk';
import prompts, { PromptObject as PO } from 'prompts';
import { PromptObject, PromptType } from '../types/prompts';
import { quickPrompt } from '../types/quick-prompts';

export default <typeof quickPrompt>(
    async function prompt(message: string, options: PromptType | PromptObject) {
        const q: PromptObject<string> =
            typeof options === 'string' ? { type: options, name: 'answer' } : options;
        q.message = chalk.blue.italic(message);
        q.name = 'answer';

        return (await prompts(<PO<string>>q)).answer;
    }
);
