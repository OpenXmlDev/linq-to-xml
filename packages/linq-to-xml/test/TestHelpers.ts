import {
  linqIterable,
  XAttribute,
  XElement,
  XName,
  XNamespace,
  XNode,
} from '../src';

export class PKG {
  public static pkg: XNamespace = XNamespace.get(
    'http://schemas.microsoft.com/office/2006/xmlPackage'
  );

  public static package: XName = PKG.pkg.getName('package');
  public static part: XName = PKG.pkg.getName('part');
  public static xmlData: XName = PKG.pkg.getName('xmlData');

  public static name_: XName = PKG.pkg.getName('name');
  public static contentType: XName = PKG.pkg.getName('contentType');
}

export class W {
  public static readonly w: XNamespace = XNamespace.get(
    'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  );

  public static get namespaceDeclaration(): XAttribute {
    return new XAttribute(XNamespace.xmlns.getName('w'), W.w.namespaceName);
  }

  public static readonly alias: XName = W.w.getName('alias');
  public static readonly body: XName = W.w.getName('body');
  public static readonly bookmarkEnd: XName = W.w.getName('bookmarkEnd');
  public static readonly bookmarkStart: XName = W.w.getName('bookmarkStart');
  public static readonly document: XName = W.w.getName('document');
  public static readonly numPr: XName = W.w.getName('numPr');
  public static readonly p: XName = W.w.getName('p');
  public static readonly pPr: XName = W.w.getName('pPr');
  public static readonly pStyle: XName = W.w.getName('pStyle');
  public static readonly r: XName = W.w.getName('r');
  public static readonly rPr: XName = W.w.getName('rPr');
  public static readonly rStyle: XName = W.w.getName('rStyle');
  public static readonly sectPr: XName = W.w.getName('sectPr');
  public static readonly sdt: XName = W.w.getName('sdt');
  public static readonly sdtContent: XName = W.w.getName('sdtContent');
  public static readonly sdtPr: XName = W.w.getName('sdtPr');
  public static readonly t: XName = W.w.getName('t');
  public static readonly tag: XName = W.w.getName('tag');
  public static readonly tbl: XName = W.w.getName('tbl');
  public static readonly tblPr: XName = W.w.getName('tblPr');
  public static readonly tblGrid: XName = W.w.getName('tblGrid');
  public static readonly tc: XName = W.w.getName('tc');
  public static readonly tr: XName = W.w.getName('tr');

  public static readonly b: XName = W.w.getName('b');
  public static readonly i: XName = W.w.getName('i');
  public static readonly u: XName = W.w.getName('u');

  public static readonly rsidP: XName = W.w.getName('rsidP');
  public static readonly rsidR: XName = W.w.getName('rsidR');
  public static readonly rsidRDefault: XName = W.w.getName('rsidRDefault');
  public static readonly rsidRPr: XName = W.w.getName('rsidRPr');

  public static readonly val: XName = W.w.getName('val');
}

export class W14 {
  public static readonly w14: XNamespace = XNamespace.get(
    'http://schemas.microsoft.com/office/word/2010/wordml'
  );

  public static get namespaceDeclaration(): XAttribute {
    return new XAttribute(
      XNamespace.xmlns.getName('w14'),
      W14.w14.namespaceName
    );
  }

  public static readonly docId: XName = W14.w14.getName('docId');
  public static readonly paraId: XName = W14.w14.getName('paraId');
  public static readonly textId: XName = W14.w14.getName('textId');
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
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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

export function getNodeSignature(node: XNode): XName | string {
  if (node instanceof XElement) {
    return node.name;
  } else {
    return node.toString();
  }
}

export function getSignature<T extends XNode>(
  sequence: Iterable<T>
): (string | XName)[] {
  return linqIterable(sequence).select(getNodeSignature).toArray();
}
