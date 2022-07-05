/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute, XElement, XNamespace } from '../src/index.js';
import { createWordDocumentPackage, W, W14 } from './TestHelpers.js';

describe('constructor(name: XName | string, value: Stringifyable)', () => {
  it('throws for xmlns:<any>=""', () => {
    expect(() => new XAttribute(XNamespace.xmlns.getName('any'), '')).toThrow();
  });

  it('throws for xmlns:<not-equal-to-xml>="http://www.w3.org/XML/1998/namespace"', () => {
    expect(
      () =>
        new XAttribute(
          XNamespace.xmlns.getName('any'),
          XNamespace.xmlPrefixNamespaceName
        )
    ).toThrow();
  });

  it('throws for xmlns:<any>="http://www.w3.org/XML/1998/namespace"', () => {
    expect(
      () =>
        new XAttribute(
          XNamespace.xmlns.getName('xml'),
          XNamespace.xmlnsPrefixNamespaceName
        )
    ).toThrow();
  });

  it('throws for xmlns:xml="<not-the-xml-namespace>"', () => {
    expect(
      () =>
        new XAttribute(
          XNamespace.xmlns.getName('xml'),
          'urn:not-the-xml-namespace'
        )
    ).toThrow();
  });

  it('throws for xmlns:xmlns="<any-namespace>"', () => {
    expect(
      () =>
        new XAttribute(XNamespace.xmlns.getName('xmlns'), 'urn:any-namespace')
    ).toThrow();
  });

  it('throws for xmlns="http://www.w3.org/XML/1998/namespace"', () => {
    expect(
      () => new XAttribute('xmlns', XNamespace.xmlPrefixNamespaceName)
    ).toThrow();
  });

  it('throws for xmlns="http://www.w3.org/2000/xmlns/"', () => {
    expect(
      () => new XAttribute('xmlns', XNamespace.xmlnsPrefixNamespaceName)
    ).toThrow();
  });
});

describe('get name(): XName', () => {
  it('gets the attribute name', () => {
    const attr = new XAttribute(W.val, '100');
    expect(attr.name).toBe(W.val);
  });
});

describe('get nextAttribute(): XAttribute | null', () => {
  const paraId = new XAttribute(W14.paraId, '12345678');
  const textId = new XAttribute(W14.textId, '12345678');
  const element = new XElement(W.p, paraId, textId);

  expect(element.firstAttribute).toBe(paraId);
  expect(element.lastAttribute).toBe(textId);

  it('returns the next attribute if it exists', () => {
    const firstAttr = element.firstAttribute!;
    const nextAttr = firstAttr.nextAttribute;
    expect(nextAttr).toBe(textId);
  });

  it('returns null if there is no next attribute', () => {
    const lastAttr = element.lastAttribute!;
    const nextAttr = lastAttr.nextAttribute;
    expect(nextAttr).toBeNull();
  });
});

describe('get value(): string', () => {
  it('gets the attribute value', () => {
    const attr = new XAttribute(W.val, '100');
    expect(attr.value).toEqual('100');
  });
});

describe('set value(value: string)', () => {
  it('sets the attribute value', () => {
    const attr = new XAttribute(W.val, '100');
    attr.value = '200';
    expect(attr.value).toEqual('200');
  });
});

describe('remove(): void', () => {
  it('removes the attribute from its parent', () => {
    const attr = new XAttribute(W.val, 'Heading1');
    const element = new XElement(W.pStyle, attr);

    expect(attr.parent).toBe(element);

    attr.remove();

    expect(attr.parent).toBeNull();
  });

  it('throws if the attribute does not have a parent', () => {
    const attr = new XAttribute(W.val, 'Heading1');
    expect(() => attr.remove()).toThrow();
  });
});

describe('toString(): string', () => {
  it('returns the string representation for names with prefixes', () => {
    const root = createWordDocumentPackage();
    const attribute = root.descendants().attributes(W.rsidR).first();
    expect(attribute.toString()).toEqual('w:rsidR="007A3403"');
  });

  it('returns the string representation when namespace declaration is missing', () => {
    const attribute = new XAttribute(W.rsidR, '007A3403');
    const attributeString = attribute.toString();
    expect(attributeString).toEqual(`rsidR="007A3403"`);
  });

  it('returns the string representation for names without prefixes', () => {
    expect(new XAttribute('id', '1').toString()).toEqual('id="1"');
  });

  it('returns the string representation for the xmlns namespace', () => {
    const attribute = new XAttribute(
      XNamespace.xmlns.getName('w'),
      W.w.namespaceName
    );
    const attributeString = attribute.toString();
    expect(attributeString).toEqual(`xmlns:w="${W.w.namespaceName}"`);
  });

  it('returns the string representation for the xml namespace', () => {
    const attribute = new XAttribute(
      XNamespace.xml.getName('space'),
      'preserve'
    );
    const attributeString = attribute.toString();
    expect(attributeString).toEqual(`xml:space="preserve"`);
  });

  it('correctly renders XML entities', () => {
    const attribute = new XAttribute('name', '"<&>"');
    const xml = attribute.toString();
    expect(xml).toEqual('name="&quot;&lt;&amp;&gt;&quot;"');
  });
});
