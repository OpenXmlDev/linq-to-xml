/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute, XElement } from '../src';
import { createWordDocumentPackage, PKG, W, W14 } from './TestHelpers';

describe('get nextNode(): XNode | null', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  it('returns the next node if it exists', () => {
    const body = wordPackage.descendants(W.body).single();
    const firstNode = body.firstNode!;

    const nextNode = firstNode.nextNode;

    expect(nextNode).not.toBeNull();
  });

  it('returns null if the current node is the last node', () => {
    const body = wordPackage.descendants(W.body).single();
    const lastNode = body.lastNode!;

    const nextNode = lastNode.nextNode;

    expect(nextNode).toBeNull();
  });

  it('returns null if the node does not have a parent', () => {
    const node = new XElement(W.p);
    const nextNode = node.nextNode;
    expect(nextNode).toBeNull();
  });
});

describe('get previousNode(): XNode | null', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  it('returns the previous node if it exists', () => {
    const body = wordPackage.descendants(W.body).single();
    const lastNode = body.lastNode!;

    const previousNode = lastNode.previousNode;

    expect(previousNode).not.toBeNull();
  });

  it('returns null if the current node is the first node', () => {
    const body = wordPackage.descendants(W.body).single();
    const firstNode = body.firstNode!;

    const previousNode = firstNode.previousNode;

    expect(previousNode).toBeNull();
  });

  it('returns null if the node does not have a parent', () => {
    const node = new XElement(W.p);
    const previousNode = node.previousNode;
    expect(previousNode).toBeNull();
  });
});

describe('ancestors(name?: XName | null): IterableOfXElement; where name === undefined', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  it('returns an empty sequence for the root element', () => {
    const ancestors = wordPackage.ancestors();
    expect(ancestors.count()).toBe(0);
  });

  it('return the parent element for a child of the root element', () => {
    const element = wordPackage.elements().first();

    const ancestors = element.ancestors();

    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.package]);
  });

  it('returns the ancestors in reverse document order', () => {
    const document = wordPackage
      .elements(PKG.part)
      .elements(PKG.xmlData)
      .elements(W.document)
      .single();

    const ancestors = document.ancestors();

    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.xmlData, PKG.part, PKG.package]);
  });
});

describe('ancestors(name?: XName | null): IterableOfXElement; where name !== undefined', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const document = wordPackage
    .elements(PKG.part)
    .elements(PKG.xmlData)
    .elements(W.document)
    .single();

  const body = document.elements(W.body).single();

  it('returns the named element(s)', () => {
    const ancestors = document.ancestors(PKG.part);
    const ancestor = ancestors.single();
    expect(ancestor.name).toBe(PKG.part);
  });

  it('returns an empty sequence when the name is null', () => {
    const ancestors = body.ancestors(null);
    expect(ancestors.count()).toBe(0);
  });

  it('returns an empty sequence when the element does not have the named ancestor', () => {
    // w:body does not have a w:p ancestor.
    const ancestors = body.ancestors(W.p);
    expect(ancestors.count()).toBe(0);
  });
});

describe('remove(): void', () => {
  it('removes the node from its parent', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const part = wordPackage.elements().single();

    part.remove();

    expect(part.parent).toBeNull();
    expect(wordPackage.elements().count()).toBe(0);
  });

  it('throws if the node does not have a parent', () => {
    const node = new XElement(W.p);
    expect(() => node.remove()).toThrow();
  });
});

describe('replaceWith(...content: any[]): void', () => {
  it('replaces a single child node with another node', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const body = wordPackage.descendants(W.body).single();
    const newBody = new XElement(W.body, new XElement(W.p));

    body.replaceWith(newBody);

    expect(wordPackage.descendants(W.body).single()).toBe(newBody);
  });

  it('replaces a child node with siblings with other nodes', () => {
    const paragraph = new XElement(W.p, new XAttribute(W14.paraId, '00000001'));

    const body = new XElement(
      W.body,
      new XElement(W.tbl),
      paragraph,
      new XElement(W.tbl)
    );

    expect(body.elements(W.p).count()).toBe(1);

    paragraph.replaceWith(
      new XElement(W.p, new XAttribute(W14.paraId, '00000002')),
      new XElement(W.p, new XAttribute(W14.paraId, '00000003'))
    );

    expect(
      body
        .elements()
        .select((e) => e.name)
        .toArray()
    ).toEqual([W.tbl, W.p, W.p, W.tbl]);

    expect(
      body
        .elements(W.p)
        .select((e) => e.attribute(W14.paraId)?.value)
        .toArray()
    ).toEqual(['00000002', '00000003']);
  });

  it('throws if the node does not have a parent', () => {
    const node = new XElement(W.p);
    expect(() => node.replaceWith(new XElement(W.p))).toThrow();
  });

  it('throws if external code has corrupted the operation', () => {
    const previousNode = new XElement(
      W.p,
      new XAttribute(W14.paraId, '00000001')
    );
    const node = new XElement(W.p, new XAttribute(W14.paraId, '00000002'));
    const parent = new XElement(W.body, previousNode, node);
    expect(node._parent).toBe(parent);

    // Scenario: External code corrupts the operation.
    previousNode._parent = null;

    expect(() => node.replaceWith(new XElement(W.sdt))).toThrow();
  });
});
