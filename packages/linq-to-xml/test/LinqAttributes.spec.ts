/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { where } from '@tsdotnet/linq/dist/filters';

import { linqAttributes, LinqAttributes, XAttribute, XElement } from '../src';

import { W } from './TestHelpers';

function createBody() {
  return new XElement(
    W.body,
    new XElement(
      W.p,
      new XAttribute(W.rsidR, '1'),
      new XAttribute(W.rsidRDefault, '2')
    ),
    new XElement(
      W.p,
      new XAttribute(W.rsidR, '3'),
      new XAttribute(W.rsidRDefault, '4')
    )
  );
}

describe('remove(): void', () => {
  it('should remove all attributes', () => {
    const body = createBody();
    const attributes = () => body.elements().attributes();
    expect(attributes().any()).toBe(true);

    attributes().remove();

    expect(attributes().any()).toBe(false);
  });
});

describe('where(predicate: PredicateWithIndex<XAttribute>): LinqAttributes', () => {
  const body = createBody();
  const attributes = () => body.elements().attributes();
  const predicate = (a: XAttribute) => a.name === W.rsidR;

  it('returns the result of the wrapped function', () => {
    const expectedSequence = where(predicate)(attributes());
    const sequence = attributes().where(predicate);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('function linqAttributes(source: Iterable<XAttribute>): LinqAttributes', () => {
  it('returns a new LinqAttributes if the source is not an instance of LinqAttributes', () => {
    const source = [
      new XAttribute(W.val, 'Heading1'),
      new XAttribute(W.val, 'BodyText'),
    ];

    const iterable = linqAttributes(source);

    expect(iterable).toBeInstanceOf(LinqAttributes);
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqAttributes', () => {
    const source = linqAttributes([
      new XAttribute(W.val, 'Heading1'),
      new XAttribute(W.val, 'BodyText'),
    ]);
    const iterable = linqAttributes(source);
    expect(iterable).toBe(source);
  });
});
