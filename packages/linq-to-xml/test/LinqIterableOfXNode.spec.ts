/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { PredicateWithIndex } from '@tsdotnet/common-interfaces';
import { where } from '@tsdotnet/linq/dist/filters';

import {
  LinqIterableOfXNode,
  linqNodes,
  XElement,
  XNode,
  XText,
} from '../src/internal';

import { ancestors } from '../src/transformations';

import { createWordDocumentPackage, W } from './TestHelpers';

const testPackage: XElement = createWordDocumentPackage();
const getLinqIterableOfXNode = () => testPackage.descendants(W.t).nodes();

describe('ancestors(name?: XName): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = ancestors()(getLinqIterableOfXNode());
    const sequence = getLinqIterableOfXNode().ancestors();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('remove(): void', () => {
  it('removes all nodes', () => {
    const wordPackage = createWordDocumentPackage();
    const nodes = () => wordPackage.descendants(W.t).nodes();
    expect(nodes().any()).toBe(true);

    nodes().remove();

    expect(nodes().any()).toBe(false);
  });
});

describe('where(predicate: PredicateWithIndex<XNode>): LinqIterableOfXNode', () => {
  const predicate: PredicateWithIndex<XNode> = (n: XNode) => n instanceof XText;

  it('returns the result of the wrapped function', () => {
    const expectedSequence = where<XNode>(predicate)(getLinqIterableOfXNode());
    const sequence = getLinqIterableOfXNode().where(predicate);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('function linqNodes(source: Iterable<XNode>): LinqIterableOfXNode', () => {
  it('returns a new LinqIterableOfXNode if the source is not an instance of LinqIterableOfXNode', () => {
    const source = [new XElement(W.p), new XElement(W.r), new XElement(W.t)];

    const iterable = linqNodes(source);

    expect(iterable).toBeInstanceOf(LinqIterableOfXNode);
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqIterableOfXNode', () => {
    const source = new LinqIterableOfXNode([
      new XElement(W.p),
      new XElement(W.r),
      new XElement(W.t),
    ]);
    const iterable = linqNodes(source);
    expect(iterable).toBe(source);
  });
});
