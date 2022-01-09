/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XName, XNamespace } from '../src/internal';

const namespaceName =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const localName = 'document';

describe('The XName.get() method', () => {
  it('should return names with the empty namespace', () => {
    expect(XName.get(localName)).toMatchObject({
      namespace: XNamespace.none,
      localName: localName,
    });
  });

  it('should return names with namespaces', () => {
    expect(XName.get(`{${namespaceName}}${localName}`)).toBe(
      XNamespace.get(namespaceName).getName(localName)
    );
  });
});

describe('The XName.toString() method', () => {
  it('should return the local name for unqualified XName instances.', () => {
    const unqualifiedXName: XName = XName.get(localName);
    expect(unqualifiedXName.toString()).toEqual(localName);
  });

  it('should return the expanded name for qualified XName instances.', () => {
    const qualifiedXName: XName =
      XNamespace.get(namespaceName).getName(localName);

    expect(qualifiedXName.toString()).toEqual(`{${namespaceName}}${localName}`);
  });
});
