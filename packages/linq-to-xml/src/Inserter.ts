/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  ArgumentError,
  XAttribute,
  XContainer,
  XNode,
  XText,
} from './internal';

/**
 * Provides tools for inserting content into `XContainer`s.
 *
 * @internal
 */
export class Inserter {
  private readonly _parent: XContainer;
  private _previous: XNode | null;
  private _text: string | null;

  /**
   * Initializes a new instance with the parent `XContainer` and either
   * - the anchor `XNode` after which content is to be added or
   * - `null` if content is to be prepended before the first node.
   *
   * @param parent The parent `XContainer` to which the content is added.
   * @param anchor The anchor `XNode` after which content is added or `null`.
   */
  public constructor(parent: XContainer, anchor: XNode | null) {
    this._parent = parent;
    this._previous = anchor;
    this._text = null;
  }

  /**
   * Adds the given content to the parent `XContainer`.
   *
   * @param content The content to be added.
   */
  public add(content: any): void {
    this.addContent(content);

    if (this._text === null) return;

    if (this._parent._content === null) {
      this._parent._content = this._text;
    } else {
      if (this._previous instanceof XText) {
        this._previous.value += this._text;
      } else if (this._text.length > 0) {
        this._parent.convertTextToNode();
        this.insertNode(new XText(this._text));
      }
    }
  }

  private addContent(content: any): void {
    if (content == null) return;

    if (content instanceof XNode) {
      this.addNode(content);
    } else if (typeof content === 'string') {
      this.addString(content);
    } else if (typeof content[Symbol.iterator] === 'function') {
      for (const item of content) {
        this.addContent(item);
      }
    } else if (content instanceof XAttribute) {
      throw new ArgumentError('An attribute cannot be added to content.');
    } else {
      this.addString(XContainer.getStringValue(content));
    }
  }

  private addNode(node: XNode): void {
    this._parent.validateNode(node, this._previous);

    // Create a deep clone of the node if necessary.
    if (node._parent !== null) {
      node = node.cloneNode();
    } else {
      let parent: XContainer | null = this._parent;
      while (parent._parent !== null) parent = parent._parent;
      if (node === parent) node = node.cloneNode();
    }

    // Ensure the future parent's string content, if any, is turned into an
    // XText node so that we can add further XNode siblings.
    this._parent.convertTextToNode();

    // Before adding the node, "consume" any text content we assembled so far,
    // inserting an XText node with such text content.
    if (this._text !== null && this._text.length > 0) {
      if (this._previous instanceof XText) {
        this._previous.value += this._text;
      } else {
        this.insertNode(new XText(this._text));
      }

      this._text = null;
    }

    // Finally, insert the node, which does not have a parent at this point.
    this.insertNode(node);
  }

  private addString(s: string): void {
    this._parent.validateString(s);
    this._text = this._text === null ? s : this._text + s;
  }

  // Prepends if previous == null, otherwise inserts after previous
  private insertNode(node: XNode): void {
    node._parent = this._parent;

    if (
      this._parent._content === null ||
      typeof this._parent._content === 'string'
    ) {
      // Insert node as only node.
      node._next = node;
      this._parent._content = node;
    } else if (this._previous === null) {
      // Insert node as first node.
      const last = this._parent._content as XNode;
      node._next = last._next;
      last._next = node;
    } else {
      // Insert node after this._previous, considering whether this._previous
      // was the last node (this._parent._content). If so, make the node the
      // new last node.
      node._next = this._previous._next;
      this._previous._next = node;
      if (this._parent._content === this._previous)
        this._parent._content = node;
    }

    // Insert further nodes after the node we just inserted.
    this._previous = node;
  }
}
