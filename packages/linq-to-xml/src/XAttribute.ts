/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  InvalidOperationException,
  Stringifyable,
  XObject,
  XContainer,
  XElement,
  XName,
} from './internal';

/**
 * Represents an XML attribute.
 */
export class XAttribute extends XObject {
  /** @internal */
  _name: XName;

  /** @internal */
  _value: string;

  /** @internal */
  _next: XAttribute | null;

  /**
   * Initializes a new instance of the {XAttribute} class.
   *
   * @param name The name of the attribute.
   * @param value The value of the attribute.
   */
  public constructor(name: XName, value: Stringifyable) {
    super();

    const stringValue = XContainer.getStringValue(value);
    XAttribute.validateAttribute(name, stringValue);

    this._name = name;
    this._value = stringValue;
    this._next = null;
  }

  /**
   * Gets an empty collection of attributes.
   */
  public static readonly emptySequence: Iterable<XAttribute> = {
    *[Symbol.iterator](): Iterator<XAttribute> {
      // Do not return anything.
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static validateAttribute(_name: XName, _value: string): void {
    // TODO: Implement.
  }

  /**
   * Gets the name of this attribute.
   */
  public get name(): XName {
    return this._name;
  }

  /**
   * Gets the next attribute of the parent element.
   */
  public get nextAttribute(): XAttribute | null {
    return this._parent instanceof XElement &&
      this._parent.lastAttribute !== this
      ? this._next
      : null;
  }

  /**
   * Gets the value of this attribute.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Sets the value of this attribute.
   */
  public set value(value: string) {
    XAttribute.validateAttribute(this._name, value);
    this._value = value;
  }

  /**
   * Removes this attribute from its parent.
   */
  public remove(): void {
    if (this._parent === null) {
      throw new InvalidOperationException('The parent is missing.');
    }

    (this._parent as XElement).removeAttribute(this);
  }

  /**
   * Gets the XML text representation of an attribute and its value.
   *
   * @returns The XML text representation of an attribute and its value.
   */
  public toString(): string {
    const name =
      this._name.prefix !== null
        ? `${this._name.prefix}:${this._name.localName}`
        : this._name.localName;

    return `${name}="${this._value}"`;
  }
}
