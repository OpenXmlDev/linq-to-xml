/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  XAttribute,
  XContainer,
  XDocument,
  XElement,
  XNode,
  XText,
} from '../src/index.js';

import { W } from './TestHelpers.js';

describe('get firstNode(): XNode | null', () => {
  // TODO: Add unit tests (covered by other unit tests).
});

describe('get lastNode(): XNode | null', () => {
  it('returns the last XNode', () => {
    const bookmarkEnd = new XElement(W.bookmarkEnd);
    const container = new XElement(
      W.p,
      new XElement(W.bookmarkStart),
      bookmarkEnd
    );

    expect(container.lastNode).toBe(bookmarkEnd);
  });

  it('returns null if the container has no content', () => {
    const container = new XElement(W.p);
    expect(container.lastNode).toBeNull();
  });

  it('returns null if the content is an empty string', () => {
    const container = new XElement(W.p);
    container._content = '';

    expect(container.lastNode).toBeNull();
  });

  it('converts non-empty string content to an XText', () => {
    const container = new XElement(W.p, 'Text');
    expect(container._content).toEqual('Text');

    const lastNode = container.lastNode;

    expect(lastNode).toBeInstanceOf(XText);
    expect((lastNode as XText).value).toEqual('Text');
  });
});

describe('add(content: any): void', () => {
  it('does not add anything if content === undefined', () => {
    const element = new XElement(W.p);
    element.add(undefined);
    expect(element.isEmpty).toBe(true);
  });

  it('does not add anything if content === null', () => {
    const element = new XElement(W.p);
    element.add(null);
    expect(element.isEmpty).toBe(true);
  });

  it('does not add anything if content == ""', () => {
    const element = new XElement(W.p);
    element.add('');
    expect(element.isEmpty).toBe(true);
  });

  it('does not leave the element empty if content === 0', () => {
    const element = new XElement(W.t);
    element.add(0);
    expect(element.isEmpty).toBe(false);
  });

  it('adds string content with a value of "0" if content === 0', () => {
    const element = new XElement(W.t);
    element.add(0);
    expect(typeof element._content).toEqual('string');
    expect(element._content).toEqual('0');
  });

  it('concatenates existing and passed-in string content', () => {
    const element = new XElement(W.t, 'a');
    element.add('b');
    expect(element._content).toEqual('ab');
  });

  it('adds passed-in string content to an existing text node', () => {
    const text = new XText('a');
    const element = new XElement(W.t, text);

    element.add('b');

    expect(element.nodes().single()).toBe(text);
    expect(text.value).toEqual('ab');
  });

  it('adds a new text node if the element has nodes already', () => {
    const span = new XElement('span', 'Span');
    const p = new XElement('p', span);

    p.add('Text');

    expect(p.nodes().first()).toBe(span);
    expect(p.nodes().last()).toBeInstanceOf(XText);
    expect(p.value).toEqual('SpanText');
  });

  it('converts string content to a text node when adding further nodes', () => {
    const p = new XElement('p', 'String');

    // Access the fields rather than firstNode and lastNode because those would
    // convert string content to text nodes already.
    expect(typeof p._content).toEqual('string');

    p.add(new XElement('span', 'Text'));

    // See above.
    expect(p._content).toBeInstanceOf(XElement);
    expect((p._content as XNode)._next).toBeInstanceOf(XText);
  });

  it('throws if duplicate attributes are added', () => {
    const element = new XElement(W.p, new XAttribute(W.rsidR, '12345678'));
    expect(() => element.add(new XAttribute(W.rsidR, '12345678'))).toThrow();
  });

  it('clones nodes that are already associated with a parent', () => {
    const existingNode: XNode = new XElement(W.r, new XElement(W.t, 'Hi!'));
    const existingParent = new XElement(W.p, existingNode);
    const newParent = new XElement(W.p);

    newParent.add(existingNode);
    const newNode = newParent.nodes().single();

    expect(existingParent.nodes().single()).toBe(existingNode);
    expect(newNode).not.toBeNull();
    expect(newNode).not.toBe(existingNode);
    expect(newNode.toString()).toEqual(existingNode.toString());
  });

  it('clones nodes if the root element is added to the tree as a node', () => {
    const anchor = new XElement('anchor');
    const root = new XElement('root', anchor);

    anchor.add(root);

    expect(
      anchor
        .descendants()
        .select((e) => e.name.localName)
        .toArray()
    ).toEqual(['root', 'anchor']);

    expect(anchor.nodes().single()).not.toBe(root);
  });

  it('clones attributes that are already associated with a parent', () => {
    const existingAttribute = new XAttribute(W.rsidR, '12345678');
    const existingParent = new XElement(W.p, existingAttribute);
    const newParent = new XElement(W.p);

    newParent.add(existingAttribute);
    const newAttribute = newParent.attribute(W.rsidR);

    expect(existingParent.attribute(W.rsidR)).toBe(existingAttribute);
    expect(newAttribute).not.toBeNull();
    expect(newAttribute).not.toBe(existingAttribute);
    expect(newAttribute!.value).toEqual('12345678');
  });
});

describe('addAttributeSkipNotify(_a: XAttribute): void', () => {
  it('does nothing (virtual base method)', () => {
    const container = new XDocument();

    // For code coverage purposes only.
    container.addAttributeSkipNotify(new XAttribute(W.val, 'Test Only!'));

    expect(container._content).toBeNull();
    expect(container._next).toBeNull();
    expect(container._parent).toBeNull();
  });
});

describe('descendants(name?: XName | null): IterableOfXElement', () => {
  const t = new XElement(W.t, 'Text');
  const r = new XElement(W.r, t);
  const p = new XElement(W.p, r);
  const body = new XElement(W.body, p);

  it('returns all descendants if no name is passed in', () => {
    const sequence = body.descendants();
    expect(sequence.select((e) => e.name).toArray()).toEqual([W.p, W.r, W.t]);
  });

  it('returns the named element', () => {
    const sequence = body.descendants(W.r);
    expect(sequence.select((e) => e.name).single()).toBe(W.r);
  });

  it('returns an empty sequence if the name is null', () => {
    const sequence = body.descendants(null);
    expect(sequence.count()).toBe(0);
  });
});

describe('element(name: XName): XElement | null', () => {
  const body = new XElement(
    W.body,
    new XElement(W.tbl),
    new XElement(W.p, new XElement(W.r, new XElement(W.t, 'First'))),
    new XElement(W.tbl),
    new XElement(W.p, new XElement(W.r, new XElement(W.t, 'Second'))),
    new XElement(W.sectPr)
  );

  it('returns the first child element having the given name', () => {
    const element = body.element(W.p);
    expect(element?.value).toEqual('First');
  });

  it('returns null if there is no child element with the given name', () => {
    const element = body.element(W.sdt);
    expect(element).toBeNull();
  });
});

describe('elements(name?: XName | null): IterableOfXElement', () => {
  const body = new XElement(
    W.body,
    new XElement(W.tbl),
    new XElement(W.p, new XElement(W.r, new XElement(W.t, 'First'))),
    new XElement(W.tbl),
    new XElement(W.p, new XElement(W.r, new XElement(W.t, 'Second'))),
    new XElement(W.sectPr)
  );

  it('returns the named elements', () => {
    const sequence = body.elements(W.p);
    expect(sequence.select((e) => e.value).toArray()).toEqual([
      'First',
      'Second',
    ]);
  });

  it('returns all elements if no name is pased in', () => {
    const sequence = body.elements();
    expect(sequence.select((e) => e.name).toArray()).toEqual([
      W.tbl,
      W.p,
      W.tbl,
      W.p,
      W.sectPr,
    ]);
  });

  it('returns null if name is null', () => {
    const sequence = body.elements(null);
    expect(sequence.count()).toBe(0);
  });

  it('returns an empty sequence if the named element does not exist', () => {
    const sequence = body.elements(W.sdt);
    expect(sequence.count()).toBe(0);
  });

  it('returns an empty sequence if the element does not have child elements', () => {
    const element = new XElement(W.document);
    const sequence = element.elements();
    expect(sequence.count()).toBe(0);
  });
});

describe('static getStringValue(value: Stringifyable): string', () => {
  it('returns string values', () => {
    expect(XContainer.getStringValue('Text')).toEqual('Text');
  });

  it('converts numbers to string', () => {
    expect(XContainer.getStringValue(10)).toEqual('10');
    expect(XContainer.getStringValue(16)).toEqual('16');
  });

  it('converts boolean values to "true" and "false", respectively', () => {
    expect(XContainer.getStringValue(true)).toEqual('true');
    expect(XContainer.getStringValue(false)).toEqual('false');
  });

  it('converts Date instances to their ISO string representation', () => {
    const date = new Date('2022-01-21T12:00:00.000Z');
    expect(XContainer.getStringValue(date)).toEqual('2022-01-21T12:00:00Z');
  });

  it('converts stringifyable objects to string, using their toString() methods', () => {
    const stringifyableObject = {
      foo: 'Foo',
      bar: 'Bar',
      toString: () => 'Text',
    };

    expect(XContainer.getStringValue(stringifyableObject)).toEqual('Text');
  });
});

describe('nodes(): IterableOfXNode', () => {
  // TODO: Add unit tests (covered by other unit tests).
});

describe('removeNode(node: XNode): void', () => {
  it('throws if the container is not the parent of the node', () => {
    const node = new XText('Text');
    const container = new XElement(W.t, node);

    // Scenario: external code changes the _parent field.
    node._parent = null;

    expect(() => container.removeNode(node)).toThrow();
  });
});

describe('removeNodes(): void', () => {
  it('removes all nodes', () => {
    const container = new XElement(W.p, new XElement(W.r), new XElement(W.r));
    expect(container.nodes().any()).toBe(true);

    container.removeNodes();

    expect(container.nodes().any()).toBe(false);
  });
});

describe('replaceNodes(...content: any[]): void', () => {
  it('replaces multiple existing child nodes with multiple new nodes', () => {
    const element = new XElement(
      W.p,
      new XElement(W.r, new XElement(W.t, 'a')),
      new XElement(W.r, new XElement(W.t, 'b'))
    );

    expect(element.value).toEqual('ab');

    element.replaceNodes(
      new XElement(W.r, new XElement(W.t, 'c')),
      new XElement(W.r, new XElement(W.t, 'd')),
      new XElement(W.r, new XElement(W.t, 'e'))
    );

    expect(element.value).toEqual('cde');
  });

  it('replaces multiple existing child nodes a single new node', () => {
    const element = new XElement(
      W.p,
      new XElement(W.r, new XElement(W.t, 'a')),
      new XElement(W.r, new XElement(W.t, 'b'))
    );

    expect(element.value).toEqual('ab');

    element.replaceNodes(new XElement(W.r, new XElement(W.t, 'c')));

    expect(element.value).toEqual('c');
  });
});
