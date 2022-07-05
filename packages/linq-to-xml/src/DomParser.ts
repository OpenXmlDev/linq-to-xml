/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { ArgumentException } from './internal.js';

/**
 * Utility class for parsing strings into DOM `XMLDocument` or `Element` instances.
 *
 * @internal
 */
export class DomParser {
  /**
   * Parses the given XML string.
   *
   * @param text The XML string.
   * @returns The parsed `XMLDocument`.
   * @throws An `ArgumentException` if the XML is malformed or does not contain
   *         a root element.
   */
  public static parseDocument(text: string): XMLDocument {
    const document = new DOMParser().parseFromString(text, 'application/xml');

    const parsererror = document.querySelector('parsererror');
    if (parsererror) {
      // At this point, the XML is malformed or the document does not contain a
      // root Element.
      const message = `Error parsing XML: ${parsererror.textContent}`;
      throw new ArgumentException('text', message);
    }

    // At this point, the document will be well-formed and contain a root Element.
    return document;
  }

  /**
   * Parses the given XML string.
   *
   * @param text The XML string.
   * @returns The parsed `Element` or `null`, if no root element exists.
   * @throws An `ArgumentException` if the XML is malformed or does not contain
   *         a root element.
   */
  public static parseElement(text: string): Element {
    const document = DomParser.parseDocument(text);

    // An XMLDocument created by the DOMParser().parseFromString() method must
    // have a root Element. If that does not exist, our DomParser.parseDocument()
    // method will throw an ArgumentError.
    return document.firstElementChild!;
  }
}
