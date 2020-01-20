/**
 * OptionError
 */
class OptionError extends Error {
  public name = 'OptionError';

  public static illegalUnwrap(): OptionError {
    return new OptionError('tried to unwrap on None');
  }

  public static illegalInstantiation(): OptionError {
    return new OptionError('Option must be an instance of Some or None');
  }
}

/**
 * Base Option (should not be instantiated directly, use Some or None instead).
 * Option represents an optional value: every Option is either Some and contains
 * a value, or None, and does not
 */
export class Option<T> {
  private _value: T;

  public static default<U>(): None<U> {
    return new None();
  }

  public constructor(value: T) {
    if (!this.isSome() && !this.isNone()) {
      throw OptionError.illegalInstantiation();
    }
    this._value = value;
  }

  /**
   * Returns true if the Option is an instance of Some.
   */
  public isSome(): boolean {
    return this instanceof Some;
  }

  /**
   * Returns true if the Option is an instance of None.
   */
  public isNone(): boolean {
    return this instanceof None;
  }

  /**
   * Moves the value v out of the Option<T> if it is Some(v).
   * Throws an OptionError if the Option<T> is None.
   */
  public unwrap(): T {
    if (this.isSome()) {
      return this._value;
    }
    throw OptionError.illegalUnwrap();
  }

  /**
   * Returns the contained value or a default.
   */
  public unwrapOr(fallback: T): T {
    if (this.isSome()) {
      return this.unwrap();
    }
    return fallback;
  }

  /**
   * Returns the contained value or computes it from the given function.
   */
  public unwrapOrElse(op: () => T): T {
    if (this.isSome()) {
      return this.unwrap();
    }
    return op();
  }

  /**
   * Maps an Option<T> to Option<U> by applying a function to a contained value.
   */
  public map<U>(op: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return new Some<U>(op(this.unwrap()));
    }
    return new None();
  }

  /**
   * Applies a function to the contained value (if any), or returns the provided default (if not).
   */
  public mapOr<U>(fallback: U, op: (value: T) => U): U {
    if (this.isSome()) {
      return op(this.unwrap());
    }
    return fallback;
  }

  /**
   * Applies a function to the contained value (if any), or computes a default (if not).
   */
  public mapOrElse<U>(fallback: () => U, op: (value: T) => U): U {
    if (this.isSome()) {
      return op(this.unwrap());
    }
    return fallback();
  }

  /**
   * Returns None if the opt is None, otherwise returns optb.
   */
  public and<U>(optb: Option<U>): Option<U> {
    if (this.isSome()) {
      return optb;
    }
    return new None<U>();
  }

  /**
   * Returns None if the opt is None, otherwise calls op with the wrapped value and returns the result.
   */
  public andThen<U>(op: (value: T) => Option<U>): Option<U> {
    if (this.isSome()) {
      return op(this.unwrap());
    }
    return new None<U>();
  }

  /**
   * Returns None if the opt is None, otherwise calls predicate with the wrapped value and returns:
   * - Some(t) if predicate returns true (where t is the wrapped value), and
   * - None if predicate returns false.
   */
  public filter(op: (value: T) => boolean): Option<T> {
    return this.andThen((val: T): Option<T> => op(val) ? this : new None<T>());
  }

  /**
   * Returns the opt if it contains a value, otherwise returns optb.
   */
  public or(optb: Option<T>): Option<T> {
    if (this.isSome()) {
      return this;
    }
    return optb;
  }

  /**
   * Returns the opt if it contains a value, otherwise calls op and returns the result.
   */
  public orElse(op: () => Option<T>): Option<T> {
    if (this.isSome()) {
      return this;
    }
    return op();
  }

  /**
   * Returns Some if exactly one of self, optb is Some, otherwise returns None.
   */
  public xor(optb: Option<T>): Option<T> {
    if (this.isSome()) {
      if (optb.isSome()) {
        return new None<T>();
      }
      return this;
    }
    if (optb.isSome()) {
      return optb;
    }
    return new None<T>();
  }

  /**
   * Converts from Option<Option<T>> to Option<T>. Flattening once only removes one level of nesting.
   */
  public flatten(): Option<T> {
    return this.mapOrElse(
      () => new None<T>(),
      (val: T): Option<T> => val instanceof Some ? val : this,
    );
  }
}

/**
 * The Some variant of Option, contains some value of type T.
 */
export class Some<T> extends Option<T> {}

/**
 * The None variant of Option, represents the absence of any value.
 */
export class None<T> extends Option<T> {
  public constructor() {
    super(undefined as never);
  }
}
