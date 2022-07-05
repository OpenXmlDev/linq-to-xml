/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XNode } from './internal.js';
import { StringBuilder } from './StringBuilder.js';

/**
 * Represents a text node.
 */
export class XText extends XNode {
  /** @internal */
  _text: string;

  public constructor(value: string) {
    super();
    this._text = value;
  }

  public get value(): string {
    return this._text;
  }

  public set value(text: string) {
    this._text = text;
  }

  /** @internal */
  override appendText(sb: StringBuilder): void {
    sb.append(this._text);
  }

  /** @internal */
  override cloneNode(): XNode {
    return new XText(this._text);
  }

  public toString(): string {
    return this._text;
  }
}
