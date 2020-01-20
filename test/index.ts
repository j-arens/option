import 'mocha';
import assert = require('assert');
import { Option, Some, None } from '../src/Option';

describe('creating an instance of Option', () => {
  it('throws if instantiated directly', () => {
    const fn = () => {
      new Option('');
    };
    assert.throws(fn, {
      name: 'OptionError',
      message: 'Option must be an instance of Some or None',
    });
  });
});

describe('default', () => {
  it('creates a new instance of None', () => {
    assert(Option.default() instanceof None);
  });
});

describe('isSome', () => {
  it('should return true for instances of Some', () => {
    assert(new Some('').isSome());
  });

  it('should return false for instances of None', () => {
    assert(!new None().isSome());
  });
});

describe('isNone', () => {
  it('should return true for instances of None', () => {
    assert(new None().isNone());
  });

  it('should return false for instances of Some', () => {
    assert(!new Some('').isNone());
  });
});

describe('unwrap', () => {
  it('returns the value contained within a Some', () => {
    assert.strictEqual(new Some('foo').unwrap(), 'foo');
  });

  it('throws if called on an instance of None', () => {
    const fn = () => {
      new None().unwrap();
    };
    assert.throws(fn, {
      name: 'OptionError',
      message: 'tried to unwrap on None',
    });
  });
});

describe('unwrapOr', () => {
  it('returns the unwrapped value within a Some', () => {
    assert.strictEqual(new Some('foo').unwrapOr('bar'), 'foo');
  });

  it('returns the fallback value if called on an instance of None', () => {
    assert.strictEqual(new None().unwrapOr('foo'), 'foo');
  });
});

describe('unwrapOrElse', () => {
  it('returns the unwrapped value within a Some', () => {
    assert.strictEqual(new Some('foo').unwrapOrElse(() => 'bar'), 'foo');
  });

  it('calls and returns the fallback function if called on an instance of None', () => {
    assert.strictEqual(new None().unwrapOrElse(() => 'foo'), 'foo');
  });
});

describe('map', () => {
  it('returns a new instance of Some if called on an instance of Some', () => {
    const opta = new Some('foo');
    const optb = opta.map(x => x);
    assert(optb.isSome());
    assert.notStrictEqual(opta, optb);
  });

  it('returns an instance of Some containing the product of the given function', () => {
    const opt = new Some('foo').map(x => `${x}bar`);
    assert.strictEqual(opt.unwrap(), 'foobar');
  });

  it('returns a new instance of None if called on an instance of None', () => {
    const opta = new None();
    const optb = opta.map(x => x);
    assert(optb.isNone());
    assert.notStrictEqual(opta, optb);
  });
});

describe('mapOr', () => {
  it('returns the product of the given function if called on an instance of Some', () => {
    assert.strictEqual(new Some('foo').mapOr('baz', x => `${x}bar`), 'foobar');
  });

  it('returns the given fallback value if called on an instance of None', () => {
    assert.strictEqual(new None().mapOr('baz', x => `${x}bar`), 'baz');
  });
});

describe('mapOrElse', () => {
  it('returns the product of the given function if called on an instance of Some', () => {
    assert.strictEqual(new Some('foo').mapOrElse(() => 'baz', x => `${x}bar`), 'foobar');
  });

  it('returns the product of the given fallback function if called on an instance of None', () => {
    assert.strictEqual(new None().mapOrElse(() => 'baz', x => `${x}bar`), 'baz');
  });
});

describe('and', () => {
  it('returns the given opt if called on an instance of Some', () => {
    const opta = new Some('foo');
    const optb = new Some('bar');
    assert.strictEqual(opta.and(optb), optb);
  });

  it('returns a new instance of None if called on an instance of None', () => {
    const opta = new None();
    const optb = new Some('foo');
    const optc = opta.and(optb);
    assert(optc.isNone());
    assert.notStrictEqual(opta, optc);
  });
});

describe('andThen', () => {
  it('returns the opt returned from the given function if called on an instance of Some', () => {
    const opta = new Some('foo');
    const appendBar = (word: string): Option<string> => new Some(`${word}bar`);
    const optb = opta.andThen(appendBar);
    assert(optb.isSome());
    assert.strictEqual(optb.unwrap(), 'foobar');
  });

  it('returns a new instance of None if called on an instance of None', () => {
    const opta = new None();
    const optb = opta.andThen(x => new Some(x));
    assert(optb.isNone());
    assert.notStrictEqual(opta, optb);
  });
});

describe('filter', () => {
  it('returns the instance if its type is Some and the given function returns true', () => {
    const opta = new Some('foo');
    const optb = opta.filter(x => x === 'foo');
    assert.strictEqual(opta, optb);
  });

  it('returns a new instance of None if called on an instance of Some and the given function returns false', () => {
    const opta = new Some('foo');
    const optb = opta.filter(x => x === 'bar');
    assert(optb.isNone());
  });

  it('returns a new instance of None if called on an instance of None', () => {
    const opta = new None();
    const optb = opta.filter(x => x === 'foo');
    assert(optb.isNone());
    assert.notStrictEqual(opta, optb);
  });
});

describe('or', () => {
  it('returns the instance if its type is Some', () => {
    const opta = new Some('foo');
    const optb = new Some('bar');
    const optc = opta.or(optb);
    assert.strictEqual(opta, optc);
  });

  it('returns the given opt if called on an instance of None', () => {
    const opta = new None();
    const optb = new Some('foo');
    const optc = opta.or(optb);
    assert.strictEqual(optb, optc);
  });
});

describe('orElse', () => {
  it('returns the instance if its type is Some', () => {
    const opta = new Some('foo');
    const optb = opta.orElse(() => new Some('bar'));
    assert.strictEqual(opta, optb);
  });

  it('returns the opt returned by the given function if called on an instance of None', () => {
    const opta = new None();
    const optb = new Some('foo');
    const optc = opta.orElse(() => optb);
    assert.strictEqual(optb, optc);
  });
});

describe('xor', () => {
  it('returns None if the instance is Some and the given opt is Some', () => {
    const opta = new Some('foo');
    const optb = new Some('bar');
    assert(opta.xor(optb).isNone());
  });

  it('returns the instance if its type is Some and the give opt is None', () => {
    const opta = new Some('foo');
    const optb = new None<string>();
    const optc = opta.xor(optb);
    assert.strictEqual(opta, optc);
  });

  it('returns the given opt if its type is Some and the current instance is None', () => {
    const opta = new None<string>();
    const optb = new Some('foo');
    const optc = opta.xor(optb);
    assert.strictEqual(optb, optc);
  });

  it('returns a new instance of None if the current instance is None and the given opt is None', () => {
    const opta = new None();
    const optb = new None();
    const optc = opta.xor(optb);
    assert(optc.isNone());
    assert.notStrictEqual(opta, optc);
    assert.notStrictEqual(optb, optc);
  });
});

describe('flatten', () => {
  it('unwraps Somes containing a Some and returns the unwrapped Some', () => {
    const opta = new Some(new Some('foo'));
    const optb = opta.flatten();
    assert.strictEqual(optb.unwrap(), 'foo');
  });

  it('returns the instance if the wrapped value is not an instance of Some', () => {
    const opta = new Some('foo');
    const optb = opta.flatten();
    assert.strictEqual(opta, optb);
  });

  it('returns a new instance of None if the current instance is None', () => {
    const opta = new None();
    const optb = opta.flatten();
    assert(optb.isNone());
    assert.notStrictEqual(opta, optb);
  });
});
