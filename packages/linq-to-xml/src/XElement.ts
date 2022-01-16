/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  ArgumentError,
  DomFactory,
  DomParser,
  DomReader,
  getAncestors,
  getDescendants,
  InvalidOperationError,
  ILinqIterableOfXAttribute,
  ILinqIterableOfXElement,
  LinqIterableOfXAttribute,
  LinqIterableOfXElement,
  StringBuilder,
  XAttribute,
  XContainer,
  XDocument,
  XName,
  XNode,
} from './internal';

/**
 * Represents an XML element.
 */
export class XElement extends XContainer {
  /**
   * Gets an empty collection of elements.
   */
  public static readonly emptySequence: Iterable<XElement> = {
    *[Symbol.iterator](): Iterator<XElement> {
      // Do not return anything.
    },
  };

  /** @internal */
  _name: XName;

  /** @internal */
  _lastAttr: XAttribute | null;

  /**
   * Initializes a new instance of the `XElement` class with the specified name.
   *
   * @param name The name of the element.
   * @param contentArray Zero or more content items.
   */
  public constructor(name: XName, ...contentArray: any[]) {
    super();

    this._name = name;
    this._lastAttr = null;

    for (const contentArrayItem of contentArray) {
      this.addContentSkipNotify(contentArrayItem);
    }
  }

  /**
   * Gets the first attribute of this element.
   */
  public get firstAttribute(): XAttribute | null {
    return this._lastAttr ? this._lastAttr._next : null;
  }

  /**
   * Gets a value indicating whether the element has at least one attribute.
   */
  public get hasAttributes(): boolean {
    return this._lastAttr !== null;
  }

  /**
   * Gets a value indicating whether the element has at least one child element.
   */
  public get hasElements(): boolean {
    if (this._content instanceof XNode) {
      let node: XNode = this._content;
      do {
        if (node instanceof XElement) return true;
        node = node._next!;
      } while (node !== this._content);
    }

    return false;
  }

  /**
   * Gets a value indicating whether the element contains no content.
   */
  public get isEmpty(): boolean {
    return this._content === null;
  }

  /**
   * Gets the last attribute of this element.
   */
  public get lastAttribute(): XAttribute | null {
    return this._lastAttr;
  }

  /**
   * Gets the name of this element.
   */
  public get name(): XName {
    return this._name;
  }

  /**
   * Sets the name of this element.
   */
  public set name(value: XName) {
    this._name = value;
  }

  /**
   * Gets the text contents of this element.
   *
   * If there is text content interspersed with nodes (mixed content) then the
   * text content will be concatenated and returned.
   */
  public get value(): string {
    if (this._content === null) return '';
    if (typeof this._content === 'string') return this._content as string;
    const sb = new StringBuilder();
    this.appendText(sb);
    return sb.toString();
  }

  /**
   * Sets the text content of this element.
   */
  public set value(content: string) {
    this.removeNodes();
    this.add(content);
  }

  /**
   * Returns this `XElement` and all of it's ancestors up to the root node.
   * Optionally an `XName` can be passed in to target a specific ancestor(s).
   *
   * @param name The optional `XName` of the target ancestor.
   * @returns An iterable containing this `XElement` and its ancestors (with
   *          a matching `XName` if `name` was provided).
   */
  public ancestorsAndSelf(name?: XName | null): ILinqIterableOfXElement {
    return name === null
      ? new LinqIterableOfXElement(XElement.emptySequence)
      : new LinqIterableOfXElement(getAncestors(this, name ?? null, true));
  }

  /** @internal */
  override addAttributeSkipNotify(a: XAttribute): void {
    if (this.attribute(a.name)) {
      throw new Error('Invalid operation: duplicate attribute.');
    }

    if (a._parent) {
      a = new XAttribute(a.name, a.value);
    }

    this.appendAttributeSkipNotify(a);
  }

  /** @internal */
  private appendAttributeSkipNotify(a: XAttribute): void {
    a._parent = this;

    if (!this._lastAttr) {
      a._next = a;
    } else {
      a._next = this._lastAttr._next;
      this._lastAttr._next = a;
    }

    this._lastAttr = a;
  }

  /**
   * Returns the `XAttribute` associated with this `XElement` that has this `XName`.
   *
   * @param name The `XName` of the `XAttribute` to get.
   * @returns The `XAttribute` having the given `XName` or `null`.
   */
  public attribute(name: XName): XAttribute | null {
    if (this._lastAttr === null) return null;

    let attr = this._lastAttr;

    do {
      attr = attr._next!;
      if (attr._name === name) {
        return attr;
      }
    } while (attr !== this._lastAttr);

    return null;
  }

  /**
   * Gets all attributes associated with this element or the attribute having
   * the given name.
   *
   * @param name The name of the attribute to return.
   * @returns All attributes associated with this element or the attribute
   *          having the given name.
   */
  public attributes(name?: XName | null): ILinqIterableOfXAttribute {
    return name === null
      ? new LinqIterableOfXAttribute(XAttribute.emptySequence)
      : new LinqIterableOfXAttribute(getAttributes(this, name ?? null));
  }

  /** @internal */
  override cloneNode(): XNode {
    return XElement.copy(this);
  }

  /**
   * Copies the given `XElement`, creating a new `XElement` that does not have a parent.
   *
   * @param other The other `XElement` to copy.
   * @returns The copied `XElement`.
   */
  public static copy(other: XElement): XElement {
    const element = new XElement(other._name);
    element.copyNodes(other);
    element.copyAttributes(other);
    return element;
  }

  /** @internal */
  copyAttributes(other: XElement): void {
    if (!other._lastAttr) {
      return;
    }

    let attr = other._lastAttr;

    do {
      attr = attr._next!;
      this.appendAttributeSkipNotify(new XAttribute(attr._name, attr._value));
    } while (attr !== other._lastAttr);
  }

  /**
   * Gets this `XElement` and the descendant `XElement`s of this `XElement`.
   *
   * @param name The optional name of the descendants to return.
   * @returns This `XElement` and the descendant `XElement`s of this `XElement`.
   */
  public descendantsAndSelf(name?: XName | null): ILinqIterableOfXElement {
    return name === null
      ? new LinqIterableOfXElement(XElement.emptySequence)
      : new LinqIterableOfXElement(getDescendants(this, name ?? null, true));
  }

  /**
   * Loads an `XElement` from the given DOM `Element`.
   *
   * @param element The DOM `Element`.
   * @returns A new `XElement` instance.
   */
  public static load(element: Element): XElement {
    return DomReader.loadXElement(element);
  }

  /**
   * Creates a mew `XElement` instance from the given XML string.
   *
   * @param text The XML string.
   * @returns A new `XElement` instance.
   */
  public static parse(text: string): XElement {
    const element = DomParser.parseElement(text);
    if (!element) throw new ArgumentError('Invalid XML string.', 'text');

    return XElement.load(element);
  }

  /**
   * Removes content and attributes from this `XElement`.
   */
  public removeAll(): void {
    this.removeAttributes();
    this.removeNodes();
  }

  /**
   * Removes that attributes of this `XElement`.
   */
  public removeAttributes(): void {
    this.removeAttributesSkipNotify();
  }

  /** @internal */
  removeAttribute(attr: XAttribute): void {
    if (attr._parent !== this) {
      throw new InvalidOperationError(
        'This operation was corrupted by external code.'
      );
    }

    // Get the previous attribute.
    let previousAttr: XAttribute = this._lastAttr!;
    while (previousAttr._next !== attr) previousAttr = previousAttr._next!;

    if (previousAttr === attr) {
      // The attribute is the only attribute, so we just remove the link.
      this._lastAttr = null;
    } else {
      // The attribute is not the only attribute, so we reroute the links.
      if (this._lastAttr === attr) this._lastAttr = previousAttr;
      previousAttr._next = attr._next;
    }

    attr._parent = null;
    attr._next = null;
  }

  /** @internal */
  private removeAttributesSkipNotify(): void {
    if (this._lastAttr === null) return;

    let attr: XAttribute = this._lastAttr;

    do {
      const next: XAttribute = attr._next!;
      attr._parent = null;
      attr._next = null;
      attr = next;
    } while (attr !== this._lastAttr);

    this._lastAttr = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setAttributeValue(_name: XName, _value: any): void {
    throw new Error('Not implemented.');
  }

  public toString(): string {
    return new XMLSerializer().serializeToString(
      DomFactory.createElement(this)
    );
  }

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override validateNode(node: XNode, _previous: XNode | null): void {
    if (node instanceof XDocument) {
      throw new ArgumentError('Invalid node type: XDocument', 'node');
    }
  }
}

export function* getAttributes(element: XElement, name: XName | null) {
  if (element._lastAttr === null) return;

  let attr = element._lastAttr;

  do {
    attr = attr._next!;
    if (name === null || attr._name === name) {
      yield attr;
    }
  } while (attr._parent === element && attr !== element._lastAttr);
}
