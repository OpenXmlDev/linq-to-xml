/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  Inserter,
  InvalidOperationException,
  LinqElements,
  StringBuilder,
  XContainer,
  XElement,
  XName,
  XObject,
} from './internal.js';

/**
 * Represents an XML node.
 */
export abstract class XNode extends XObject {
  /** @internal */
  _next: XNode | null = null;

  protected constructor() {
    super();
  }

  /**
   * Gets the next sibling node of this node.
   *
   * If this node does not have a parent, or if there is no next node,
   * then this property returns null.
   */
  public get nextNode(): XNode | null {
    return this._parent === null || this._parent._content === this
      ? null
      : this._next;
  }

  /**
   * Gets the previous sibling node of this node.
   *
   * If this property does not have a parent, or if there is no previous node,
   * then this property returns null.
   */
  public get previousNode(): XNode | null {
    if (this._parent === null) return null;

    // At this point, we know that the parent XContainer has XNode content.
    // We start with p being null and n being the first node.
    let previousNode: XNode | null = null;
    let nextNode: XNode = (this._parent._content as XNode)._next!;

    while (nextNode !== this) {
      previousNode = nextNode;
      nextNode = nextNode._next!;
    }

    return previousNode;
  }

  /**
   * Returns the collection of the ancestor elements for this node.
   *
   * @param name The optional name of the ancestor elements to find.
   * @returns The ancestor elements of this node.
   */
  public ancestors(name?: XName | null): LinqElements {
    return name === null
      ? new LinqElements(XElement.emptySequence)
      : new LinqElements(getAncestors(this, name ?? null, false));
  }

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appendText(_sb: StringBuilder) {
    // No operation
  }

  /** @internal */
  abstract cloneNode(): XNode;

  /**
   * Removes this `XNode` from the underlying XML tree.
   */
  public remove(): void {
    this.getParentXContainerOrThrow().removeNode(this);
  }

  /**
   * Replaces this node with the specified content.
   *
   * @param content Content that replaces this node.
   */
  public replaceWith(...content: any[]): void {
    const parent = this.getParentXContainerOrThrow();

    // Get the previous sibling node as the anchor for inserting the replacement
    // content. That anchor will be null if the this node is the parent's only
    // child node.
    let previousNode: XNode | null = parent._content as XNode;
    while (previousNode._next !== this) previousNode = previousNode._next!;
    if (previousNode === parent._content) previousNode = null;

    parent.removeNode(this);

    if (previousNode !== null && previousNode._parent !== parent) {
      throw new InvalidOperationException(
        'This operation was corrupted by external code.'
      );
    }

    if (content.length > 0) {
      // Add the replacement content after the previous (anchor) node.
      new Inserter(parent, previousNode).add(
        content.length === 1 ? content[0] : content
      );
    }
  }

  private getParentXContainerOrThrow(): XContainer {
    if (this._parent === null) {
      throw new InvalidOperationException('The parent is missing.');
    }

    return this._parent;
  }
}

/** @internal */
export function* getAncestors(node: XNode, name: XName | null, self: boolean) {
  let e = (self ? node : node._parent) as XElement | null;
  while (e !== null) {
    if (name === null || e._name === name) yield e;
    e = e._parent as XElement | null;
  }
}
