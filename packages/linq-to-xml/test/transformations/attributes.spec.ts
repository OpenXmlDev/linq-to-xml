/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { linqIterable, XElement } from '../../src';
import { attributes } from '../../src/transformations';

import { createWordDocumentPackage, W } from '../TestHelpers';

const wordPackage: XElement = createWordDocumentPackage();
const getIterableOfXElement = () => wordPackage.descendants(W.p);

describe('attributes(name?: XName): LinqAttributes', () => {
  it('returns all attributes, if no name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = attributes()(sequence);
    expect(linqIterable(transformedSequence).count()).toBe(8);
  });

  it('returns the named attributes, if a name is passed', () => {
    const sequence = getIterableOfXElement();

    const transformedSequence = attributes(W.rsidR)(sequence);

    expect(linqIterable(transformedSequence).count()).toBe(3);
    expect(
      linqIterable(transformedSequence).all((a) => a.name === W.rsidR)
    ).toBe(true);
  });

  it('returns an empty sequence, if the name is null', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = attributes(null)(sequence);
    expect(linqIterable(transformedSequence).any()).toBe(false);
  });
});
