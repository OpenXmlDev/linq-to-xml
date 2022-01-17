/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute, XElement } from '../src/internal';
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
    expect(body.elements().attributes().count()).toBe(4);

    body.elements().attributes().remove();

    expect(body.elements().attributes().count()).toBe(0);
  });
});

describe('where(predicate: PredicateWithIndex<XAttribute>): ILinqIterableOfXAttribute', () => {
  it('should return the attributes specified by the predicate', () => {
    const body = createBody();

    const attributes = body
      .elements()
      .attributes()
      .where((a) => a.name === W.rsidR);

    expect(attributes.count()).toBe(2);
  });
});
