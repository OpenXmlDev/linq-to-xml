/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XContainer, XDocument, XElement } from './internal.js';

/**
 * Represents a node or an attribute in an XML tree.
 */
export abstract class XObject {
  /** @internal */
  _parent: XContainer | null = null;

  /**
   * Gets the `XDocument` object for this `XObject`.
   */
  public get document(): XDocument | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let object: XObject = this;
    while (object._parent) object = object._parent;

    return object instanceof XDocument ? (object as XDocument) : null;
  }

  /**
   * Gets the parent `XElement` of this `XObject`.
   */
  public get parent(): XElement | null {
    return this._parent instanceof XElement ? (this._parent as XElement) : null;
  }

  /**
   * Returns a string that represents the current object.
   *
   * @returns A string that represents the current object.
   */
  public abstract toString(): string;
}
