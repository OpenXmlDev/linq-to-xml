/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XElement, XText } from '../src/internal';
import { createWordDocumentPackage, PKG, W } from './TestHelpers';

describe('ancestors(name?: XName): ILinqIterableOfXElement', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  it('should return all ancestors if no name is given', () => {
    // We have two w:t elements with text nodes. Therefore, we expect to get
    // two lines of ancestors, one for each text node.
    const nodes = wordPackage.descendants(W.t).nodes();
    const ancestors = nodes.ancestors();
    expect(ancestors.select((e) => e.name).toArray()).toEqual([
      // Ancestors of first text node
      W.t,
      W.r,
      W.p,
      W.body,
      W.document,
      PKG.xmlData,
      PKG.part,
      PKG.package,

      // Ancestors of second text node
      W.t,
      W.r,
      W.p,
      W.body,
      W.document,
      PKG.xmlData,
      PKG.part,
      PKG.package,
    ]);
  });

  it('should return the named ancestors if a name is given.', () => {
    // We have two w:t elements with text nodes. Therefore, we expect two w:p
    // ancestor elements.
    const nodes = wordPackage.descendants(W.t).nodes();
    const ancestors = nodes.ancestors(W.p);
    expect(ancestors.select((e) => e.name).toArray()).toEqual([W.p, W.p]);
  });
});

describe('remove(): void', () => {
  it('should remove all nodes.', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    expect(wordPackage.descendants(W.t).nodes().any()).toBe(true);
    expect(
      wordPackage
        .descendants(W.t)
        .nodes()
        .all((n) => n instanceof XText)
    ).toBe(true);

    wordPackage.descendants(W.t).nodes().remove();

    expect(wordPackage.descendants(W.t).nodes().any()).toBe(false);
  });
});

describe('where(predicate: PredicateWithIndex<XNode>): ILinqIterableOfXNode', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  it('should filter nodes as specified', () => {
    const nodes = wordPackage.descendants(W.t).nodes();
    const filteredNodes = nodes.where((n) => n.toString().startsWith('Head'));
    expect(filteredNodes.count()).toBe(1);
  });
});
