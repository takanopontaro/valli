import { Rule } from './rule';

export type RuleClass = new (...args: any[]) => Rule;

export type FormControl =
  | HTMLSelectElement
  | HTMLInputElement
  | HTMLTextAreaElement;

export interface NativeValidatorOptions {
  required: boolean;
  pattern: boolean;
  overflow: boolean;
  underflow: boolean;
  step: boolean;
  long: boolean;
  short: boolean;
  type: boolean;
}

export interface ValidityInfo {
  dirty: boolean;
  valid: boolean;
  native: ValidityState;
  custom: ValidityResult[];
}

export interface ValidityResult {
  name: string;
  valid: boolean;
}

export interface ItemOptions {
  native?: boolean | Partial<NativeValidatorOptions>;
  rule?: any;
  [key: string]: any;
}
