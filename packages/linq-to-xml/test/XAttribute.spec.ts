/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute, XElement, XName } from '../src';
import { W, W14 } from './TestHelpers';

describe('get name(): XName', () => {
  it('gets the attribute name', () => {
    const attr = new XAttribute(W.val, '100');
    expect(attr.name).toBe(W.val);
  });
});

describe('get nextAttribute(): XAttribute | null', () => {
  const paraId = new XAttribute(W14.paraId, '12345678');
  const textId = new XAttribute(W14.textId, '12345678');
  const element = new XElement(W.p, paraId, textId);

  expect(element.firstAttribute).toBe(paraId);
  expect(element.lastAttribute).toBe(textId);

  it('returns the next attribute if it exists', () => {
    const firstAttr = element.firstAttribute!;
    const nextAttr = firstAttr.nextAttribute;
    expect(nextAttr).toBe(textId);
  });

  it('returns null if there is no next attribute', () => {
    const lastAttr = element.lastAttribute!;
    const nextAttr = lastAttr.nextAttribute;
    expect(nextAttr).toBeNull();
  });
});

describe('get value(): string', () => {
  it('gets the attribute value', () => {
    const attr = new XAttribute(W.val, '100');
    expect(attr.value).toEqual('100');
  });
});

describe('set value(value: string)', () => {
  it('sets the attribute value', () => {
    const attr = new XAttribute(W.val, '100');
    attr.value = '200';
    expect(attr.value).toEqual('200');
  });
});

describe('remove(): void', () => {
  it('removes the attribute from its parent', () => {
    const attr = new XAttribute(W.val, 'Heading1');
    const element = new XElement(W.pStyle, attr);

    expect(attr.parent).toBe(element);

    attr.remove();

    expect(attr.parent).toBeNull();
  });

  it('throws if the attribute has no parent', () => {
    const attr = new XAttribute(W.val, 'Heading1');
    expect(() => attr.remove()).toThrow('The parent is missing.');
  });
});

describe('toString(): string', () => {
  it('returns the string representation', () => {
    expect(new XAttribute(W.val, 'Heading1').toString()).toEqual(
      'w:val="Heading1"'
    );

    expect(new XAttribute(XName.get('id'), '1').toString()).toEqual('id="1"');
  });
});
