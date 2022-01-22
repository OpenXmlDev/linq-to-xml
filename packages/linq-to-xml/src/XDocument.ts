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
    const xmlDocument = DomParser.parseDocument(text);
    return XDocument.load(xmlDocument);
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
    const serializedString = new XMLSerializer().serializeToString(
      DomFactory.createDocument(this)
    );

    return this._declaration
      ? this._declaration.toString() + serializedString
      : serializedString;
  }
}
