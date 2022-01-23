/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { Inserter, XAttribute, XElement, XText } from '../src/internal';
import { W } from './TestHelpers';

describe('add(content: any): void', () => {
  it('does nothing if content === null', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);

    inserter.add(null);

    expect(parent._content).toBeNull();
  });

  it('adds XNode content having no parent', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);
    const text = new XText('Text');

    inserter.add(text);

    expect(parent._content).toBe(text);
  });

  it('adds XNode content associated with parent, cloning such XNode content', () => {
    const text = new XText('Text');
    const existingParent = new XElement(W.t, text);
    expect(text.parent).toBe(existingParent);

    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);

    inserter.add(text);

    expect(parent._content).not.toBe(text);
    expect(parent._content).toBeInstanceOf(XText);
    expect(parent.value).toEqual(text.value);
  });

  it('adds string content to empty element', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);

    inserter.add('a');
    expect(parent._content).toEqual('a');
  });

  it('prepends string content to non-empty element', () => {
    const parent = new XElement(W.t, 'b');
    const inserter = new Inserter(parent, null);

    inserter.add('a');
    expect(parent.value).toEqual('ab');
    expect(parent.nodes().count()).toBe(2);
  });

  it('adds iterable string content', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);

    inserter.add(['a', 'b', 'c']);

    expect(parent._content).toEqual('abc');
  });

  it('adds iterable content: XText, string, string', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);
    const text = new XText('f');

    inserter.add([text, 'o', 'o']);

    expect(parent._content).toBeInstanceOf(XText);
    expect((parent._content as XText).value).toEqual('foo');
  });

  it('adds iterable mixed content: string, XText, string', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);
    const text = new XText('a');

    inserter.add(['b', text, 'r']);

    expect(parent.value).toEqual('bar');
  });

  it('adds Stringifyable content', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);

    const dateString = '2022-01-22T12:00:00Z';
    const date = new Date(dateString);
    const object = { toString: () => 'object' };

    inserter.add([1, true, false, date, object]);

    expect(parent._content).toEqual(`1truefalse${dateString}object`);
  });

  it('throws when adding an XAttribute', () => {
    const parent = new XElement(W.t);
    const inserter = new Inserter(parent, null);

    expect(() => inserter.add(new XAttribute(W.val, 'Test'))).toThrow();
  });
});
