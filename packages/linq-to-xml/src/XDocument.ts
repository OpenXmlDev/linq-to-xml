/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  DomFactory,
  DomParser,
  DomReader,
  XContainer,
  XDeclaration,
  XElement,
  XNode,
} from './internal';

/**
 * Represents an XML document.
 */
export class XDocument extends XContainer {
  private _declaration: XDeclaration | null;

  constructor(declaration: XDeclaration | null, ...contentArray: any[]);
  constructor(...contentArray: any[]);

  constructor(...contentArray: any[]) {
    super();

    this._declaration = null;

    for (const contentArrayItem of contentArray) {
      if (contentArrayItem instanceof XDeclaration) {
        this._declaration = contentArrayItem;
      } else {
        this.addContentSkipNotify(contentArrayItem);
      }
    }
  }

  public static load(xmlDocument: XMLDocument): XDocument {
    return DomReader.loadXDocument(xmlDocument);
  }

  public static parse(text: string): XDocument {
    const [preprocessedText, declaration] = this.preprocess(text);

    const xmlDocument = DomParser.parseDocument(preprocessedText);
    const xDocument = XDocument.load(xmlDocument);
    xDocument.declaration = declaration;

    return xDocument;
  }

  private static preprocess(text: string): [string, XDeclaration | null] {
    const regex =
      /^\s*<\?xml\s+version="(?<version>[0-9.]+)"(\s+encoding="(?<encoding>[a-zA-Z0-9-]+)")?(\s+standalone="(?<standalone>yes|no)")?\s*\?>/;

    const match = text.match(regex);
    if (!match || !match.groups) return [text, null];

    const preprocessedText = text.slice(match[0].length);
    const declaration = new XDeclaration(
      match.groups['version'],
      match.groups['encoding'],
      match.groups['standalone']
    );

    return [preprocessedText, declaration];
  }

  public get declaration(): XDeclaration | null {
    return this._declaration;
  }

  public set declaration(value: XDeclaration | null) {
    this._declaration = value;
  }

  public get root(): XElement | null {
    return this.firstNode instanceof XElement ? this.firstNode : null;
  }

  /** @internal */
  override cloneNode(): XNode {
    const clone = new XDocument();

    clone.declaration =
      this._declaration !== null
        ? new XDeclaration(
            this._declaration.version,
            this._declaration.encoding,
            this._declaration.standalone
          )
        : null;

    clone.copyNodes(this);
    return clone;
  }

  public toString(): string {
    return new XMLSerializer().serializeToString(
      DomFactory.createDocument(this)
    );
  }
}
