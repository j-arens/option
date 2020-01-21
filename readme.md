# Option

This is a partial port of the [Option](https://doc.rust-lang.org/std/option/) type from [Rust](https://www.rust-lang.org/). Most of the functionality is here but I skipped porting some of the more Rust-specific methods that don't really make sense in a Javascript context.

## Usage

Basic usage is the same as in Rust.

```ts
import { Option, some, none } from '@j-arens/option';

// basic setting and getting of values
const greeting = some('hey there');
const name = none();

console.log(greeting.unwrap()); // logs 'hey there'
console.log(name.unwrap()); // throws an OptionError
console.log(name.unwrapOr('unknown')); // logs 'unknown'

// function that returns an Option<number>
function divide(x: number, y: number): Option<number> {
  if (y === 0) {
    return none();
  }
  return some(x / y);
}

divide(1, 0); // None
divide(1, 1); // Some(1)
```

## Testing

```
$ npm run test
```

## Linting

```
$ npm run lint
```

## Building

```
$ npm run build
```
