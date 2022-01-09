/**
 * @author Thomas Barnekow
 * @license MIT
 */

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
   */
  public static parseDocument(text: string): XMLDocument {
    const parser = new DOMParser();
    return parser.parseFromString(text, 'application/xml');
  }

  /**
   * Parses the given XML string.
   *
   * @param text The XML string.
   * @returns The parsed `Element` or `null`, if no root element exists.
   */
  public static parseElement(text: string): Element | null {
    const document = DomParser.parseDocument(text);
    return document.firstElementChild;
  }
}
