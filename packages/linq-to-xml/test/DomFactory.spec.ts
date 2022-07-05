/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XDocument, XElement, XNode } from '../src/index.js';

import { DomFactory } from '../src/internal.js';
import { PKG_PACKAGE_TEXT } from './TestHelpers.js';

class UnexpectedXNode extends XNode {
  public constructor() {
    super();
  }

  cloneNode(): XNode {
    return new UnexpectedXNode();
  }

  public toString(): string {
    return 'What did you expect?';
  }
}

describe('static createDocument(xdocument: XDocument): XMLDocument', () => {
  it('creates a DOM XMLDocument from an XDocument', () => {
    const xDocument = XDocument.parse(PKG_PACKAGE_TEXT);

    const xmlDocument = DomFactory.createDocument(xDocument);

    const serializer = new XMLSerializer();
    const xmlDocumentString = serializer.serializeToString(xmlDocument);
    expect(xmlDocumentString).toEqual(PKG_PACKAGE_TEXT);
  });
});

describe('static createElement(xelement: XElement): Element', () => {
  it('creates a DOM Element from an XElement with namespace and prefix', () => {
    const text = PKG_PACKAGE_TEXT.slice(
      PKG_PACKAGE_TEXT.indexOf('<pkg:package')
    );

    const xElement = XElement.parse(text);

    const element = DomFactory.createElement(xElement);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(text);
  });

  it('creates a DOM Element from an XElement with a default namespace', () => {
    const text =
      '<div xmlns="http://www.w3.org/1999/xhtml" class="a"><p class="b"><span class="c">Text</span></p></div>';

    const xelement = XElement.parse(text);

    const element = DomFactory.createElement(xelement);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(text);
  });

  it('creates a DOM Element from a child XElement with a default namespace', () => {
    const text =
      '<div xmlns="http://www.w3.org/1999/xhtml" xmlns:x="x:y:z"><p class="b"><span>Text</span></p></div>';

    const div = XElement.parse(text);
    const xelement = div.elements().single();

    const element = DomFactory.createElement(xelement);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(
      '<p xmlns="http://www.w3.org/1999/xhtml" class="b"><span>Text</span></p>'
    );
  });

  it('creates a DOM Element from an XElement with an empty namespace', () => {
    const text = '<p class="MyClass"><span>Text</span></p>';
    const p = XElement.parse(text);

    const element = DomFactory.createElement(p);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(text);
  });

  it('deals with xml prefix', () => {
    const text = `
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body><w:p><w:r><w:t xml:space="preserve">Text</w:t></w:r></w:p></w:body>
</w:document>`.trim();
    const xElement = XElement.parse(text);

    const element = DomFactory.createElement(xElement);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(text);
  });

  it('throws if it encounters an unexpected node', () => {
    const xelement = new XElement('test', new UnexpectedXNode());
    expect(() => DomFactory.createElement(xelement)).toThrow();
  });
});
