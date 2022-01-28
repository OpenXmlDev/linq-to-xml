/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { ArgumentException, XNamespace } from './internal';

/**
 * Represents XML names.
 */
export class XName {
  /**
   * Initializes a new `XName` with the given namespace, local name, and prefix.
   *
   * @param namespace The `XNamespace`.
   * @param localName The local name.
   * @param prefix The prefix.
   */
  constructor(
    public readonly namespace: XNamespace,
    public readonly localName: string,
    public readonly prefix: string | null
  ) {}

  /**
   * Gets the namespace name.
   */
  public get namespaceName(): string {
    return this.namespace.namespaceName;
  }

  /**
   * Gets the `XName` having the given expanded name.
   *
   * @param expandedName The expanded name.
   * @returns A new or existing `XName` instance.
   */
  public static get(expandedName: string): XName;

  /**
   * Gets the `XName` having the given local and namespace name.
   *
   * @param localName
   * @param namespaceName
   */
  public static get(
    localName: string,
    namespaceName: string,
    prefix: string | null
  ): XName;

  // Implementation
  static get(
    expandedOrLocalName: string,
    namespaceName?: string,
    prefix?: string | null
  ): XName {
    if (namespaceName !== undefined && prefix !== undefined) {
      // get(localName: string, namespaceName: string, prefix: string | null): XName
      const localName = expandedOrLocalName;

      return XNamespace.get(namespaceName).getName(prefix, localName);
    } else {
      // get(expandedName: string): XName
      const expandedName = expandedOrLocalName;

      if (expandedName === '') {
        throw new ArgumentException('expandedName', 'Expanded name is empty.');
      }

      if (expandedName[0] !== '{') {
        // Expanded name does not contain "{namespaceName}".
        return XNamespace.none.getName(expandedName);
      }

      const lastIndex = expandedName.lastIndexOf('}');

      if (lastIndex <= 1) {
        // Expanded name does not contain closing braces or starts with "{}".
        throw new ArgumentException(
          'expandedName',
          'Namespace name is malformed.'
        );
      }

      if (lastIndex === expandedName.length - 1) {
        // Expanded name is "{namespaceName}".
        throw new ArgumentException('expandedName', 'Local name is empty.');
      }

      namespaceName = expandedName.substring(1, lastIndex);
      const localName = expandedName.substring(lastIndex + 1);

      return XNamespace.get(namespaceName).getName(localName);
    }
  }

  /**
   * Gets the string representation of this `XName`, i.e., either:
   * - `localName`, if the namespace name is the empty string, or
   * - {`namespaceName`}`localName`, if the namespace name is not empty.
   *
   * @returns The string representation.
   */
  public toString(): string {
    return this.namespace.namespaceName.length === 0
      ? this.localName
      : '{' + this.namespace.namespaceName + '}' + this.localName;
  }
}
