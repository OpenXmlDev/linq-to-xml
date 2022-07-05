/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XName } from './internal.js';

/**
 * Represents XML namespaces.
 */
export class XNamespace {
  /** @internal */
  static readonly xmlPrefixNamespaceName =
    'http://www.w3.org/XML/1998/namespace';

  /** @internal */
  static readonly xmlnsPrefixNamespaceName = 'http://www.w3.org/2000/xmlns/';

  private static readonly _none = new XNamespace('');

  private static readonly _xml = new XNamespace(
    XNamespace.xmlPrefixNamespaceName
  );

  private static readonly _xmlns = new XNamespace(
    XNamespace.xmlnsPrefixNamespaceName
  );

  private static readonly namespaces = new Map<string, XNamespace>([
    ['', XNamespace._none],
    [XNamespace.xmlPrefixNamespaceName, XNamespace._xml],
    [XNamespace.xmlnsPrefixNamespaceName, XNamespace._xmlns],
  ]);

  private readonly names = new Map<string, XName>();

  private constructor(public readonly namespaceName: string) {}

  /**
   * Gets the empty namespace.
   */
  public static get none() {
    return XNamespace._none;
  }

  /**
   * Gets the namespace for the `xml` prefix.
   */
  public static get xml() {
    return XNamespace._xml;
  }

  /**
   * Gets the namespace for the `xmlns` prefix.
   */
  public static get xmlns() {
    return XNamespace._xmlns;
  }

  /**
   * Gets the `XNamespace` for the given namespace name.
   *
   * @param namespaceName The namespace name, e.g., 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'.
   * @returns The `XNamespace`.
   */
  public static get(namespaceName: string): XNamespace {
    let namespace = XNamespace.namespaces.get(namespaceName);

    if (!namespace) {
      namespace = new XNamespace(namespaceName);
      XNamespace.namespaces.set(namespaceName, namespace);
    }

    return namespace;
  }

  /**
   * Gets the `XName` for the given local name, e.g., `body`, `id`.
   *
   * @param localName The local name, e.g., `body`.
   */
  public getName(localName: string): XName {
    let name = this.names.get(localName);

    if (!name) {
      name = new XName(this, localName);
      this.names.set(localName, name);
    }

    return name;
  }

  /**
   * Gets the string representation of this `XNamespace`.
   *
   * @returns The string representation of this `XNamespace`.
   */
  public toString(): string {
    return this.namespaceName;
  }
}
