/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XDocument, XElement, XNode } from '../src';

import { DomFactory } from '../src/internal';
import { PKG_PACKAGE_TEXT } from './TestHelpers';

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

  it('creates a DOM Element from an XElement with namespace and without prefix', () => {
    const text =
      '<p xmlns="http://www.w3.org/1999/xhtml" class="MyClass">Text</p>';

    const xElement = XElement.parse(text);

    const element = DomFactory.createElement(xElement);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(text);
  });

  it('creates a DOM Element from an XElement without namespace and prefix', () => {
    const text = '<p class="MyClass">Text</p>';
    const xElement = XElement.parse(text);

    const element = DomFactory.createElement(xElement);

    const serializer = new XMLSerializer();
    const elementString = serializer.serializeToString(element);
    expect(elementString).toEqual(text);
  });

  it('throws', () => {
    const xelement = new XElement('test', new UnexpectedXNode());
    expect(() => DomFactory.createElement(xelement)).toThrow();
  });
});
