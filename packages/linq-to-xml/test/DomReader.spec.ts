/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  DomParser,
  DomReader,
  XDocument,
  XElement,
  XNamespace,
  XProcessingInstruction,
} from '../src/internal';

const textWithElementAndTextNode = '<p>Text</p>';

const textWithProcessingInstruction = `
<?mso-application progid="Word.Document"?>
<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage">
</pkg:package>
`;

const textWithComment = '<p><!-- Comment --></p>';
const textWithCDataSectionNode = '<pre><![CDATA[value < 10]]></pre>';

const textWithDocumentType = `
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
`;

const namespaceName = 'http://schemas.microsoft.com/office/2006/xmlPackage';
const text = `<pkg:package xmlns:pkg="${namespaceName}" xml:space="preserve" custom="true"/>`;
const element = DomParser.parseElement(text)!;

describe('static getXName(node: Element | Attr): XName', () => {
  it('gets the XName having the xmlns prefix', () => {
    const pkg = element.attributes.item(0)!;

    const name = DomReader.getXName(pkg);

    expect(name.namespace).toBe(XNamespace.xmlns);
    expect(name.localName).toEqual('pkg');
  });

  it('gets the XName having the xml prefix', () => {
    const space = element.attributes.item(1)!;

    const name = DomReader.getXName(space);

    expect(name.namespace).toBe(XNamespace.xml);
    expect(name.localName).toEqual('space');
  });

  it('gets the XName having no prefix', () => {
    const custom = element.attributes.item(2)!;

    const name = DomReader.getXName(custom);

    expect(name.namespace).toBe(XNamespace.none);
    expect(name.localName).toEqual('custom');
  });

  it('gets the XName having the declared prefix', () => {
    const name = DomReader.getXName(element);

    expect(name.namespaceName).toBe(namespaceName);
    expect(name.localName).toBe('package');
  });
});

describe('static getXNamespace(node: Element | Attr): XNamespace', () => {
  it('gets the XNamespace corresponding to the xmlns prefix', () => {
    const pkg = element.attributes.item(0)!;
    const xmlns = DomReader.getXNamespace(pkg);
    expect(xmlns).toBe(XNamespace.xmlns);
  });

  it('gets the XNamespace corresponding to the xml prefix', () => {
    const space = element.attributes.item(1)!;
    const xml = DomReader.getXNamespace(space);
    expect(xml).toBe(XNamespace.xml);
  });

  it('gets the XNamespace corresponding to no prefix', () => {
    const custom = element.attributes.item(2)!;
    const none = DomReader.getXNamespace(custom);
    expect(none).toBe(XNamespace.none);
  });

  it('gets the XNamespace corresponding to the declared prefix', () => {
    const pkg = DomReader.getXNamespace(element);
    expect(pkg.namespaceName).toEqual(namespaceName);
  });
});

describe('static loadXNodeOrXAttribute(node: Node)', () => {
  it('loads elements and text nodes', () => {
    const element = DomParser.parseElement(textWithElementAndTextNode)!;

    const node = DomReader.loadXNode(element);

    expect(node).toBeInstanceOf(XElement);
    expect((node as XElement).value).toEqual('Text');
  });

  it('loads processing instructions', () => {
    // Arrange
    const document = DomParser.parseDocument(textWithProcessingInstruction)!;
    const pi = document.childNodes.item(0);
    expect(pi.nodeType).toEqual(pi.PROCESSING_INSTRUCTION_NODE);

    // Act
    const node = DomReader.loadXNode(pi);

    // Assert
    if (node instanceof XProcessingInstruction) {
      expect(node.target).toEqual('mso-application');
      expect(node.data).toEqual('progid="Word.Document"');
    } else {
      throw new Error('Node is not an XProcessingInstruction');
    }
  });

  it('loads document nodes', () => {
    const document = DomParser.parseDocument(textWithProcessingInstruction)!;
    const node = DomReader.loadXNode(document);
    expect(node).toBeInstanceOf(XDocument);
  });

  it('throws when loading comments', () => {
    const element = DomParser.parseElement(textWithComment)!;
    const commentNode = element.childNodes.item(0);
    expect(commentNode.nodeType).toEqual(commentNode.COMMENT_NODE);

    expect(() => DomReader.loadXNode(commentNode)).toThrow();
  });

  it('throws when loading CData section nodes', () => {
    const element = DomParser.parseElement(textWithCDataSectionNode)!;
    const cdataSectionNode = element.childNodes.item(0);
    expect(cdataSectionNode.nodeType).toEqual(
      cdataSectionNode.CDATA_SECTION_NODE
    );

    expect(() => DomReader.loadXNode(cdataSectionNode)).toThrow();
  });

  it('throws when loading document type nodes', () => {
    const document = DomParser.parseDocument(textWithDocumentType)!;
    const documentTypeNode = document.childNodes.item(0);
    expect(documentTypeNode.nodeType).toEqual(
      documentTypeNode.DOCUMENT_TYPE_NODE
    );

    expect(() => DomReader.loadXNode(documentTypeNode)).toThrow();
  });

  it('throws when loading unexpected node types', () => {
    const document = DomParser.parseDocument(textWithProcessingInstruction)!;
    const unexpectedNode = document.createDocumentFragment();
    expect(() => DomReader.loadXNode(unexpectedNode)).toThrow();
  });
});
