import {
  checkbox,
  confirm,
  input,
  select,
} from "@inquirer/prompts";

export interface PromptChoice<T extends string = string> {
  readonly name: string;
  readonly value: T;
  readonly description?: string;
  readonly checked?: boolean;
}

export interface PromptRunner {
  select<T extends string>(message: string, choices: readonly PromptChoice<T>[], defaultValue?: T): Promise<T>;
  checkbox<T extends string>(message: string, choices: readonly PromptChoice<T>[]): Promise<T[]>;
  input(message: string, defaultValue?: string): Promise<string>;
  confirm(message: string, defaultValue?: boolean): Promise<boolean>;
}

export const defaultPromptRunner: PromptRunner = {
  select: (message, choices, defaultValue) =>
    select({ message, choices: choices.map(toInquirerChoice), default: defaultValue }),
  checkbox: (message, choices) =>
    checkbox({ message, choices: choices.map(toInquirerChoice) }),
  input: (message, defaultValue) => input({ message, default: defaultValue }),
  confirm: (message, defaultValue = false) => confirm({ message, default: defaultValue }),
};

function toInquirerChoice<T extends string>(choice: PromptChoice<T>) {
  return {
    name: choice.name,
    value: choice.value,
    description: choice.description,
    checked: choice.checked,
  };
}
