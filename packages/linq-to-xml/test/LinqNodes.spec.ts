/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { PredicateWithIndex } from '@tsdotnet/common-interfaces';
import { where } from '@tsdotnet/linq/dist/filters';

import { linqNodes, LinqNodes, XElement, XNode, XText } from '../src';
import { ancestors } from '../src/transformations';

import { createWordDocumentPackage, W } from './TestHelpers';

const testPackage: XElement = createWordDocumentPackage();
const getLinqNodes = () => testPackage.descendants(W.t).nodes();

describe('ancestors(name?: XName): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = ancestors()(getLinqNodes());
    const sequence = getLinqNodes().ancestors();
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

describe('where(predicate: PredicateWithIndex<XNode>): LinqNodes', () => {
  const predicate: PredicateWithIndex<XNode> = (n: XNode) => n instanceof XText;

  it('returns the result of the wrapped function', () => {
    const expectedSequence = where<XNode>(predicate)(getLinqNodes());
    const sequence = getLinqNodes().where(predicate);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('function linqNodes(source: Iterable<XNode>): LinqNodes', () => {
  it('returns a new LinqNodes if the source is not an instance of LinqNodes', () => {
    const source = [new XElement(W.p), new XElement(W.r), new XElement(W.t)];

    const iterable = linqNodes(source);

    expect(iterable).toBeInstanceOf(LinqNodes);
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqNodes', () => {
    const source = new LinqNodes([
      new XElement(W.p),
      new XElement(W.r),
      new XElement(W.t),
    ]);
    const iterable = linqNodes(source);
    expect(iterable).toBe(source);
  });
});
