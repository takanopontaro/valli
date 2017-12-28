import { getValue } from '../toolbelt';
import { FormControl } from '../types';
import { Rule } from '../rule';

export interface Options {
  partner: string;
}

export class Different extends Rule {
  name = 'different';

  private partner: FormControl;

  constructor(el: FormControl, options: Options) {
    super(el);
    this.partner = <FormControl>document.querySelector(options.partner);
  }

  validate() {
    return getValue(this.el) !== getValue(this.partner);
  }
}
