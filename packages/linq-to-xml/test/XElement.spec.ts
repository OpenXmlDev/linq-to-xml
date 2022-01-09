/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  XAttribute,
  XContainer,
  XElement,
  XNamespace,
  XNode,
  XObject,
} from '../src/internal';

const xmlns_pkg = XNamespace.xmlns.getName('pkg');
const xmlns_w = XNamespace.xmlns.getName('w');

const NAMESPACE_NAME_PKG =
  'http://schemas.microsoft.com/office/2006/xmlPackage';

const pkg = XNamespace.get(NAMESPACE_NAME_PKG, 'pkg');

const pkg_package = pkg.getName('package');
const pkg_part = pkg.getName('part');
const pkg_xmlData = pkg.getName('xmlData');

const pkg_name = pkg.getName('name');
const pkg_contentType = pkg.getName('contentType');

const NAMESPACE_NAME_W =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const w = XNamespace.get(NAMESPACE_NAME_W, 'w');

const w_document = w.getName('document');
const w_body = w.getName('body');
const w_p = w.getName('p');
const w_t = w.getName('t');
const w_tbl = w.getName('tbl');

const w_rsidR = w.getName('rsidR');
const w_rsidRDefault = w.getName('rsidRDefault');
const w_rsidP = w.getName('rsidP');

const PKG_NAME = 'pkg:name="/word/document.xml"';
const PKG_CONTENT_TYPE =
  'pkg:contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"';

const NAMESPACE_DECLARATIONS = `
xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
mc:Ignorable="w14"
`
  .trim()
  .replace(/[\r\n]+/g, ' ');

const PKG_PACKAGE_TEXT = `
<?xml version="1.0" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage">
  <pkg:part ${PKG_NAME} ${PKG_CONTENT_TYPE}>
    <pkg:xmlData>
      <w:document ${NAMESPACE_DECLARATIONS}>
        <w:body>
          <w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">
            <w:pPr>
              <w:pStyle w:val="Heading1"/>
            </w:pPr>
            <w:r>
              <w:t>Heading</w:t>
            </w:r>
          </w:p>
          <w:p w:rsidR="00000000" w:rsidRDefault="007A3403"/>
        </w:body>
      </w:document>
    </pkg:xmlData>
  </pkg:part>
</pkg:package>
`
  .replace(/[\s]+</g, '<')
  .replace(/>[\s]+/g, '>');

describe('An XElement instance', () => {
  const element = new XElement(w_body);

  it('should be an instance of its class and the superclasses', () => {
    expect(element instanceof XElement).toBe(true);
    expect(element instanceof XContainer).toBe(true);
    expect(element instanceof XNode).toBe(true);
    expect(element instanceof XObject).toBe(true);
    expect(element instanceof Object).toBe(true);
  });
});

describe('An empty XElement without nodes and attributes', () => {
  const element = new XElement(w_body);

  it('should have the given name', () => {
    expect(element.name).toBe(w_body);
  });

  it('should indicate that it has no nodes', () => {
    expect(element.firstNode).toBeNull();
    expect(element.hasElements).toBe(false);
    expect(element.lastNode).toBeNull();
    expect(element.isEmpty).toBe(true);
  });

  it('should indicate that it has no attributes', () => {
    expect(element.firstAttribute).toBeNull();
    expect(element.hasAttributes).toBe(false);
    expect(element.lastAttribute).toBeNull();
    expect([...element.attributes()].length).toBe(0);
  });
});

describe('An XElement with two child elements', () => {
  const paragraph = new XElement(w_p);
  const table = new XElement(w_tbl);
  const element = new XElement(w_body, paragraph, table);

  it('should not be empty', () => {
    expect(element.isEmpty).toBe(false);
  });

  it('should have its _content member point to the last element', () => {
    expect(element._content).toBe(table);
  });
});

describe('An XElement with an array parameter', () => {
  const paragraph = new XElement(w_p);
  const table = new XElement(w_tbl);

  const element = new XElement(w_body, [paragraph, table]);

  it('should not be empty', () => {
    expect(element.isEmpty).toBe(false);
    expect(element._content).toBe(table);
  });
});

describe('XElement.add(undefined)', () => {
  const element = new XElement(w_p);
  element.add(undefined);

  it('should not add anything', () => {
    expect(element.isEmpty).toBe(true);
  });
});

describe('XElement.add(null)', () => {
  const element = new XElement(w_p);
  element.add(null);

  it('should not add anything', () => {
    expect(element.isEmpty).toBe(true);
  });
});

describe('XElement.add("")', () => {
  const element = new XElement(w_p);
  element.add('');

  it('should not add anything', () => {
    expect(element.isEmpty).toBe(true);
  });
});

describe('XElement.add(0)', () => {
  const element = new XElement(w_t);
  element.add(0);

  it('should not leave the element empty', () => {
    expect(element.isEmpty).toBe(false);
  });

  it('should add string content with a value of "0"', () => {
    expect(typeof element._content).toEqual('string');
    expect(element._content).toEqual('0');
  });
});

describe('XElement.attributes()', () => {
  it('should be iterable', () => {
    const rsidR = new XAttribute(w_rsidR, '00000001');
    const rsidRDefault = new XAttribute(w_rsidRDefault, '00000002');
    const rsidP = new XAttribute(w_rsidP, '00000003');
    const element = new XElement(w_p, rsidR, rsidRDefault, rsidP);

    const attributes = [...element.attributes()];

    expect(attributes[0]).toBe(rsidR);
    expect(attributes[1]).toBe(rsidRDefault);
    expect(attributes[2]).toBe(rsidP);
  });

  it('should offer a remove() method', () => {
    const rsidR = new XAttribute(w_rsidR, '00000001');
    const rsidRDefault = new XAttribute(w_rsidRDefault, '00000002');
    const rsidP = new XAttribute(w_rsidP, '00000003');
    const element = new XElement(w_p, rsidR, rsidRDefault, rsidP);

    const attributes = element.attributes();

    attributes.remove();
  });
});

describe('XElement.parse()', () => {
  const text = PKG_PACKAGE_TEXT;

  const element = XElement.parse(text);
  const part = element.element(pkg_part)!;
  const xmlData = part.element(pkg_xmlData)!;
  const document = xmlData.element(w_document)!;
  const body = document.element(w_body)!;

  it('should parse the node tree', () => {
    expect(element.name).toBe(pkg_package);
    expect(part?.name).toBe(pkg_part);
    expect(xmlData.name).toBe(pkg_xmlData);
    expect(document.name).toBe(w_document);
    expect(body.name).toBe(w_body);
  });

  it('should parse attributes', () => {
    expect(part.attribute(pkg_name)!.value).toEqual('/word/document.xml');
    expect(part.attribute(pkg_contentType)!.value).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'
    );
  });

  it('should parse namespace declarations (i.e., specific kinds of attributes)', () => {
    expect(element.attribute(xmlns_pkg)!.value).toEqual(NAMESPACE_NAME_PKG);
    expect(document.attribute(xmlns_w)!.value).toEqual(NAMESPACE_NAME_W);
  });
});

describe('XElement.toString()', () => {
  const text = PKG_PACKAGE_TEXT;
  const element = XElement.parse(text);
  const part = element.element(pkg_part)!;

  it('should produce the expected string representation', () => {
    const xml = part.toString();

    expect(xml).toContain('<pkg:part');
    expect(xml).toContain(`${PKG_NAME} ${PKG_CONTENT_TYPE}`);
    expect(xml).toContain('<pkg:xmlData>');
    expect(xml).toContain(`<w:document ${NAMESPACE_DECLARATIONS}>`);
    expect(xml).toContain('<w:body>');
    expect(xml).toContain(
      '<w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">'
    );
    expect(xml).toContain('<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>');
    expect(xml).toContain('<w:r><w:t>Heading</w:t></w:r>');
    expect(xml).toContain(
      '<w:p w:rsidR="00000000" w:rsidRDefault="007A3403"/>'
    );
  });
});

describe('checks for undefined, null, or empty string', () => {
  let undefinedValue: any;
  const nullValue: any = null;
  const emptyString = '';
  const zeroNumber = 0;

  it('should produce the expected result', () => {
    expect(!undefinedValue).toBe(true);
    expect(!nullValue).toBe(true);
    expect(!emptyString).toBe(true);
    expect(!zeroNumber).toBe(true);

    expect(!!undefinedValue).toBe(false);
    expect(!!nullValue).toBe(false);
    expect(!!emptyString).toBe(false);
    expect(!!zeroNumber).toBe(false);

    expect(undefinedValue == null).toBe(true);
    expect(undefinedValue === null).toBe(false);

    expect(nullValue == undefined).toBe(true);
    expect(nullValue === undefined).toBe(false);

    expect(nullValue != undefined).toBe(false);
  });
});
