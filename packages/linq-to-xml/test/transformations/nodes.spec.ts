/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { nodes } from '../../src/transformations';
import { XElement } from '../../src/internal';

import { createWordDocumentPackage, getSignature, W } from '../TestHelpers';

const wordPackage: XElement = createWordDocumentPackage();
const getIterableOfXElement = () =>
  wordPackage.descendants(W.r).descendantsAndSelf();

describe('nodes<T extends XContainer>(): IterableValueTransform<T, XNode>', () => {
  it('returns all nodes', () => {
    // The sequence is [w:r, w:t, w:r, w:t].
    const sequence = getIterableOfXElement();
    const transformedSequence = nodes(sequence);
    expect(getSignature(transformedSequence)).toEqual([
      W.t,
      'Heading',
      W.t,
      'Body Text.',
    ]);
  });
});
