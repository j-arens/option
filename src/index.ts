import { Some, None } from './Option';
export { Option } from './Option';

export function some<T>(value: T): Some<T> {
  return new Some<T>(value);
}

export function none<T>(): None<T> {
  return new None<T>();
}
