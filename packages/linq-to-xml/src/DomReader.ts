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
  /** @internal */
  static getXName(node: Element | Attr): XName {
    return this.getXNamespace(node).getName(node.prefix, node.localName);
  }

  /** @internal */
  static getXNamespace(node: Element | Attr): XNamespace {
    return node.namespaceURI
      ? XNamespace.get(node.namespaceURI, node.prefix)
      : XNamespace.none;
  }

  /**
   * Creates a new `XDocument` from the given DOM `XMLDocument`.
   *
   * @param xmlDocument The DOM `XMLDocument` to be loaded.
   * @returns A new `XDocument` instance.
   */
  public static loadXDocument(xmlDocument: XMLDocument): XDocument {
    const xdocument = new XDocument();

    xmlDocument.childNodes.forEach((node: ChildNode) => {
      xdocument.add(this.loadXNode(node));
    });

    return xdocument;
  }

  /**
   * Creates a new `XElement` from the given DOM `Element`.
   *
   * @param element The `Element` to be loaded.
   * @returns A new `XElement` instance.
   */
  public static loadXElement(element: Element): XElement {
    const xelement = new XElement(this.getXName(element));

    // Add all XAttributes.
    for (let i = 0; i < element.attributes.length; i++) {
      const attribute = element.attributes[i];
      xelement.add(new XAttribute(this.getXName(attribute), attribute.value));
    }

    // Add all XNodes.
    element.childNodes.forEach((node: ChildNode) => {
      xelement.add(this.loadXNode(node));
    });

    return xelement;
  }

  /**
   * Creates an `XDocument`, `XElement`, `XProcessingInstruction`, or `string`
   * from the given node. Returns `null` for text nodes without a nodeValue.
   * Throws exceptions for unsupported and unexpected node types:
   *
   * - COMMENT_NODE: Currently unsupported (not used in Open XML)
   * - CDATA_SECTION_NODE: Currently unsupported (not used in Open XML)
   * - DOCUMENT_TYPE_NODE: Unsupported (not used in XML)
   *
   * Notes:
   * - Returns a `string` instead of an `XText` in line with the Linq-to-XML
   *   practice of storing text-only nodes as strings at least initially.
   *
   * - A DOM Node represents both nodes and attributes, whereas in Linq-to-XML
   *   an XAttribute is not an XNode. Therefore, this method does not expect
   *   attribute "nodes".
   *
   * @param node The `Node`.
   * @returns An `XDocument`, `XElement`, `XProcessingInstruction`, `string`, or `null`.
   *
   * @internal
   */
  static loadXNode(
    node: Node
  ): XDocument | XElement | XProcessingInstruction | string | null {
    // Note that there is no nodeType constant for XML declarations. This is
    // due to the fact that the DOM is focused on HTML documents, where XML
    // declarations don't exist.
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        return this.loadXElement(node as Element);

      case Node.TEXT_NODE:
        return node.nodeValue;

      case Node.PROCESSING_INSTRUCTION_NODE: {
        const pi = node as ProcessingInstruction;
        return new XProcessingInstruction(pi.target, pi.data);
      }

      case Node.DOCUMENT_NODE:
        // This case exists mostly to be complete. You'd typically call
        // loadXDocument() from the outside, so this is not normally hit.
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

      default:
        // This should never happen.
        throw new Error(`Unexpected nodeType: ${node.nodeType}`);
    }
  }
}
