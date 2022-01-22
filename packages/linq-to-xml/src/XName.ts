/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { ArgumentError, XNamespace } from './internal';

export class XName {
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
    if (namespaceName === undefined && prefix === undefined) {
      // get(expandedName: string): XName
      const expandedName = expandedOrLocalName;

      if (expandedName === '') {
        throw new ArgumentError('Expanded name is empty.', 'expandedName');
      }

      if (expandedName[0] !== '{') {
        // Expanded name does not contain "{namespaceName}".
        return XNamespace.none.getName(expandedName);
      }

      const lastIndex = expandedName.lastIndexOf('}');

      if (lastIndex <= 1) {
        // Expanded name does not contain closing braces or starts with "{}".
        throw new ArgumentError('Namespace name is malformed.', 'expandedName');
      }

      if (lastIndex === expandedName.length - 1) {
        // Expanded name is "{namespaceName}".
        throw new ArgumentError('Local name is empty.', 'expandedName');
      }

      namespaceName = expandedName.substring(1, lastIndex);
      const localName = expandedName.substring(lastIndex + 1);

      return XNamespace.get(namespaceName).getName(localName);
    } else if (namespaceName !== undefined && prefix !== undefined) {
      // get(localName: string, namespaceName: string, prefix: string | null): XName
      const localName = expandedOrLocalName;

      return XNamespace.get(namespaceName).getName(prefix, localName);
    }

    throw new Error('Unexpected method call.');
  }

  /**
   * Gets the string representation of this {XName}, i.e., either:
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
