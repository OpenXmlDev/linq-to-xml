/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  XAttribute,
  XDocument,
  XElement,
  XName,
  XNamespace,
  XProcessingInstruction,
} from './internal';

/**
 * Provides utility functions for parsing XML.
 *
 * @internal
 */
export class DomReader {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private static getXName(node: Element | Attr): XName {
    return this.getXNamespace(node).getName(node.prefix, node.localName);
  }

  private static getXNamespace(node: Element | Attr): XNamespace {
    if (node.namespaceURI) {
      return XNamespace.get(node.namespaceURI, node.prefix);
    }

    switch (node.prefix) {
      case null:
        return XNamespace.none;
      case 'xmlns':
        return XNamespace.xmlns;
      case 'xml':
        return XNamespace.xml;
      default:
        throw new Error(`Unexpected prefix: ${node.prefix}`);
    }
  }

  private static loadXAttribute(attribute: Attr): XAttribute {
    return new XAttribute(this.getXName(attribute), attribute.value);
  }

  /**
   * Creates an `XDocument`, `XElement`, `XAttribute`, or `string` from the
   * given node. Returns `null` for ignored nodes.
   *
   * Notes:
   * - Returns a `string` instead of an `XText` in line with the Linq-to-XML
   *   practice of storing text-only nodes as strings at least initially.
   *
   * - A DOM Node represents both nodes and attributes, whereas in Linq-to-XML
   *   an XAttribute is not an XNode.
   *
   * @param node The `Node`.
   * @returns An `XDocument`, `XElement`, `XAttribute`, `string`, or `null`.
   */
  private static loadXNodeOrXAttribute(
    node: Node
  ):
    | XDocument
    | XElement
    | XAttribute
    | XProcessingInstruction
    | string
    | null {
    switch (node.nodeType) {
      // Note that there is no nodeType constant for XML declarations. This is
      // due to the fact that the DOM is focused on HTML documents, where XML
      // declarations don't exist.
      case Node.ELEMENT_NODE:
        return this.loadXElement(node as Element);

      case Node.ATTRIBUTE_NODE:
        return this.loadXAttribute(node as Attr);

      case Node.TEXT_NODE:
        return node.nodeValue;

      case Node.PROCESSING_INSTRUCTION_NODE:
        return this.loadXProcessingInstruction(node as ProcessingInstruction);

      case Node.DOCUMENT_NODE:
        return this.loadXDocument(node as Document);

      case Node.COMMENT_NODE:
        // With the focus on Open XML markup, we currently don't support
        // Comment nodes such as <!-- … -->
        throw new Error('Unsupported Comment node.');

      case Node.CDATA_SECTION_NODE:
        // With the focus on Open XML markup, we currently don't support
        // CDATASection nodes such as <!CDATA[[ … ]]>.
        throw new Error('Unsupported CDATASection node.');

      case Node.DOCUMENT_TYPE_NODE:
        // DocumentType nodes such as <!DOCTYPE html> don't exist in XML.
        throw new Error('Unsupported DocumentType node.');

      case Node.DOCUMENT_FRAGMENT_NODE:
        // DocumentFragment nodes are lightweight documents that we don't
        // use in our library.
        throw new Error('Unexpected DocumentFragment node.');

      default:
        // This should never happen.
        throw new Error(`Unexpected nodeType: ${node.nodeType}`);
    }
  }

  public static loadXDocument(xmlDocument: XMLDocument): XDocument {
    const xdocument = new XDocument();

    xmlDocument.childNodes.forEach((node: ChildNode) => {
      if (node instanceof ProcessingInstruction && node.target === 'xml') {
        // This never happens. XML declarations are seemingly ignored by the
        // parser. Thus, XDocument instances will never have an XDeclaration.
        console.log(`<?${node.target} ${node.data}?>`);
      } else {
        xdocument.add(this.loadXNodeOrXAttribute(node));
      }
    });

    return xdocument;
  }

  public static loadXElement(element: Element): XElement {
    const xelement = new XElement(this.getXName(element));

    // Add all XAttributes.
    for (let i = 0; i < element.attributes.length; i++) {
      xelement.add(this.loadXAttribute(element.attributes[i]));
    }

    // Add all XNodes.
    element.childNodes.forEach((node: ChildNode) => {
      xelement.add(this.loadXNodeOrXAttribute(node));
    });

    return xelement;
  }

  private static loadXProcessingInstruction(
    pi: ProcessingInstruction
  ): XProcessingInstruction {
    return new XProcessingInstruction(pi.target, pi.data);
  }
}
