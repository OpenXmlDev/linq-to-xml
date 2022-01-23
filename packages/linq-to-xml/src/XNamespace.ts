/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XName } from './internal';

export class XNamespace {
  private static readonly xmlPrefixNamespaceName =
    'http://www.w3.org/XML/1998/namespace';

  private static readonly xmlnsPrefixNamespaceName =
    'http://www.w3.org/2000/xmlns/';

  private static readonly _none = new XNamespace('', null);

  private static readonly _xml = new XNamespace(
    XNamespace.xmlPrefixNamespaceName,
    'xml'
  );

  private static readonly _xmlns = new XNamespace(
    XNamespace.xmlnsPrefixNamespaceName,
    'xmlns'
  );

  private static readonly namespaces = new Map<string, XNamespace>([
    ['', XNamespace._none],
    [XNamespace.xmlPrefixNamespaceName, XNamespace._xml],
    [XNamespace.xmlnsPrefixNamespaceName, XNamespace._xmlns],
  ]);

  private readonly names = new Map<string, XName>();

  private constructor(
    public readonly namespaceName: string,
    public readonly prefix: string | null
  ) {}

  /**
   * Gets the empty namespace.
   */
  public static get none() {
    return XNamespace._none;
  }

  /**
   * Gets the namespace for the xml prefix.
   */
  public static get xml() {
    return XNamespace._xml;
  }

  /**
   * Gets the namespace for the xmlns prefix.
   */
  public static get xmlns() {
    return XNamespace._xmlns;
  }

  /**
   * Gets the XNamespace for the given namespace name.
   *
   * Notes:
   * - The ability to provide a namespace prefix (e.g., 'w', 'w14') deviates from
   *   Linq to XML and might pose a (theoretical) constraint where a namespace
   *   is used with different prefixes. However, that doesn't happen in our use
   *   case and makes it easier to process documents.
   * - Where namespaces are used with different prefixes, An alternative would be
   *   to add the prefix to the `XName`.
   *
   * @param namespaceName The namespace name, e.g., 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'.
   * @param prefix The (default) prefix, e.g., 'w'.
   * @returns The XNamespace.
   */
  public static get(namespaceName: string, prefix?: string | null): XNamespace {
    let namespace = XNamespace.namespaces.get(namespaceName);

    if (!namespace) {
      namespace = new XNamespace(namespaceName, prefix ?? null);
      XNamespace.namespaces.set(namespaceName, namespace);
    }

    return namespace;
  }

  /**
   * Gets the `XName` for the given local name, e.g., `body`, `id`.
   *
   * @param localName The local name, e.g., `body`.
   */
  public getName(localName: string): XName;

  /**
   * Gets the `XName` for the given prefix and local name, e.g., `w:body`, `r:id`.
   *
   * @param prefix The prefix, e.g., `w`, `r`.
   * @param localName The local name, e.g., `body`, `id`.
   */
  public getName(prefix: string | null, localName: string): XName;

  // Implementation
  getName(first: string | null, second?: string): XName {
    let prefix: string | null;
    let localName: string;

    if (second === undefined) {
      // getName(localName: string): XName
      prefix = this.prefix;
      localName = first as string;
    } else {
      // getName(prefix: string | null, localName: string): XName
      prefix = first;
      localName = second;
    }

    // We'll include the prefix (e.g., "w", "w14"), if any, in the key.
    const key = prefix ? `${prefix}:${localName}` : localName;
    let name = this.names.get(key);

    if (!name) {
      name = new XName(this, localName, prefix ?? null);
      this.names.set(key, name);
    }

    return name;
  }

  /**
   * Gets the string representation of this XNamespace.
   *
   * @returns The string representation of this XNamespace.
   */
  public toString(): string {
    return this.namespaceName;
  }
}
