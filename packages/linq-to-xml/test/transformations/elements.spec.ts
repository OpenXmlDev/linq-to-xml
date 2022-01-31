/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { linqIterable, XElement } from '../../src';
import { elements } from '../../src/transformations';

import { createWordDocumentPackage, W } from '../TestHelpers';

const wordPackage: XElement = createWordDocumentPackage();
const getIterableOfXElement = () => wordPackage.descendants(W.r);

describe('elements<T extends XContainer>(name?: XName | null): IterableValueTransform<T, XElement>', () => {
  it('returns all elements, if no name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = elements()(sequence);
    expect(linqIterable(transformedSequence).count()).toBe(2);
  });

  it('returns the named elements, if a name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = elements(W.t)(sequence);
    expect(linqIterable(transformedSequence).count()).toBe(2);
  });

  it('returns an empty sequence, if the name is null', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = elements(null)(sequence);
    expect(linqIterable(transformedSequence).any()).toBe(false);
  });
});
