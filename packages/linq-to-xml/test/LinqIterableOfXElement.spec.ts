/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XElement } from '../src/internal';
import { createWordDocumentPackage, W } from './TestHelpers';

describe('ancestors(name?: XName): ILinqIterableOfXElement', () => {
  // TODO: Add unit tests.
});

describe('ancestorsAndSelf(name?: XName): ILinqIterableOfXElement', () => {
  // TODO: Add unit tests.
});

describe('attributes(name?: XName): ILinqIterableOfXAttribute', () => {
  test('attributes() returns all attributes', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const attributes = wordPackage.descendants(W.p).attributes();

    expect(attributes.count()).toBe(8);
  });

  test('attributes(name) returns just the named attributes', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const attributes = wordPackage.descendants(W.p).attributes(W.rsidR);

    expect(attributes.count()).toBe(3);
    expect(attributes.all((a) => a.name === W.rsidR)).toBe(true);
  });
});

describe('descendantNodes(): ILinqIterableOfXNode', () => {
  // TODO: Add unit tests.
});

describe('descendantNodesAndSelf(): ILinqIterableOfXNode', () => {
  // TODO: Add unit tests.
});

describe('descendants(name?: XName | null): ILinqIterableOfXElement', () => {
  // TODO: Add unit tests.
});

describe('descendantsAndSelf(name?: XName): ILinqIterableOfXElement', () => {
  // TODO: Add unit tests.
});

describe('elements(name?: XName | null): ILinqIterableOfXElement', () => {
  test('elements() returns all elements', () => {
    const wordPackage: XElement = createWordDocumentPackage();

    const texts = wordPackage.descendants(W.p).elements(W.r).elements(W.t);

    // The first time we resolve, we get the correct count.
    expect(texts.count()).toEqual(2);
  });

  // TODO: Add further unit tests.
});

describe('nodes(): ILinqIterableOfXNode', () => {
  // TODO: Add unit tests.
});

describe('remove(): void', () => {
  // TODO: Add unit tests.
});

describe('where(predicate: PredicateWithIndex<XElement>): ILinqIterableOfXElement', () => {
  // TODO: Add unit tests.
});
