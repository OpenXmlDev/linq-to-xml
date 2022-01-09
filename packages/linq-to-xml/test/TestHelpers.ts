import { XElement, XName, XNamespace } from '../src/internal';

export class PKG {
  public static pkg: XNamespace = XNamespace.get(
    'http://schemas.microsoft.com/office/2006/xmlPackage',
    'pkg'
  );

  public static package: XName = PKG.pkg.getName('package');
  public static part: XName = PKG.pkg.getName('part');
  public static xmlData: XName = PKG.pkg.getName('xmlData');

  public static name_: XName = PKG.pkg.getName('name');
  public static contentType: XName = PKG.pkg.getName('contentType');
}

export class W {
  public static readonly w: XNamespace = XNamespace.get(
    'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'w'
  );

  public static readonly body: XName = W.w.getName('body');
  public static readonly document: XName = W.w.getName('document');
  public static readonly numPr: XName = W.w.getName('numPr');
  public static readonly p: XName = W.w.getName('p');
  public static readonly pPr: XName = W.w.getName('pPr');
  public static readonly pStyle: XName = W.w.getName('pStyle');
  public static readonly r: XName = W.w.getName('r');
  public static readonly rPr: XName = W.w.getName('rPr');
  public static readonly rStyle: XName = W.w.getName('rStyle');
  public static readonly t: XName = W.w.getName('t');
  public static readonly tbl: XName = W.w.getName('tbl');
  public static readonly tblPr: XName = W.w.getName('tblPr');
  public static readonly tblGrid: XName = W.w.getName('tblGrid');
  public static readonly tc: XName = W.w.getName('tc');
  public static readonly tr: XName = W.w.getName('tr');

  public static readonly rsidP: XName = W.w.getName('rsidP');
  public static readonly rsidR: XName = W.w.getName('rsidR');
  public static readonly rsidRDefault: XName = W.w.getName('rsidRDefault');
  public static readonly rsidRPr: XName = W.w.getName('rsidRPr');
}

export const PKG_NAME = 'pkg:name="/word/document.xml"';
export const PKG_CONTENT_TYPE =
  'pkg:contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"';

export const WML_NAMESPACE_DECLARATIONS = `
xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
mc:Ignorable="w14"
`
  .trim()
  .replace(/[\r\n]+/g, ' ');

export const PKG_PACKAGE_TEXT = `
<?xml version="1.0" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage">
  <pkg:part ${PKG_NAME} ${PKG_CONTENT_TYPE}>
    <pkg:xmlData>
      <w:document ${WML_NAMESPACE_DECLARATIONS}>
        <w:body>
          <w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">
            <w:pPr>
              <w:pStyle w:val="Heading1"/>
            </w:pPr>
            <w:r>
              <w:t>Heading</w:t>
            </w:r>
          </w:p>
          <w:p w:rsidR="007A3403" w:rsidRDefault="007A3403" w:rsidP="00034153">
            <w:pPr>
              <w:pStyle w:val="HeadingBody1"/>
            </w:pPr>
            <w:r>
              <w:t>Body Text.</w:t>
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

export function createWordDocumentPackage(): XElement {
  return XElement.parse(PKG_PACKAGE_TEXT);
}
