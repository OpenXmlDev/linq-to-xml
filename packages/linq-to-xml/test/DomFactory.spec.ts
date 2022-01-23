/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { DomFactory, XDocument } from '../src/internal';
import { PKG_PACKAGE_TEXT } from './TestHelpers';

describe('static createDocument(xdocument: XDocument): XMLDocument', () => {
  it('tests', () => {
    const xDocument = XDocument.parse(PKG_PACKAGE_TEXT);

    const xmlDocument = DomFactory.createDocument(xDocument);

    const serializer = new XMLSerializer();
    const xmlDocumentString = serializer.serializeToString(xmlDocument);
    expect(xmlDocumentString).toEqual(PKG_PACKAGE_TEXT);
  });
});
