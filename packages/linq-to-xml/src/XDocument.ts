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
  XNode,
} from './internal';

/**
 * Represents an XML document.
 */
export class XDocument extends XContainer {
  private _declaration: XDeclaration | null;

  constructor(declaration: XDeclaration | null, ...contentArray: any[]);
  constructor(...contentArray: any[]);
  constructor();

  constructor(declaration?: XDeclaration | null, ...contentArray: any[]) {
    super();

    this._declaration = declaration ?? null;

    for (const contentArrayItem of contentArray) {
      this.addContentSkipNotify(contentArrayItem);
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

  /** @internal */
  override cloneNode(): XNode {
    const clone = new XDocument(this._declaration);
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
