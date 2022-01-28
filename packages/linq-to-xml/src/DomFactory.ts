/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  ArgumentException,
  XAttribute,
  XDeclaration,
  XDocument,
  XElement,
  XName,
  XNamespace,
  XNode,
  XProcessingInstruction,
  XText,
} from './internal';

/**
 * Transforms Linq-to-XML into DOM documents or elements, i.e.:
 * - `XDocument` into `XMLDocument` and
 * - `XElement` into `Element`.
 *
 * @internal
 */
export class DomFactory {
  private xmlDocument: XMLDocument;

  private constructor() {
    this.xmlDocument = document.implementation.createDocument(null, null);
  }

  /**
   * Creates a DOM `XMLDocument` from the given `XDocument`.
   *
   * @param xdocument The `XDocument`.
   * @returns A new `XMLDocument`.
   */
  public static createDocument(xdocument: XDocument): XMLDocument {
    return new DomFactory().createDocument(xdocument);
  }

  /**
   * Creates a DOM `Element` from the given `XElement`.
   *
   * @param xelement The `XElement`.
   * @returns a new `Element`.
   */
  public static createElement(xelement: XElement): Element {
    return new DomFactory().createElement(xelement);
  }

  private createDocument(xdocument: XDocument): XMLDocument {
    if (xdocument.declaration !== null) {
      this.addDeclaration(xdocument.declaration);
    }

    for (const childXNode of xdocument.nodes()) {
      this.xmlDocument.appendChild(this.createNode(childXNode));
    }

    return this.xmlDocument;
  }

  private addDeclaration(declaration: XDeclaration) {
    let data = '';

    if (declaration.version) {
      data += ` version="${declaration.version}"`;
    }

    if (declaration.encoding) {
      data += ` encoding="${declaration.encoding}"`;
    }

    if (declaration.standalone) {
      data += ` standalone="${declaration.standalone}"`;
    }

    this.xmlDocument.appendChild(
      this.xmlDocument.createProcessingInstruction('xml', data.trimStart())
    );
  }

  private createElement(xelement: XElement): Element {
    const element = this.constructElement(xelement);

    for (const xattribute of xelement.attributes()) {
      this.setAttribute(element, xattribute);
    }

    for (const childXNode of xelement.nodes()) {
      element.appendChild(this.createNode(childXNode));
    }

    return element;
  }

  private constructElement(xelement: XElement): Element {
    return xelement.name.namespace === XNamespace.none
      ? this.xmlDocument.createElement(xelement.name.localName)
      : this.xmlDocument.createElementNS(
          xelement.name.namespaceName,
          this.getQualifiedName(xelement.name)
        );
  }

  private setAttribute(element: Element, xattribute: XAttribute): void {
    if (xattribute.name.namespace === XNamespace.none) {
      element.setAttribute(xattribute.name.localName, xattribute.value);
    } else {
      element.setAttributeNS(
        xattribute.name.namespaceName,
        this.getQualifiedName(xattribute.name),
        xattribute.value
      );
    }
  }

  private createNode(xnode: XNode): Node {
    if (xnode instanceof XElement) {
      return this.createElement(xnode as XElement);
    } else if (xnode instanceof XText) {
      return this.xmlDocument.createTextNode(xnode._text);
    } else if (xnode instanceof XProcessingInstruction) {
      return this.xmlDocument.createProcessingInstruction(
        xnode.target,
        xnode.data
      );
    } else {
      throw new ArgumentException('xnode', 'Unexpected kind of XNode');
    }
  }

  private getQualifiedName(name: XName): string {
    return name.prefix ? `${name.prefix}:${name.localName}` : name.localName;
  }
}
