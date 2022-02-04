/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XName, XNamespace } from '../src';
import { W } from './TestHelpers';

const localName = W.document.localName;
const namespaceName = W.w.namespaceName;

describe('get namespaceName()', () => {
  it('returns the namespaceName', () => {
    expect(XName.get(localName).namespaceName).toEqual(
      XNamespace.none.namespaceName
    );

    expect(XName.get(`{${namespaceName}}${localName}`).namespaceName).toEqual(
      namespaceName
    );
  });
});

describe('static get(expandedName: string): XName', () => {
  it('returns names with the empty namespace', () => {
    expect(XName.get(localName)).toMatchObject({
      namespace: XNamespace.none,
      localName: localName,
    });
  });

  it('returns names with namespaces', () => {
    expect(XName.get(`{${namespaceName}}${localName}`)).toBe(
      XNamespace.get(namespaceName).getName(localName)
    );
  });

  it('throws if the expandedName is empty', () => {
    expect(() => XName.get('')).toThrow();
  });

  it('throws if the expandedName is malformed', () => {
    expect(() => XName.get(`{${namespaceName}${localName}`)).toThrow();
    expect(() => XName.get(`{}${localName}`)).toThrow();
    expect(() => XName.get(`{${namespaceName}}`)).toThrow();
  });
});

describe('static get(localName: string, namespaceName: string, prefix: string | null): XName', () => {
  it('returns the the XName having the given localName, namespaceName, and prefix', () => {
    const name = XName.get(W.document.localName, W.document.namespaceName);
    expect(name).toBe(W.document);
  });
});

describe('toString(): string', () => {
  it('returns the local name for unqualified XName instances.', () => {
    const unqualifiedXName: XName = XName.get(localName);
    expect(unqualifiedXName.toString()).toEqual(localName);
  });

  it('returns the expanded name for qualified XName instances.', () => {
    const qualifiedXName: XName =
      XNamespace.get(namespaceName).getName(localName);

    expect(qualifiedXName.toString()).toEqual(`{${namespaceName}}${localName}`);
  });
});
