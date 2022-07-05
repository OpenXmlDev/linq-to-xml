/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XElement } from '../../src';

import {
  descendantNodes,
  descendantNodesAndSelf,
} from '../../src/transformations';

import { createWordDocumentPackage, getSignature, W } from '../TestHelpers.js';

const wordPackage: XElement = createWordDocumentPackage();
const getIterableOfXElement = () => wordPackage.descendants(W.p);

describe('descendantNodes<T extends XContainer>(): IterableValueTransform<T, XNode>', () => {
  it('returns all descendant nodes', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendantNodes(sequence);
    expect(getSignature(transformedSequence)).toEqual([
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Heading',
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Body Text.',
    ]);
  });
});

describe('descendantNodesAndSelf<T extends XContainer>(): IterableValueTransform<T, XNode>', () => {
  it('returns the XContainer and all descendant nodes', () => {
    const sequence = getIterableOfXElement();
    const transformedSequence = descendantNodesAndSelf(sequence);
    expect(getSignature(transformedSequence)).toEqual([
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Heading',
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Body Text.',
      W.p,
    ]);
  });
});
