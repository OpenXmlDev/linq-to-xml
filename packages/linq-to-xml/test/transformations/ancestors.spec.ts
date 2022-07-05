/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { linqIterable, XElement } from '../../src';
import { ancestors, ancestorsAndSelf } from '../../src/transformations';

import { createWordDocumentPackage, PKG, W } from '../TestHelpers.js';

describe('ancestors<T>(name?: XName | null): IterableValueTransform<T, XElement>', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  it('returns all ancestors if no name is passed', () => {
    const sequence = wordPackage.descendants(W.t).nodes();

    const transformedSequence = ancestors()(sequence);

    // We have two w:t elements with text nodes. Therefore, we expect to get
    // two lines of ancestors, one for each text node.
    expect(
      linqIterable(transformedSequence)
        .select((e) => e.name)
        .toArray()
    ).toEqual([
      // Ancestors of first text node
      W.t,
      W.r,
      W.p,
      W.body,
      W.document,
      PKG.xmlData,
      PKG.part,
      PKG.package,

      // Ancestors of second text node
      W.t,
      W.r,
      W.p,
      W.body,
      W.document,
      PKG.xmlData,
      PKG.part,
      PKG.package,
    ]);
  });

  it('returns the named ancestors if a name is passed', () => {
    const sequence = wordPackage.descendants(W.t).nodes();

    const transformedSequence = ancestors(W.p)(sequence);

    // We have two w:t elements with text nodes. Therefore, we expect two w:p
    // ancestor elements.
    expect(
      linqIterable(transformedSequence)
        .select((e) => e.name)
        .toArray()
    ).toEqual([W.p, W.p]);
  });

  it('returns an empty sequence if the name is null', () => {
    const sequence = wordPackage.descendants(W.t).nodes();
    const transformedSequence = ancestors(null)(sequence);
    expect(linqIterable(transformedSequence).any()).toBe(false);
  });
});

describe('ancestorsAndSelf(name?: XName | null): IterableValueTransform<XElement, XElement>', () => {
  const p = new XElement(W.p);
  const body = new XElement(W.body, p);
  const document = new XElement(W.document, body);

  it('returns the element and all ancestors, if no name is passed', () => {
    const sequence = body.elements();
    const transformedSequence = ancestorsAndSelf()(sequence);
    expect(linqIterable(transformedSequence).toArray()).toEqual([
      p,
      body,
      document,
    ]);
  });

  it('returns the element and ancestors having the given name, if a name is passed', () => {
    const sequence = body.elements();
    const transformedSequence = ancestorsAndSelf(W.document)(sequence);
    expect(linqIterable(transformedSequence).toArray()).toEqual([document]);
  });

  it('returns an empty sequence if the name is null', () => {
    const sequence = body.elements();
    const transformedSequence = ancestorsAndSelf(null)(sequence);
    expect(linqIterable(transformedSequence).any()).toBe(false);
  });
});
