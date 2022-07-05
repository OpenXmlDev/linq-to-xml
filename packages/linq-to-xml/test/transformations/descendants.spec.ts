/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { linqIterable, XElement } from '../../src';
import { descendants, descendantsAndSelf } from '../../src/transformations';

import { createWordDocumentPackage, getSignature, W } from '../TestHelpers.js';

const wordPackage: XElement = createWordDocumentPackage();
const getIterableOfXElement = () => {
  // For code coverage reasons, ensure that all string content is converted
  // to XText instances. Otherwise, certain branches are not hit.
  wordPackage.descendants(W.t).nodes().toArray();

  // Return the actual IterableOfXElement.
  return wordPackage.descendants(W.p);
};

describe('descendants<T extends XContainer>(name?: XName | null): IterableValueTransform<T, XElement>', () => {
  it('returns all descendants, if no name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendants()(sequence);
    expect(getSignature(transformedSequence)).toEqual([
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
    ]);
  });

  it('returns all descendants having the given name, if a name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendants(W.pStyle)(sequence);
    expect(getSignature(transformedSequence)).toEqual([W.pStyle, W.pStyle]);
  });

  it('returns an empty sequence, if name === null', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendants(null)(sequence);
    expect(linqIterable(transformedSequence).count()).toBe(0);
  });
});

describe('descendantsAndSelf(name?: XName | null): IterableValueTransform<XElement, XElement>', () => {
  it('returns all containers and descendants, if no name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendantsAndSelf()(sequence);
    expect(getSignature(transformedSequence)).toEqual([
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      W.p,
    ]);
  });

  it('returns all containers and descendants having the given name, if a name is passed', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendantsAndSelf(W.pStyle)(sequence);
    expect(getSignature(transformedSequence)).toEqual([W.pStyle, W.pStyle]);
  });

  it('returns an empty sequence, if name === null', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendantsAndSelf(null)(sequence);
    expect(linqIterable(transformedSequence).count()).toBe(0);
  });
});
