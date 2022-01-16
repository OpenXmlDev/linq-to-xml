/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  ArgumentError,
  InvalidOperationError,
  ILinqIterableOfXElement,
  ILinqIterableOfXNode,
  LinqIterableOfXElement,
  LinqIterableOfXNode,
  StringBuilder,
  XAttribute,
  XElement,
  XName,
  XNode,
  XText,
} from './internal';

/**
 * Represents a node that can contain other nodes.
 * The two classes that derive from {XContainer} are {XDocument} and {XElement}.
 */
export abstract class XContainer extends XNode {
  /** @internal */
  _content: XNode | string | null = null;

  protected constructor() {
    super();
  }

  /**
   * Gets this container's first `XNode` or `null`, if this container does not
   * have any nodes.
   */
  public get firstNode(): XNode | null {
    const last = this.lastNode;
    return last ? last._next : null;
  }

  /**
   * Gets this container's last `XNode` or `null`, if this container does not
   * have any nodes.
   */
  public get lastNode(): XNode | null {
    if (!this._content) {
      return null;
    }

    if (this._content instanceof XNode) {
      return this._content;
    }

    const stringContent: string = this._content;

    if (stringContent.length === 0) {
      return null;
    }

    const textNodeContent = new XText(stringContent);
    textNodeContent._parent = this;
    textNodeContent._next = textNodeContent;
    this._content = textNodeContent;

    return this._content;
  }

  /**
   * Adds the specified content as a child (or children) of this `XContainer`.
   *
   * @param content A content object containing simple content or a collection
   * of content objects to be added.
   */
  public add(content: any): void {
    this.addContentSkipNotify(content);
  }

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAttributeSkipNotify(_a: XAttribute): void {
    // No op
  }

  /** @internal */
  addContentSkipNotify(content: any): void {
    if (content === undefined || content === null || content === '') {
      // Content is undefined, null, or the empty string.
      return;
    }

    // At this point, content is neither null nor undefined nor empty.

    if (content instanceof XNode) {
      this.addNodeSkipNotify(content);
    } else if (typeof content === 'string') {
      this.addStringSkipNotify(content);
    } else if (content instanceof XAttribute) {
      this.addAttributeSkipNotify(content);
    } else if (typeof content[Symbol.iterator] === 'function') {
      // Content is iterable (and not a string, which we already considered above).
      for (const item of content) {
        this.addContentSkipNotify(item);
      }
    } else {
      // Add the string representation for any other type of object.
      this.addStringSkipNotify(XContainer.getStringValue(content));
    }
  }

  /** @internal */
  addNodeSkipNotify(node: XNode): void {
    this.validateNode(node, this);

    // Clone the node if it is:
    // - associated with another parent or
    // - the root node (which does not have a parent).
    if (node._parent) {
      node = node.cloneNode();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let parent: XNode = this;
      while (parent._parent) parent = parent._parent;
      if (node === parent) node = node.cloneNode();
    }

    this.convertTextToNode();
    this.appendNodeSkipNotify(node);
  }

  /** @internal */
  addStringSkipNotify(s: string): void {
    this.validateString(s);

    if (!this._content) {
      this._content = s;
    } else if (s.length > 0) {
      if (typeof this._content === 'string') {
        this._content += s;
      } else if (this._content instanceof XText) {
        // We don't have an XCData class, so we don't check for that here.
        this._content._text += s;
      } else {
        this.appendNodeSkipNotify(new XText(s));
      }
    }
  }

  /** @internal */
  appendNodeSkipNotify(node: XNode): void {
    node._parent = this;

    if (this._content === null || typeof this._content === 'string') {
      node._next = node;
    } else {
      const lastNode = this._content as XNode;
      node._next = lastNode._next;
      lastNode._next = node;
    }

    this._content = node;
  }

  /** @internal */
  override appendText(sb: StringBuilder): void {
    if (typeof this._content === 'string') {
      sb.append(this._content as string);
    } else if (this._content instanceof XNode) {
      let node: XNode = this._content;
      do {
        node = node._next!;
        node.appendText(sb);
      } while (node !== this._content);
    }
  }

  /** @internal */
  convertTextToNode(): void {
    if (typeof this._content === 'string' && this._content.length > 0) {
      const textNode = new XText(this._content);
      textNode._parent = this;
      textNode._next = textNode;
      this._content = textNode;
    }
  }

  /** @internal */
  copyNodes(other: XContainer): void {
    if (typeof other._content === 'string') {
      this._content = other._content;
    } else if (other._content instanceof XNode) {
      // other._content points to the last child XNode.
      let node: XNode = other._content;

      do {
        // In the first iteration, the following assignment sets node to the
        // first child XNode.
        node = node._next!;
        this.appendNodeSkipNotify(node.cloneNode());
      } while (node !== other._content);
    }
  }

  /**
   * Gets the descendant `XElement`s of this `XContainer`.
   *
   * @param name The optional name of the descendants to return.
   * @returns The descendant `XElement`s of this `XContainer`.
   */
  public descendants(name?: XName | null): ILinqIterableOfXElement {
    return name === null
      ? new LinqIterableOfXElement(XElement.emptySequence)
      : new LinqIterableOfXElement(getDescendants(this, name ?? null, false));
  }

  public element(name: XName): XElement | null {
    if (this._content instanceof XNode) {
      let node = this._content;

      do {
        node = node._next!;

        if (node instanceof XElement && node._name == name) {
          return node as XElement;
        }
      } while (node !== this._content);
    }

    return null;
  }

  /**
   * Gets the child `XElement`s of this `XContainer`.
   *
   * @param name The optional name of the elements to return.
   * @returns The child `XElement`s of this `XContainer`.
   */
  public elements(name?: XName | null): ILinqIterableOfXElement {
    return name === null
      ? new LinqIterableOfXElement(XElement.emptySequence)
      : new LinqIterableOfXElement(getElements(this, name ?? null, false));
  }

  /** @internal */
  static getStringValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return value.toString(10);
    } else if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    } else if (value instanceof Date) {
      return value.toISOString();
    } else {
      console.log('UNSUPPORTED TYPE');
      console.log(value);
      throw new ArgumentError(
        `Type is not supported: "${typeof value}"`,
        'value'
      );
    }
  }

  /**
   * Returns the content of this `XContainer`.
   * Note that the content does not include `XAttribute`s.
   *
   * @returns The content of this `XContainer` as an `IterableOfXNode`.
   */
  public nodes(): ILinqIterableOfXNode {
    return new LinqIterableOfXNode(getNodes(this));
  }

  /** @internal */
  removeNode(node: XNode): void {
    if (node._parent !== this) {
      throw new InvalidOperationError(
        'This operation was corrupted by external code.'
      );
    }

    // Get previous node.
    // Debug.Assert(content != null);
    let previousNode = this._content as XNode;
    while (previousNode._next !== node) previousNode = previousNode._next!;

    if (previousNode === node) {
      // node is the only node.
      this._content = null;
    } else {
      if (this._content === node) {
        // n is the last node.
        this._content = previousNode;
      }

      previousNode._next = node._next;
    }

    node._parent = null;
    node._next = null;
  }

  /**
   *  Removes the nodes from this `XContainer`.
   *  Note that this method does not remove the attributes.
   */
  public removeNodes(): void {
    this.removeNodesSkipNotify();
  }

  private removeNodesSkipNotify(): void {
    if (this._content instanceof XNode) {
      let node: XNode = this._content;

      do {
        const next: XNode = node._next!;
        node._parent = null;
        node._next = null;
        node = next;
      } while (node !== this._content);
    }

    this._content = null;
  }

  /**
   * Replaces the child nodes of this `XContainer` with the specified content.
   * The content can be simple content, a collection of content objects, a param
   * list of content objects, or null.
   *
   * @param content The new content.
   */
  public replaceNodes(...content: any[]): void {
    let newContent = content.length === 1 ? content[0] : content;
    newContent = XContainer.getContentSnapshot(newContent);

    this.removeNodes();
    this.add(newContent);
  }

  /**
   * Validate insertion of the given node.
   * previous === null means at beginning.
   * previous === this means at end.
   *
   * @param _node The node to be inserted.
   * @param _previous The node after which insertion will occur
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateNode(_node: XNode, _previous: XNode | null): void {
    // No op.
  }

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateString(_s: string): void {
    // No op.
  }

  /** @internal */
  static getContentSnapshot(content: any): any {
    if (!this.isIterable(content)) return content;

    const list: any[] = [];
    this.addContentToList(list, content);
    return list;
  }

  /** @internal */
  private static addContentToList(list: any[], content: any): void {
    if (!this.isIterable(content)) {
      list.push(content);
    } else {
      for (const item of content as Iterable<any>) {
        if (item != null) this.addContentToList(list, item);
      }
    }
  }

  /** @internal */
  private static isIterable(content: any): boolean {
    return (
      typeof content !== 'string' &&
      typeof content[Symbol.iterator] === 'function'
    );
  }
}

/** @internal */
export function* getDescendants(
  container: XContainer,
  name: XName | null,
  self: boolean
) {
  if (self) {
    if (container instanceof XElement) {
      if (name === null || container.name === name) yield container;
    }
  }

  let n: XNode = container;
  let c: XContainer | null = container;

  while (true) {
    if (c !== null && c._content instanceof XNode) {
      // The current container is the root container or the last-visited
      // element. Thus, move to the current container's first child node.
      n = c._content._next!;
    } else {
      // Move back up the parent hierarchy as long as the current node is
      // not the root container but a last child node.
      while (n !== container && n === n._parent!._content) n = n._parent!;
      if (n === container) break;

      // The current node has been visited already and is not a last child
      // node. Thus, move to the current node's next sibling.
      n = n._next!;
    }

    // Emit the current node, if it is an element.
    const e = n instanceof XElement ? n : null;
    if (e !== null && (name === null || e._name === name)) yield e;

    // The current element, if any, becomes the next container, the child
    // elements of which will be traversed next.
    c = e;
  }
}

/** @internal */
export function* getElements(
  container: XContainer,
  name: XName | null,
  self: boolean
) {
  if (self) {
    if (container instanceof XElement) {
      if (name === null || container.name === name) yield container;
    }
  }

  let n: XNode = container;
  let c: XContainer | null = container;

  while (true) {
    if (c !== null && c._content instanceof XNode) {
      // The current container is the root container or the last-visited
      // element. Thus, move to the current container's first child node.
      n = c._content._next!;
    } else {
      // Move back up the parent hierarchy as long as the current node is
      // not the root container but a last child node.
      while (n !== container && n === n._parent!._content) n = n._parent!;
      if (n === container) break;

      // The current node has been visited already and is not a last child
      // node. Thus, move to the current node's next sibling.
      n = n._next!;
    }

    // Emit the current node, if it is an element.
    const e = n instanceof XElement ? n : null;
    if (e !== null && (name === null || e._name === name)) yield e;

    // The current element, if any, becomes the next container, the child
    // elements of which will be traversed next.
    c = e;
  }
}

/** @internal */
export function* getNodes(container: XContainer) {
  // Getting container.lastNode will convert string content into XNode content
  // if required.
  let node: XNode | null = container.lastNode;

  if (node) {
    do {
      node = node._next!;
      yield node;
    } while (node._parent === container && node !== container._content);
  }
}
