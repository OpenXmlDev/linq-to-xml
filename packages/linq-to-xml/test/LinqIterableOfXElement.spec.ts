/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { ILinqIterable, XElement, XName, XNode, XText } from '../src/internal';
import { createWordDocumentPackage, W } from './TestHelpers';

function getNodeSignature(node: XNode): XName | string {
  if (node instanceof XElement) {
    return node.name;
  } else if (node instanceof XText) {
    return node.value;
  } else {
    throw new Error('Invalid node');
  }
}

function getSignature<T extends XNode>(
  sequence: ILinqIterable<T>
): (string | XName)[] {
  return sequence.select(getNodeSignature).toArray();
}

describe('ancestors(name?: XName): ILinqIterableOfXElement', () => {
  const p = new XElement(W.p);
  const body = new XElement(W.body, p);
  const document = new XElement(W.document, body);

  const getIterableOfXElement = () => body.elements();

  it('returns all ancestors, if no name is passed', () => {
    const ancestors = getIterableOfXElement().ancestors();
    expect(ancestors.toArray()).toEqual([body, document]);
  });

  it('returns the ancestors having the given name, if a name is passed', () => {
    const ancestors = getIterableOfXElement().ancestors(W.document);
    expect(ancestors.toArray()).toEqual([document]);
  });
});

describe('ancestorsAndSelf(name?: XName): ILinqIterableOfXElement', () => {
  const p = new XElement(W.p);
  const body = new XElement(W.body, p);
  const document = new XElement(W.document, body);

  const getIterableOfXElement = () => body.elements();

  it('returns the element and all ancestors, if no name is passed', () => {
    const sequence = getIterableOfXElement().ancestorsAndSelf();
    expect(sequence.toArray()).toEqual([p, body, document]);
  });

  it('returns the element and ancestors having the given name, if a name is passed', () => {
    const sequence = getIterableOfXElement().ancestorsAndSelf(W.document);
    expect(sequence.toArray()).toEqual([document]);
  });
});

describe('attributes(name?: XName): ILinqIterableOfXAttribute', () => {
  it('returns all attributes, if no name is passed', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const attributes = wordPackage.descendants(W.p).attributes();

    expect(attributes.count()).toBe(8);
  });

  it('returns the named attributes, if a name is passed', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const attributes = wordPackage.descendants(W.p).attributes(W.rsidR);

    expect(attributes.count()).toBe(3);
    expect(attributes.all((a) => a.name === W.rsidR)).toBe(true);
  });
});

describe('descendantNodes(): ILinqIterableOfXNode', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const getIterableOfXElement = () => wordPackage.descendants(W.p);

  it('returns all descendant nodes', () => {
    const sequence = getIterableOfXElement().descendantNodes();
    const signature = getSignature(sequence);
    expect(signature).toEqual([
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Heading',
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Body Text.',
    ]);
  });
});

describe('descendantNodesAndSelf(): ILinqIterableOfXNode', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const getIterableOfXElement = () => wordPackage.descendants(W.p);

  it('returns all elements and descendant nodes', () => {
    const sequence = getIterableOfXElement().descendantNodesAndSelf();
    const signature = getSignature(sequence);
    expect(signature).toEqual([
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Heading',
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      'Body Text.',
      W.p,
    ]);
  });
});

describe('descendants(name?: XName | null): ILinqIterableOfXElement', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const getIterableOfXElement = () => {
    // For code coverage reasons, ensure that all string content is converted
    // to XText instances. Otherwise, certain branches are not hit.
    wordPackage.descendants(W.t).nodes().toArray();

    // Return the actual IterableOfXElement.
    return wordPackage.descendants(W.p);
  };

  it('returns all descendants, if no name is passed', () => {
    const sequence = getIterableOfXElement().descendants();

    const signature = getSignature(sequence);
    expect(signature).toEqual([
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
    ]);
  });

  it('returns all descendants having the given name, if a name is passed', () => {
    const sequence = getIterableOfXElement().descendants(W.pStyle);

    const signature = getSignature(sequence);
    expect(signature).toEqual([W.pStyle, W.pStyle]);
  });

  it('returns an empty sequence, if name === null', () => {
    const sequence = getIterableOfXElement().descendants(null);
    expect(sequence.count()).toBe(0);
  });
});

describe('descendantsAndSelf(name?: XName): ILinqIterableOfXElement', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const getIterableOfXElement = () => wordPackage.descendants(W.p);

  it('returns all elements and descendants, if no name is passed', () => {
    const sequence = getIterableOfXElement().descendantsAndSelf();

    const signature = getSignature(sequence);
    expect(signature).toEqual([
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      W.p,
      W.pPr,
      W.pStyle,
      W.r,
      W.t,
      W.p,
    ]);
  });

  it('returns the elements and descendants having the given name, if a name is passed', () => {
    const sequence = getIterableOfXElement().descendantsAndSelf(W.pStyle);

    const signature = getSignature(sequence);
    expect(signature).toEqual([W.pStyle, W.pStyle]);
  });

  it('returns an empty sequence, if name === null', () => {
    const sequence = getIterableOfXElement().descendantsAndSelf(null);
    expect(sequence.count()).toBe(0);
  });
});

describe('elements(name?: XName | null): ILinqIterableOfXElement', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const getIterableOfXElement = () => wordPackage.descendants(W.r);

  it('returns all elements, if no name is passed', () => {
    const iterable = getIterableOfXElement();
    const sequence = iterable.elements();
    expect(sequence.count()).toEqual(2);
  });

  it('returns the elements having the given name, if a name is passed', () => {
    const iterable = getIterableOfXElement();
    const sequence = iterable.elements(W.t);
    expect(sequence.count()).toBe(2);
  });

  it('returns an empty sequence if name === null', () => {
    const iterable = getIterableOfXElement();
    const sequence = iterable.elements(null);
    expect(sequence.any()).toBe(false);
  });

  // TODO: Add further unit tests.
});

describe('nodes(): ILinqIterableOfXNode', () => {
  // TODO: Add unit tests.
});

describe('remove(): void', () => {
  it('removes all sequence items', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const sequence = wordPackage.descendants(W.r);

    sequence.remove();

    expect(wordPackage.descendants(W.r).any()).toBe(false);
  });
});

describe('where(predicate: PredicateWithIndex<XElement>): ILinqIterableOfXElement', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const iterable = wordPackage.descendants(W.p);

  const sequence = iterable.where((e) => e.isEmpty);

  expect(sequence.count()).toBe(1);
});
