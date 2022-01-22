/**
 * @author Thomas Barnekow
 * @license MIT
 */

export class XDeclaration {
  constructor(
    public version: string = '1.0',
    public encoding?: string,
    public standalone?: string
  ) {}

  public toString(): string {
    let s = `<?xml version="${this.version}"`;

    if (this.encoding) {
      s += ` encoding="${this.encoding}"`;
    }

    if (this.standalone) {
      s += ` standalone="${this.standalone}"`;
    }

    s += '?>';
    return s;
  }
}
