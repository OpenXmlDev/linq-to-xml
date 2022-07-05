/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  XAttribute,
  XDeclaration,
  XDocument,
  XElement,
  XObject,
  XProcessingInstruction,
  XText,
} from '../src/index.js';

import { W } from './TestHelpers.js';

const node = new XText('Text');
const t = new XElement(W.t, node);
const r = new XElement(W.r, t);
const p = new XElement(W.p, r);
const body = new XElement(W.body, p);
const document = new XElement(W.document, body);
const xDocument = new XDocument(document);

describe('The XObject class', () => {
  it('is the (root) base class of most other classes', () => {
    expect(new XAttribute(W.val, 'value')).toBeInstanceOf(XObject);
    expect(new XElement(W.p)).toBeInstanceOf(XObject);
    expect(new XDocument()).toBeInstanceOf(XObject);
    expect(new XProcessingInstruction('target', 'key="value"')).toBeInstanceOf(
      XObject
    );
    expect(new XText('Text')).toBeInstanceOf(XObject);
  });

  it('is not the base class of XDeclaration', () => {
    expect(new XDeclaration()).not.toBeInstanceOf(XObject);
  });
});

describe('get document(): XDocument | null', () => {
  it('returns the XDocument if the object is contained in an XDocument', () => {
    expect(document.document).toBe(xDocument);
    expect(body.document).toBe(xDocument);
    expect(p.document).toBe(xDocument);
    expect(r.document).toBe(xDocument);
    expect(t.document).toBe(xDocument);
    expect(node.document).toBe(xDocument);
  });

  it('returns null if the object is not contained in an XDocument', () => {
    expect(new XElement(W.document).document).toBeNull();
    expect(new XText('Hello World!').document).toBeNull();
  });
});

describe('get parent(): XElement | null', () => {
  it('returns the parent element, if the object has a parent', () => {
    expect(p.parent).toBe(body);
    expect(r.parent).toBe(p);
    expect(t.parent).toBe(r);
    expect(node.parent).toBe(t);
  });

  it('returns null, if the object has no parent', () => {
    expect(document.parent).toBeNull();
    expect(new XElement(W.document).parent).toBeNull();
    expect(new XText('Hello World!').parent).toBeNull();
  });
});
