# class: Valli
Main class for this module.
The following is a simple example of using a Valli.

```js
import { Valli } from 'Valli';

const form = document.querySelector('form');
const controls = Array.from(document.querySelectorAll('input'));
const button = document.querySelector('button');

const valli = new Valli({ form, controls });

button.addEventListener('click', () => console.log(valli.valid), false);
```

## constructor(options)
- `options` <[Object]>
  - `form` <[HTMLElement]> a `<form>` element.
  - `controls` <[Array]<[HTMLElement]>> Array of form elements that are `<input>`, `<textarea>` or `<select>`.
  - `attrName` <[string]> A custom data attribute name for Valli. Defaults to `data-valli`.
  - `events` <[Array]<[string]>> A list of events for observing user inputs. Defaults to `['change', 'input', 'paste', 'cut', 'drop']`.
  - `wait` <[number]> A wait for debounce of validation. Defaults to `100`.
- returns: <[Valli]>

## valli.destroy()
Destroys a valli and remove event listeners.

## valli.getItem(element)
- `element` <[HTMLElement]> A form element that is `<input>`, `<textarea>` or `<select>`.
- returns: <[Item]>

Gets an valli item object.

## valli.valid
- returns: <[boolean]>

Whether all elements inside a form are valid or not.

## valli.validate(dryRun = false)
- `dryRun` <[boolean]> Only validation not dispatch an event.
- returns: <[Array]<[ValidityInfo]>>

Gets results of validation of all form elements.

# class: Item
A class for a single form element.
For use in validation one by one.

```js
const element = document.querySelector('input');
const item = valli.getItem(element);

item.validate();
```

## event: 'valli'
- <[CustomEvent]>

When a user input occurs, this event will be dispatched with one argument of <[CustomEvent]>.
`CustomEvent.detail` is <[ValidityInfo]> for that element.

```js
const element = document.querySelector('input');

element.addEventListener('valli', ev => {
  console.log(element === ev.detail.el); //= true
  console.log(ev.detail.valid ? 'OK' : 'NG');
}, false);
```

This event bubbles up so you can listen it on one place, a form itself.
The following is a typical example. This is a recommended usage of this module.

```js
const form = document.querySelector('form');
const element = document.querySelector('input');

form.addEventListener('valli', ev => {
  console.log(element === ev.detail.el); //= true
  console.log(ev.detail.valid ? 'OK' : 'NG');
}, false);
```

## item.el
- returns: <[HTMLElement]> A related form element.

## item.validate(dryRun = false, type = '')
- `dryRun` <[boolean]> Only validation not dispatch an event.
- `type` <[string]> Event type. Passes to <[ValidityInfo]>.
- returns: <[ValidityInfo]>

# type: ValidityInfo
A result of validation.

- `el` <[HTMLElement]> A related form element.
- `type` <[string]> Event type. Possibly an empty string if a validate method is invoked programmatically.
- `value` <[string]|undefined> A current value.
- `prev` <[string]|undefined> A previous value.
- `valid` <[boolean]> Whether that element is valid or not.
- `params` <[Object]> Key-value pairs difined in json of `data-valli`.
- `custom` <[Object]> Results of custom validators.
  - `[rule name]` <[ValidityResult]> Key is a name of a builtin or custom validator and value is that result.

# type: ValidityResult
A result of a builtin or custom validator.

- `valid` <[boolean]> Whether that element is valid or not.
- `...extra` <[Object]> Key-value pairs difined in json of `data-valli`.

```html
<input type="text" data-valli='{"equal":{"partner":"#el","foo":7,"bar":"wow"},"hello":"valli"}'>
```

The following is a example of result of validation above.

```js
{
  [...],
  custom: {
    equal: {
      valid: true,
      foo: 7,
      bar: "wow"
    }
  },
  hello: "valli"
}
```

# Builtin Validator

## equal
Validate whether values of two elements are same or not.

```html
Input: <input type="text" id="input" data-valli='{"equal":{"partner":"#confirmation"}}'>
Confirmation: <input type="text" id="confirmation" data-valli='{"equal":{"partner":"#input"}}'>
```

- `partner` <[string]> An ID of a partner element.

## different
Validate whether values of two elements are different or not.

```html
Current: <input type="text" id="current" data-valli='{"different":{"partner":"#new"}}'>
New: <input type="text" id="new" data-valli='{"different":{"partner":"#current"}}'>
```

- `partner` <[string]> An ID of a partner element.

## within
Validate whether values of two elements expressed as date are consistent or not. Must be defined a pattern attribute at a time.

```html
From: <input type="text" id="from" pattern="^\d{4}-\d{2}-\d{2}$" data-valli='{"within":{"partner":"#to","start":true,"equal":true}}'>
To: <input type="text" id="to" pattern="^\d{4}-\d{2}-\d{2}$" data-valli='{"within":{"partner":"#from","start":false,"equal":true}}'>
```

- `partner` <[string]> An ID of a partner element.
- `start` <[boolean]> Whether it's start date or not. Defaults to `false`.
- `equal` <[boolean]> Whether it allows to be equal start date and end date. Defaults to `false`.

# Custom Validator
You can write your original validators.
The following is a simple example of a custom validator.
This Match validator validates if the value is the same as a given value.

```html
<input type="text" data-valli='{"match":{"text":"Hello Valli"}}'>
```

If you use TypeScript, you can use some handy types and methods.
Note that validate() must return <[ValidityResult]>.

```typescript
import { Valli, FormControl, getValue } from 'valli';

class Match extends Valli.Rule {
  private text: string;

  constructor(el: FormControl, options: any) {
    super(el, options);
    this.text = options.text;
  }

  validate() {
    this.result.valid = getValue(this.el) === this.text;
    return this.result;
  }
}
```

It's much the same in ES2015.

```js
import { Valli } from 'valli';

class Match extends Valli.Rule {
  constructor(el, options) {
    super(el, options);
    this.text = options.text;
  }

  validate() {
    this.result.valid = this.el.value === this.text;
    return this.result;
  }
}
```

You need to add your original rules before initializing Valli.

```js
Valli.addRule('match', Match);
const valli = new Valli({ form, controls });
```

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function "Function"
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
[HTMLElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement "HTMLElement"
[CustomEvent]: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent "CustomEvent"
[Valli]: #class-valli "Valli"
[Item]: #class-item "Item"
[ValidityInfo]: #type-validityinfo "ValidityInfo"
[ValidityResult]: #type-validityresult "ValidityResult"
