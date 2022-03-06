// Type definitions for prompts 2.0
// Project: https://github.com/terkelg/prompts
// Definitions by: Berkay GURSOY <https://github.com/Berkays>
//                 Daniel Perez Alvarez <https://github.com/unindented>
//                 Kamontat Chantrachirathumrong <https://github.com/kamontat>
//                 theweirdone <https://github.com/theweirdone>
//                 whoaa512 <https://github.com/whoaa512>
//                 John Reilly <https://github.com/johnnyreilly>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

/// <reference types="node" />

export = prompts;

import { Chalk } from 'chalk';
import { Readable, Writable } from 'node:stream';

declare namespace prompts {

  // Based upon: https://github.com/terkelg/prompts/blob/d7d2c37a0009e3235b2e88a7d5cdbb114ac271b2/lib/elements/select.js#L29
  interface Choice {
    title: string;
    value?: Value;
    disabled?: boolean | undefined;
    selected?: boolean | undefined;
    description?: string | undefined;
  }

  interface Options<T> {
    onSubmit?:
      | ((prompt: PromptObject, answer: T, answers: T[]) => void)
      | undefined;
    onCancel?: ((prompt: PromptObject, answers: T) => void) | undefined;
  }

  interface PromptObject<T extends string = string> {
    type: PromptType | Falsy | PrevCaller<T, PromptType | Falsy>;
    name: ValueOrFunc<T>;
    message?: ValueOrFunc<string> | undefined;
    initial?:
      | InitialReturnValue
      | PrevCaller<T, InitialReturnValue | Promise<InitialReturnValue>>
      | undefined;
    style?: string | PrevCaller<T, string | Falsy> | undefined;
    format?: PrevCaller<T, void> | undefined;
    validate?:
      | PrevCaller<T, boolean | string | Promise<boolean | string>>
      | undefined;
    onState?: (color: Chalk) => void | undefined;
    onRender?: (color: Chalk) => void | undefined;
    min?: number | PrevCaller<T, number | Falsy> | undefined;
    max?: number | PrevCaller<T, number | Falsy> | undefined;
    float?: boolean | PrevCaller<T, boolean | Falsy> | undefined;
    round?: number | PrevCaller<T, number | Falsy> | undefined;
    instructions?: string | boolean | undefined;
    increment?: number | PrevCaller<T, number | Falsy> | undefined;
    separator?: string | PrevCaller<T, string | Falsy> | undefined;
    active?: string | PrevCaller<T, string | Falsy> | undefined;
    inactive?: string | PrevCaller<T, string | Falsy> | undefined;
    choices?: Choice[] | PrevCaller<T, Choice[] | Falsy> | undefined;
    hint?: string | PrevCaller<T, string | Falsy> | undefined;
    warn?: string | PrevCaller<T, string | Falsy> | undefined;
    suggest?: ((input: T, choices: Choice[]) => Promise<T>) | undefined;
    limit?: number | PrevCaller<T, number | Falsy> | undefined;
    mask?: string | PrevCaller<T, string | Falsy> | undefined;
    stdout?: Writable | undefined;
    stdin?: Readable | undefined;
    msg?: string;
    _value?: T;
    rendered?: string;
  }

  type Answers<T extends string> = { [id in T]: Value };

  type PrevCaller<T extends string, R = T> = (
    prev: unknown,
    values: Answers<T>,
    prompt: PromptObject
  ) => R;

  type Falsy = false | null | undefined;

  type PromptType =
    | 'text'
    | 'password'
    | 'invisible'
    | 'number'
    | 'confirm'
    | 'list'
    | 'toggle'
    | 'select'
    | 'multiselect'
    | 'autocomplete'
    | 'date'
    | 'autocompleteMultiselect';
  
  type Value = string | number | object | boolean | Date;

  type ValueOrFunc<T extends string> = T | PrevCaller<T>;

  type InitialReturnValue = string | number | boolean | Date;
}
