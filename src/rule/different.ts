import { ExpControl, FormControl } from '../types';
import { Rule } from '../rule';
import { Item } from '../item';

export interface Options {
  partner: ExpControl;
}

export class Different extends Rule {
  name = 'different';

  private partner: FormControl;

  constructor(exp: ExpControl, options: Options) {
    super(exp);
    const node = Item.getNode(options.partner);
    if (node === null) {
      throw new Error('cannot find the element');
    }
    this.partner = node;
  }

  validate() {
    return Item.getValue(this.el) !== Item.getValue(this.partner);
  }
}
