/**
 * @author Thomas Barnekow
 * @license MIT
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  XAttribute,
  XContainer,
  XElement,
  XNamespace,
  XNode,
  XObject,
} from '../src/internal';

import {
  createWordDocumentPackage,
  PKG,
  PKG_NAME,
  PKG_CONTENT_TYPE,
  W,
  WML_NAMESPACE_DECLARATIONS,
} from './TestHelpers';

describe('get nextNode(): XNode | null', () => {
  // TODO: Add unit tests.
});

describe('get previousNode(): XNode | null', () => {
  // TODO: Add unit tests.
});

describe('ancestors(name?: XName | null): IterableOfXElement; where name === undefined', () => {
  const package_: XElement = createWordDocumentPackage();

  it('should return an empty sequence for the root element', () => {
    const ancestors = package_.ancestors();
    expect(ancestors.count()).toBe(0);
  });

  it('should return the parent element for a child of the root element', () => {
    const element = package_.elements().first();

    const ancestors = element.ancestors();

    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.package]);
  });

  it('should return the ancestors in reverse document order', () => {
    const document = package_
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
  const package_: XElement = createWordDocumentPackage();
  const document = package_
    .elements(PKG.part)
    .elements(PKG.xmlData)
    .elements(W.document)
    .single();

  it('should return the named element(s)', () => {
    const ancestors = document.ancestors(PKG.part);
    const ancestor = ancestors.single();
    expect(ancestor.name).toBe(PKG.part);
  });
});

describe('remove(): void', () => {
  // TODO: Add unit tests.
});

describe('replaceWith(...content: any[]): void', () => {
  // TODO: Add unit tests.
});
