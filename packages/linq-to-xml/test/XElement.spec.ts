/**
 * @author Thomas Barnekow
 * @license MIT
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  XAttribute,
  XDocument,
  XElement,
  XNamespace,
  XProcessingInstruction,
  XText,
} from '../src';

import {
  createWordDocumentPackage,
  PKG,
  PKG_NAME,
  PKG_CONTENT_TYPE,
  W,
  WML_NAMESPACE_DECLARATIONS,
  W14,
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

describe('constructor(other: XElement)', () => {
  it('creates a deep copy of the other elements', () => {
    const nsAttribute = new XAttribute(xmlns_w, W.w.namespaceName);
    const paraIdAttribute = new XAttribute(W14.paraId, '12345678');

    const other = new XElement(
      W.document,
      nsAttribute,
      new XElement(
        W.body,
        new XElement(
          W.p,
          paraIdAttribute,
          new XElement(W.r, new XElement(W.t, 'Hello World!'))
        )
      )
    );

    const element = new XElement(other);

    expect(element.name).toBe(W.document);
    expect(element.attributes().single().name).toBe(xmlns_w);
  });
});

describe('get firstAttribute(): XAttribute | null', () => {
  it('returns the first attribute, if it exists', () => {
    const element = new XElement(
      W.p,
      new XAttribute(W14.paraId, '11111111'),
      new XAttribute(W14.textId, '22222222')
    );

    const attribute = element.firstAttribute;

    expect(attribute).not.toBeNull();
    expect(attribute!.name).toBe(W14.paraId);
  });

  it('returns null, if the element has no attributes', () => {
    const element = new XElement(W.p);
    expect(element.firstAttribute).toBeNull();
  });
});

describe('get hasAttributes(): boolean', () => {
  it('returns true if the element has attributes', () => {
    const element = new XElement(W.p, new XAttribute(W14.paraId, '12345678'));
    expect(element.hasAttributes).toBe(true);
  });

  it('returns false if the element has no attributes', () => {
    const element = new XElement(W.p);
    expect(element.hasAttributes).toBe(false);
  });
});

describe('get hasElements(): boolean', () => {
  it('returns true, if the element contains elements', () => {
    const element = new XElement(W.p, new XElement(W.r));
    expect(element.hasElements).toBe(true);
  });

  it('returns true, if the element contains nodes and elements', () => {
    const element = new XElement(
      W.p,
      new XText('\n  '),
      new XElement(W.r),
      new XText('\n')
    );
    expect(element.hasElements).toBe(true);
  });

  it('returns false, if the element has no elements', () => {
    const element = new XElement(W.p);
    expect(element.hasElements).toBe(false);
  });
});

describe('get isEmpty(): boolean', () => {
  // TODO: Add unit tests (covered by other tests)
});

describe('get lastAttribute(): XAttribute | null', () => {
  it('returns the last attribute, if it exists', () => {
    const element = new XElement(
      W.p,
      new XAttribute(W14.paraId, '11111111'),
      new XAttribute(W14.textId, '22222222')
    );

    const attribute = element.lastAttribute;

    expect(attribute).not.toBeNull();
    expect(attribute!.name).toBe(W14.textId);
  });

  it('returns null, if the element has no attributes', () => {
    const element = new XElement(W.p);
    expect(element.lastAttribute).toBeNull();
  });
});

describe('get name(): XName', () => {
  // TODO: Add unit tests (covered by other tests).
});

describe('set name(value: XName)', () => {
  it('sets the name', () => {
    const element = new XElement(W.p);
    element.name = W.r;
    expect(element.name).toBe(W.r);
  });
});

describe('get value(): string', () => {
  it('returns the empty string, if the element is empty', () => {
    const element = new XElement(W.p);
    expect(element.value).toEqual('');
  });

  it('returns the content, if the content is a string', () => {
    const expectedValue = 'Hello World!';
    const element = new XElement(W.t, expectedValue);
    expect(element.value).toEqual(expectedValue);
  });

  it('it concatenates the values of the child nodes, if the element has nodes', () => {
    const element = new XElement(
      W.p,
      new XElement(W.r, new XElement(W.t, 'a')),
      new XElement(W.r, new XElement(W.t, 'b')),
      new XElement(W.r, new XElement(W.t, 'c'))
    );

    expect(element.value).toEqual('abc');
  });
});

describe('set value(content: string)', () => {
  const element = new XElement(
    W.p,
    new XElement(W.r, new XElement(W.t, 'a')),
    new XElement(W.r, new XElement(W.t, 'b')),
    new XElement(W.r, new XElement(W.t, 'c'))
  );

  element.value = 'foo';

  expect(element._content).toEqual('foo');
  expect(element.value).toEqual('foo');
});

describe('ancestorsAndSelf(name?: XName | null): IterableOfXElement; name === undefined', () => {
  const package_: XElement = createWordDocumentPackage();

  it('returns itself for the root element', () => {
    const ancestors = package_.ancestorsAndSelf();
    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.package]);
  });

  it('returns itself and the parent element for a child of the root element', () => {
    const part = package_.elements(PKG.part).single();
    const ancestors = part.ancestorsAndSelf();
    const ancestorNames = [...ancestors].map((e) => e.name);
    expect(ancestorNames).toEqual([PKG.part, PKG.package]);
  });

  it('returns itself and the ancestors in reverse document order', () => {
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

describe('ancestorsAndSelf(name?: XName | null): IterableOfXElement; name === null', () => {
  it('returns an empty sequence if the name is null', () => {
    const body = new XElement(W.body);
    const document = new XElement(W.document, body);

    expect(body.ancestorsAndSelf().toArray()).toEqual([body, document]);

    const sequence = body.ancestorsAndSelf(null);

    expect(sequence.count()).toBe(0);
  });
});

describe('attribute(name: XName): XAttribute | null', () => {
  // TODO: Add unit tests (covered by other unit tests).
});

describe('attributes(name?: XName | null): IterableOfXAttribute', () => {
  const rsidR = new XAttribute(W.rsidR, '00000001');
  const rsidRDefault = new XAttribute(W.rsidRDefault, '00000002');
  const rsidP = new XAttribute(W.rsidP, '00000003');
  const element = new XElement(W.p, rsidR, rsidRDefault, rsidP);

  it('returns the named attribute(s), if a name is passed in', () => {
    const attributes = element.attributes(W.rsidRDefault);
    expect(attributes.single()).toBe(rsidRDefault);
  });

  it('returns all attributes, if no name is passed in', () => {
    const attributes = element.attributes();
    expect(attributes.toArray()).toEqual([rsidR, rsidRDefault, rsidP]);
  });

  it('returns an empty sequence if the element does not have attributes', () => {
    const element = new XElement(W.p);
    const attributes = element.attributes();
    expect(attributes.count()).toBe(0);
  });

  it('returns an empty sequence if the element does not have the named attribute', () => {
    const attributes = element.attributes(W14.paraId);
    expect(attributes.count()).toBe(0);
  });

  it('returns an empty sequence if the name is null', () => {
    const attributes = element.attributes(null);
    expect(attributes.count()).toBe(0);
  });
});

describe('descendantsAndSelf(name?: XName | null): IterableOfXElement', () => {
  const t = new XElement(W.t);
  const r = new XElement(W.r, t);
  const p = new XElement(W.p, r);

  it('returns the named decsendant if a name is passed in', () => {
    const sequence = p.descendantsAndSelf(W.r);
    expect(sequence.single()).toBe(r);
  });

  it('returns itself and all descendants if no name is passed in', () => {
    const sequence = p.descendantsAndSelf();
    expect(sequence.toArray()).toEqual([p, r, t]);
  });

  it('returns an empty sequence if the name is null', () => {
    const sequence = p.descendantsAndSelf(null);
    expect(sequence.count()).toBe(0);
  });
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

  it('throws if the XML string is malformed', () => {
    expect(() => XElement.parse('<look-no-closing-tag>')).toThrow();
  });

  it('throws if the XML string does not contain an element', () => {
    expect(() =>
      XElement.parse('<?mso-application progid="Word.Document"?>')
    ).toThrow();
  });
});

describe('removeAll(): void', () => {
  it('removes all attributes and nodes', () => {
    const wordPackage = createWordDocumentPackage();
    const paragraph = wordPackage.descendants(W.p).first();

    expect(paragraph.attributes().count() > 0).toBe(true);
    expect(paragraph.nodes().count() > 0).toBe(true);

    paragraph.removeAll();

    expect(paragraph.attributes().count()).toBe(0);
    expect(paragraph.nodes().count()).toBe(0);
  });
});

describe('removeAttributes(): void', () => {
  it('removes all attributes', () => {
    const element = new XElement(
      W.p,
      new XAttribute(W14.paraId, '12345678'),
      new XAttribute(W14.textId, '12345678')
    );
    expect(element.attributes().any()).toBe(true);

    element.removeAttributes();

    expect(element.attributes().any()).toBe(false);
  });
});

describe('removeAttribute(attr: XAttribute): void', () => {
  it('throws if the operation was corrupted by external code', () => {
    const attribute = new XAttribute(W14.paraId, '12345678');
    const element = new XElement(W.p, attribute);

    // Scenario: External code changes the attribute's parent.
    attribute._parent = null;

    expect(() => element.removeAttribute(attribute)).toThrow();
  });
});

describe('setAttributeValue(name: XName, value: Stringifyable): void', () => {
  it('sets the value of an existing attribute', () => {
    const element = new XElement(
      W.p,
      new XAttribute(W14.paraId, '12345678'),
      new XAttribute(W14.textId, '12345678'),
      new XAttribute(W.rsidR, '11223344')
    );

    element.setAttributeValue(W14.textId, '00000001');

    expect(element.attribute(W14.paraId)?.value).toEqual('12345678');
    expect(element.attribute(W14.textId)?.value).toEqual('00000001');
  });

  it('creates new attributes if they do not exist', () => {
    const element = new XElement(W.p);
    element.setAttributeValue(W14.paraId, '12345678');
    expect(element.attribute(W14.paraId)?.value).toEqual('12345678');
  });

  it('removes one of multiple existing attributes if the value is null', () => {
    const element = new XElement(
      W.p,
      new XAttribute(W14.paraId, '12345678'),
      new XAttribute(W14.textId, '12345678'),
      new XAttribute(W.rsidR, '11223344')
    );

    element.setAttributeValue(W.rsidR, null);

    expect(element.attribute(W.rsidR)).toBeNull();
  });

  it('removes the single existing attribute if the value is null', () => {
    const element = new XElement(W.p, new XAttribute(W14.textId, '12345678'));
    element.setAttributeValue(W14.textId, null);
    expect(element.attribute(W14.textId)).toBeNull();
  });
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

describe('validateNode(node: XNode, _previous: XNode | null): void', () => {
  const element = new XElement(W.document);

  it('throws if the node is an XDocument', () => {
    expect(() => element.validateNode(new XDocument(), null)).toThrow();
  });

  it('does nothing for any other subclass of XNode', () => {
    element.validateNode(new XElement(W.body), null);
    element.validateNode(
      new XProcessingInstruction('mso-application', 'progid="Word.Document"'),
      null
    );
    element.validateNode(new XText('Text'), null);
  });
});
