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
  XNamespace,
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
  public constructor(name: XName | string, value: Stringifyable) {
    super();

    const xname = name instanceof XName ? name : XName.get(name);
    const stringValue = XContainer.getStringValue(value);

    XAttribute.validateAttribute(xname, stringValue);
    this._name = xname;
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
   * Gets a value indicating if this attribute is a namespace declaration.
   */
  public get isNamespaceDeclaration(): boolean {
    const namespaceName = this._name.namespaceName;

    // Deal with xmlns="namespaceName".
    if (namespaceName.length === 0) {
      return this._name.localName === 'xmlns';
    }

    // Deal with xmlns:prefix="namespaceName".
    return namespaceName === XNamespace.xmlnsPrefixNamespaceName;
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

  /** @internal */
  getPrefixOfNamespace(ns: XNamespace): string | null {
    const namespaceName = ns.namespaceName;
    if (namespaceName.length == 0) return '';
    if (this._parent !== null) {
      return (this._parent as XElement).getPrefixOfNamespace(ns);
    }

    if (namespaceName === XNamespace.xmlPrefixNamespaceName) return 'xml';
    if (namespaceName === XNamespace.xmlnsPrefixNamespaceName) return 'xmlns';
    return null;
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
    const name = this._name;
    const prefix = this.getPrefixOfNamespace(name.namespace);
    const qualifiedName = prefix
      ? `${prefix}:${name.localName}`
      : name.localName;

    const value = this.transformXmlEntities(this._value);
    return `${qualifiedName}="${value}"`;
  }

  /** @internal */
  private transformXmlEntities(value: string): string {
    let transformedValue = '';

    for (let index = 0; index < value.length; index++) {
      const code = value.charCodeAt(index);
      if (code === 34) {
        transformedValue += '&quot;';
      } else if (code === 38) {
        transformedValue += '&amp;';
      } else if (code === 60) {
        transformedValue += '&lt;';
      } else if (code === 62) {
        transformedValue += '&gt;';
      } else {
        transformedValue += value.charAt(index);
      }
    }

    return transformedValue;
  }
}
