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

describe('get firstNode(): XNode | null', () => {
  // TODO: Add unit tests.
});

describe('get lastNode(): XNode | null', () => {
  // TODO: Add unit tests.
});

describe('add(content: any): void', () => {
  it('should not add anything if content === undefined', () => {
    const element = new XElement(W.p);
    element.add(undefined);
    expect(element.isEmpty).toBe(true);
  });

  it('should not add anything if content === null', () => {
    const element = new XElement(W.p);
    element.add(null);
    expect(element.isEmpty).toBe(true);
  });

  it('should not add anything if content == ""', () => {
    const element = new XElement(W.p);
    element.add('');
    expect(element.isEmpty).toBe(true);
  });

  it('should not leave the element empty if content === 0', () => {
    const element = new XElement(W.t);
    element.add(0);
    expect(element.isEmpty).toBe(false);
  });

  it('should add string content with a value of "0" if content === 0', () => {
    const element = new XElement(W.t);
    element.add(0);
    expect(typeof element._content).toEqual('string');
    expect(element._content).toEqual('0');
  });
});

describe('descendants(name?: XName | null): IterableOfXElement', () => {
  // TODO: Add unit tests.
});

describe('element(name: XName): XElement | null', () => {
  // TODO: Add unit tests.
});

describe('elements(name?: XName | null): IterableOfXElement', () => {
  // TODO: Add unit tests.
});

describe('nodes(): IterableOfXNode', () => {
  // TODO: Add unit tests.
});

describe('removeNodes(): void', () => {
  // TODO: Add unit tests.
});

describe('replaceNodes(...content: any[]): void', () => {
  // TODO: Add unit tests.
});

describe('nodes(): IterableOfXNode', () => {
  // TODO: Add unit tests.
});
