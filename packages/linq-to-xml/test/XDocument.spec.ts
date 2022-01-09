/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XDocument } from '../src/internal';

const NAMESPACE_DECLARATIONS = `
xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
`
  .trim()
  .replace(/[\r\n]+/g, ' ');

const PKG_PACKAGE_TEXT = `
<?xml version="1.0" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage">
  <pkg:part pkg:name="/word/document.xml" pkg:contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml">
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

describe('XDocument.toString()', () => {
  it('should return the expected markup', () => {
    const xdocument = XDocument.parse(PKG_PACKAGE_TEXT);
    const text = xdocument.toString();
    expect(text).toContain('<?mso-application progid="Word.Document"?>');
    expect(text).toContain(
      '<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage">'
    );
    expect(text).toContain(`<w:document ${NAMESPACE_DECLARATIONS}>`);
    expect(text).toContain(
      '<w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">'
    );
    expect(text).toContain('<w:t>Heading</w:t>');
  });
});
