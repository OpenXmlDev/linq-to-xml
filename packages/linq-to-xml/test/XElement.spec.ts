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

const xmlns_pkg = XNamespace.xmlns.getName('pkg');
const xmlns_w = XNamespace.xmlns.getName('w');

describe('constructor(name: XName, ...contentArray: any[])', () => {
  test('an XElement constructed with content parameters has such parameters as elements', () => {
    const element = new XElement(
      W.body,
      new XElement(W.p),
      new XElement(W.tbl)
    );

    expect(
      element
        .elements()
        .select((e) => e.name)
        .toArray()
    ).toEqual([W.p, W.tbl]);
  });

  test('an XElement constructed with an array of elements has the array items as elements', () => {
    const element = new XElement(W.body, [
      new XElement(W.p),
      new XElement(W.tbl),
    ]);

    expect(
      element
        .elements()
        .select((e) => e.name)
        .toArray()
    ).toEqual([W.p, W.tbl]);
  });

  test('an XElement constructed with elemetns and nested arrays has the linearized elements', () => {
    const element = new XElement(
      W.body,
      new XElement(W.p),
      [
        new XElement(W.p),
        new XElement(W.tbl),
        [new XElement(W.p), new XElement(W.tbl)],
      ],
      new XElement(W.p)
    );

    expect(
      element
        .elements()
        .select((e) => e.name)
        .toArray()
    ).toEqual([W.p, W.p, W.tbl, W.p, W.tbl, W.p]);
    2;
  });
});

describe('get firstAttribute(): XAttribute | null', () => {
  // TODO: Add unit tests.
});

describe('get hasAttributes(): boolean', () => {
  // TODO: Add unit tests.
});

describe('get hasElements(): boolean', () => {
  // TODO: Add unit tests.
});

describe('get isEmpty(): boolean', () => {
  // TODO: Add unit tests.
});

describe('get lastAttribute(): XAttribute | null', () => {
  // TODO: Add unit tests.
});

describe('get name(): XName', () => {
  // TODO: Add unit tests.
});

describe('set name(value: XName)', () => {
  // TODO: Add unit tests.
});

describe('get value(): string', () => {
  // TODO: Add unit tests.
});

describe('set value(content: string)', () => {
  // TODO: Add unit tests.
});

describe('ancestorsAndSelf(name?: XName | null): IterableOfXElement; name === undefined', () => {
  const package_: XElement = createWordDocumentPackage();

  it('should return itself for the root element', () => {
    const ancestors = package_.ancestorsAndSelf();
    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.package]);
  });

  it('should return itself and the parent element for a child of the root element', () => {
    const part = package_.elements(PKG.part).single();
    const ancestors = part.ancestorsAndSelf();
    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.part, PKG.package]);
  });

  it('should return itself and the ancestors in reverse document order', () => {
    const element = package_
      .elements(PKG.part)
      .elements(PKG.xmlData)
      .elements(W.document)
      .single();

    const ancestors = element.ancestorsAndSelf();
    const ancestorNames = [...ancestors].map((e) => e.name);

    expect(ancestorNames).toEqual([
      W.document,
      PKG.xmlData,
      PKG.part,
      PKG.package,
    ]);
  });
});

describe('ancestorsAndSelf(name?: XName | null): IterableOfXElement; name !== undefined', () => {
  const package_: XElement = createWordDocumentPackage();
  const document = package_
    .elements(PKG.part)
    .elements(PKG.xmlData)
    .elements(W.document)
    .single();

  it('should return the named element(s)', () => {
    const ancestors = document.ancestorsAndSelf(PKG.part);
    const ancestor = ancestors.single();
    expect(ancestor.name).toBe(PKG.part);
  });
});

describe('attribute(name: XName): XAttribute | null', () => {
  // TODO: Add unit tests.
});

describe('attributes(name?: XName | null): IterableOfXAttribute', () => {
  it('should be iterable', () => {
    const rsidR = new XAttribute(W.rsidR, '00000001');
    const rsidRDefault = new XAttribute(W.rsidRDefault, '00000002');
    const rsidP = new XAttribute(W.rsidP, '00000003');
    const element = new XElement(W.p, rsidR, rsidRDefault, rsidP);

    const attributes = [...element.attributes()];

    expect(attributes[0]).toBe(rsidR);
    expect(attributes[1]).toBe(rsidRDefault);
    expect(attributes[2]).toBe(rsidP);
  });

  it('should offer a remove() method', () => {
    const rsidR = new XAttribute(W.rsidR, '00000001');
    const rsidRDefault = new XAttribute(W.rsidRDefault, '00000002');
    const rsidP = new XAttribute(W.rsidP, '00000003');
    const element = new XElement(W.p, rsidR, rsidRDefault, rsidP);

    const attributes = element.attributes();

    attributes.remove();
  });
});

describe('descendantsAndSelf(name?: XName | null): IterableOfXElement; name === undefined', () => {
  // TODO: Add unit tests.
});

describe('descendantsAndSelf(name?: XName | null): IterableOfXElement; name !== undefined', () => {
  // TODO: Add unit tests.
});

describe('static load(element: Element): XElement', () => {
  // TODO: Add unit tests.
});

describe('static parse(text: string): XElement', () => {
  const element = createWordDocumentPackage();
  const part = element.element(PKG.part)!;
  const xmlData = part.element(PKG.xmlData)!;
  const document = xmlData.element(W.document)!;
  const body = document.element(W.body)!;

  it('should parse the node tree', () => {
    expect(element.name).toBe(PKG.package);
    expect(part?.name).toBe(PKG.part);
    expect(xmlData.name).toBe(PKG.xmlData);
    expect(document.name).toBe(W.document);
    expect(body.name).toBe(W.body);
  });

  it('should parse attributes', () => {
    expect(part.attribute(PKG.name_)!.value).toEqual('/word/document.xml');
    expect(part.attribute(PKG.contentType)!.value).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'
    );
  });

  it('should parse namespace declarations (i.e., specific kinds of attributes)', () => {
    expect(element.attribute(xmlns_pkg)!.value).toEqual(PKG.pkg.namespaceName);
    expect(document.attribute(xmlns_w)!.value).toEqual(W.w.namespaceName);
  });
});

describe('removeAll(): void', () => {
  // TODO: Add unit tests.
});

describe('removeAttributes(): void', () => {
  // TODO: Add unit tests.
});

describe('setAttributeValue(name: XName, value: any): void', () => {
  // TODO: Add unit tests.
});

describe('toString(): string', () => {
  const element = createWordDocumentPackage();
  const part = element.element(PKG.part)!;

  it('should produce the expected string representation', () => {
    const xml = part.toString();

    expect(xml).toContain('<pkg:part');
    expect(xml).toContain(`${PKG_NAME} ${PKG_CONTENT_TYPE}`);
    expect(xml).toContain('<pkg:xmlData>');
    expect(xml).toContain(`<w:document ${WML_NAMESPACE_DECLARATIONS}>`);
    expect(xml).toContain('<w:body>');
    expect(xml).toContain(
      '<w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">'
    );
    expect(xml).toContain('<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>');
    expect(xml).toContain('<w:r><w:t>Heading</w:t></w:r>');
    expect(xml).toContain(
      '<w:p w:rsidR="00000000" w:rsidRDefault="007A3403"/>'
    );
  });
});
