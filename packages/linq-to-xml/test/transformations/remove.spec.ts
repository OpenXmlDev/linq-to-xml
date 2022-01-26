/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { remove } from '../../src/transformations';
import { XAttribute, XElement } from '../../src/internal';

import { W, W14 } from '../TestHelpers';

describe('remove<T extends XAttribute | XNode>(): IterableTransform<T, void>', () => {
  it('removes all attributes', () => {
    const element = new XElement(
      W.p,
      new XAttribute(W14.paraId, '12345678'),
      new XAttribute(W14.textId, '12345678')
    );
    const sequence = element.attributes();

    remove(sequence);

    expect(element.attributes().any()).toBe(false);
  });

  it('removes all nodes', () => {
    const element = new XElement(W.p, new XElement(W.r), new XElement(W.r));
    const sequence = element.nodes();

    remove(sequence);

    expect(element.nodes().any()).toBe(false);
  });
});
