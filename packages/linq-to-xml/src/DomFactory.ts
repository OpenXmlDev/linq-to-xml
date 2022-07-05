/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  ArgumentException,
  NamespaceResolver,
  XAttribute,
  XDeclaration,
  XDocument,
  XElement,
  XNamespace,
  XNode,
  XProcessingInstruction,
  XText,
} from './internal.js';

/**
 * Transforms Linq-to-XML into DOM documents or elements, i.e.:
 * - `XDocument` into `XMLDocument` and
 * - `XElement` into `Element`.
 *
 * @internal
 */
export class DomFactory {
  private xmlDocument: XMLDocument;
  private resolver: NamespaceResolver;

  private constructor() {
    this.xmlDocument = document.implementation.createDocument(null, null);
    this.resolver = new NamespaceResolver();
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
   * @returns A new `Element`.
   */
  public static createElement(xelement: XElement): Element {
    const domFactory = new DomFactory();
    domFactory.pushAncestors(xelement);
    return domFactory.createElement(xelement);
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
    // Register the namespaces declared by the element.
    this.pushElement(xelement);

    const element = this.constructElement(xelement);

    for (const xattribute of xelement.attributes()) {
      this.setAttribute(element, xattribute);
    }

    for (const childXNode of xelement.nodes()) {
      element.appendChild(this.createNode(childXNode));
    }

    // Unregister the namespaces declared by the element.
    this.resolver.popScope();

    return element;
  }

  private constructElement(xelement: XElement): Element {
    const name = xelement.name;
    return name.namespace === XNamespace.none
      ? this.xmlDocument.createElement(name.localName)
      : this.xmlDocument.createElementNS(
          name.namespaceName,
          this.getQualifiedName(xelement)
        );
  }

  private setAttribute(element: Element, xattribute: XAttribute): void {
    const name = xattribute.name;
    if (name.namespace === XNamespace.none) {
      if (name.localName === 'xmlns') {
        // Translate from LINQ to DOM representation of default namespace
        // declaration. In the DOM, default namespace declaration have a
        // non-empty namespace name.
        element.setAttributeNS(
          XNamespace.xmlnsPrefixNamespaceName,
          'xmlns',
          xattribute.value
        );
      } else {
        element.setAttribute(name.localName, xattribute.value);
      }
    } else {
      element.setAttributeNS(
        name.namespaceName,
        this.getQualifiedName(xattribute),
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

  private getQualifiedName(namedObject: XElement | XAttribute): string {
    const name = namedObject._name;
    const prefix = this.getPrefixOfNamespace(
      name.namespace,
      namedObject instanceof XElement
    );
    return prefix ? `${prefix}:${name.localName}` : name.localName;
  }

  private getPrefixOfNamespace(
    ns: XNamespace,
    allowDefaultNamespace: boolean
  ): string | null {
    const namespaceName = ns.namespaceName;
    if (namespaceName.length > 0) {
      const prefix = this.resolver.getPrefixOfNamespace(
        ns,
        allowDefaultNamespace
      );
      if (prefix !== null) return prefix;

      if (namespaceName === XNamespace.xmlPrefixNamespaceName) return 'xml';
      if (namespaceName === XNamespace.xmlnsPrefixNamespaceName) return 'xmlns';
    }

    return null;
  }

  private pushAncestors(e: XElement): void {
    while (e.parent instanceof XElement) {
      e = e.parent;
      let a = e._lastAttr;
      if (a !== null) {
        do {
          a = a._next!;
          if (a.isNamespaceDeclaration) {
            this.resolver.addFirst(
              a._name.namespaceName.length === 0 ? '' : a._name.localName,
              XNamespace.get(a._value)
            );
          }
        } while (a !== e._lastAttr);
      }
    }
  }

  private pushElement(e: XElement): void {
    this.resolver.pushScope();
    let a = e._lastAttr;
    if (a !== null) {
      do {
        a = a._next!;
        if (a.isNamespaceDeclaration) {
          this.resolver.add(
            a._name.namespaceName.length === 0 ? '' : a._name.localName,
            XNamespace.get(a._value)
          );
        }
      } while (a !== e._lastAttr);
    }
  }
}
