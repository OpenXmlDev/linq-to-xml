/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  XDeclaration,
  XDocument,
  XElement,
  XProcessingInstruction,
} from '../src';

import { DomParser } from '../src/internal';
import { PKG_PACKAGE_TEXT, WML_NAMESPACE_DECLARATIONS, W } from './TestHelpers';

describe('static load(xmlDocument: XMLDocument): XDocument', () => {
  it('loads a DOM XMLDocument', () => {
    const text = `<w:document ${WML_NAMESPACE_DECLARATIONS}><w:body><w:p/></w:body></w:document>`;
    const xmlDocument: XMLDocument = DomParser.parseDocument(text);

    const xDocument = XDocument.load(xmlDocument);

    expect(xDocument.declaration).toBeNull();
    expect(xDocument.root).not.toBeNull();
    expect(xDocument.descendants(W.body).count()).toBe(1);
    expect(xDocument.descendants(W.p).count()).toBe(1);
  });
});

describe('static parse(text: string): XDocument', () => {
  it('returns the XDocument representation of the passed-in XML string', () => {
    const text = `<w:document ${WML_NAMESPACE_DECLARATIONS}><w:body><w:p/></w:body></w:document>`;

    const xDocument = XDocument.parse(text);

    expect(xDocument.declaration).toBeNull();
    expect(xDocument.root).not.toBeNull();
    expect(xDocument.descendants(W.body).count()).toBe(1);
    expect(xDocument.descendants(W.p).count()).toBe(1);
  });
});

describe('get declaration(): XDeclaration | null', () => {
  it('returns the XML declaration, if any, or null', () => {
    expect(new XDocument(new XDeclaration()).declaration).not.toBeNull();
    expect(new XDocument().declaration).toBeNull();
  });
});

describe('get root(): XElement | null', () => {
  it('returns the root XElement, if any, or null', () => {
    expect(new XDocument(new XElement(W.document)).root).not.toBeNull();
    expect(new XDocument(new XDeclaration()).root).toBeNull();
    expect(new XDocument().root).toBeNull();
  });
});

describe('cloneNode(): XNode', () => {
  it('creates a copy with the same declaration and nodes', () => {
    const original = new XDocument(
      new XDeclaration(),
      new XElement(W.document, new XElement(W.body, new XElement(W.p)))
    );

    const copy = original.cloneNode() as XDocument;

    expect(copy.declaration).not.toBe(original.declaration);
    expect(copy.root).not.toBe(original.root);
    expect(copy.toString()).toEqual(original.toString());
  });

  it('creates a copy with the same nodes', () => {
    const original = new XDocument(
      new XProcessingInstruction('mso-application', 'progid="Word.Document"'),
      new XElement(W.document, new XElement(W.body, new XElement(W.p)))
    );

    const copy = original.cloneNode() as XDocument;

    expect(copy.declaration).toBeNull();
    expect(copy.root).not.toBe(original.root);
    expect(copy.toString()).toEqual(original.toString());
  });
});

describe('toString(): string', () => {
  it('returns the expected markup', () => {
    const xDocument = XDocument.parse(PKG_PACKAGE_TEXT);

    const text = xDocument.toString();

    expect(text).toContain('<?mso-application progid="Word.Document"?>');
    expect(text).toContain(
      '<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage">'
    );
    expect(text).toContain(`<w:document ${WML_NAMESPACE_DECLARATIONS}>`);
    expect(text).toContain(
      '<w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">'
    );
    expect(text).toContain('<w:t>Heading</w:t>');
  });
});
