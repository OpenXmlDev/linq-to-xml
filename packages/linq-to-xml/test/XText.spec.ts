/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XText } from '../src/index.js';
import { StringBuilder } from '../src/internal.js';

describe('get value(): string', () => {
  it('returns the value', () => {
    const expectedValue = 'Hello World!';
    const text = new XText(expectedValue);

    const value = text.value;

    expect(value).toEqual(expectedValue);
  });
});

describe('set value(text: string)', () => {
  it('sets the value', () => {
    const text = new XText('Hello World!');
    const newValue = 'The sky is blue.';

    text.value = newValue;

    expect(text.value).toEqual(newValue);
  });
});

describe('appendText(sb: StringBuilder): void', () => {
  it('appends the value to the StringBuilder', () => {
    const expectedValue = 'Hello World!';
    const text = new XText(expectedValue);
    const sb = new StringBuilder();

    text.appendText(sb);

    expect(sb.toString()).toEqual(expectedValue);
  });
});

describe('cloneNode(): XNode', () => {
  it('creates a copy with the same value', () => {
    const expectedValue = 'Hello World!';
    const text = new XText(expectedValue);

    const clone = text.cloneNode() as XText;

    expect(clone).not.toBe(text);
    expect(clone.value).toEqual(text.value);
  });
});

describe('toString(): string', () => {
  it('returns the value', () => {
    const expectedValue = 'Hello World!';
    const text = new XText(expectedValue);

    const stringValue = text.toString();

    expect(stringValue).toEqual(text.value);
  });
});
