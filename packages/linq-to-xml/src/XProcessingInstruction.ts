/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XNode } from './internal';

export class XProcessingInstruction extends XNode {
  public constructor(public target: string, public data: string) {
    super();
  }

  /** @internal */
  override cloneNode(): XNode {
    return new XProcessingInstruction(this.target, this.data);
  }

  public toString(): string {
    return `<?${this.target} ${this.data.trim()}?>`;
  }
}
