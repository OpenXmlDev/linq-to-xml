/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XNamespace } from '../src/internal';

const namespaceNameXml = 'http://www.w3.org/XML/1998/namespace';
const namespaceNameXmlns = 'http://www.w3.org/2000/xmlns/';

const namespaceNameW =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const namespaceNameW14 = 'http://schemas.microsoft.com/office/word/2010/wordml';
const namespaceNameW15 = 'http://schemas.microsoft.com/office/word/2012/wordml';

const w = XNamespace.get(namespaceNameW);
const w14 = XNamespace.get(namespaceNameW14);
const w15 = XNamespace.get(namespaceNameW15);

const document = w.getName('w', 'document');
const body = w.getName('w', 'body');

describe('The XNamespace class', () => {
  it('should have the "none" XNamespace property with "namespaceName": ""', () => {
    expect(XNamespace.none).toHaveProperty('namespaceName', '');
  });

  it(`should have the "xml" XNamespace property with "namespaceName": "${namespaceNameXml}"`, () => {
    expect(XNamespace.xml).toHaveProperty('namespaceName', namespaceNameXml);
  });

  it(`should have the "xmlns" XNamespace property with "namespaceName": "${namespaceNameXmlns}"`, () => {
    expect(XNamespace.xmlns).toHaveProperty(
      'namespaceName',
      namespaceNameXmlns
    );
  });
});

describe('The XNamespace.get() method', () => {
  it('should return the same instance for each namespace name', () => {
    expect(XNamespace.get(XNamespace.none.namespaceName)).toBe(XNamespace.none);
    expect(XNamespace.get(XNamespace.xml.namespaceName)).toBe(XNamespace.xml);

    expect(XNamespace.get(XNamespace.xmlns.namespaceName)).toBe(
      XNamespace.xmlns
    );

    expect(XNamespace.get(w.namespaceName)).toBe(w);
    expect(XNamespace.get(w14.namespaceName)).toBe(w14);
    expect(XNamespace.get(w15.namespaceName)).toBe(w15);
  });
});

describe('The XNamespace.geName() method', () => {
  it('should return the same instance for each name', () => {
    expect(w.getName('w', document.localName)).toBe(document);
    expect(w.getName('w', body.localName)).toBe(body);
  });

  it('should create objects with expected namespace and localName values', () => {
    expect(w.getName('w', 'p')).toMatchObject({
      namespace: w,
      localName: 'p',
    });
  });
});

describe('The XNamespace.toString() method', () => {
  it('should return the namespaceName value', () => {
    expect(w.toString()).toEqual(w.namespaceName);
    expect(w14.toString()).toEqual(w14.namespaceName);
    expect(w15.toString()).toEqual(w15.namespaceName);
  });
});
