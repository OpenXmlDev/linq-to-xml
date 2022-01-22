/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XDocument, XElement, XText } from '../src/internal';
import { W } from './TestHelpers';

const node = new XText('Text');
const t = new XElement(W.t, node);
const r = new XElement(W.r, t);
const p = new XElement(W.p, r);
const body = new XElement(W.body, p);
const document = new XElement(W.document, body);
const xDocument = new XDocument(document);

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
