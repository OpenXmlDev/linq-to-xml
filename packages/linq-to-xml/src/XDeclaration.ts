/**
 * @author Thomas Barnekow
 * @license MIT
 */

export class XDeclaration {
  constructor(
    public version: string | null,
    public encoding: string | null,
    public standalone: string | null
  ) {}

  public toString(): string {
    let s = '<?xml';

    if (this.version !== null) {
      s += ` version="${this.version}"`;
    }

    if (this.encoding !== null) {
      s += ` encoding="${this.encoding}"`;
    }

    if (this.standalone !== null) {
      s += ` standalone="${this.standalone}"`;
    }

    s += '?>';
    return s;
  }
}
