/**
 * @author Thomas Barnekow
 * @license MIT
 */

/**
 * A super-simple and preliminary implementation of a `StringBuilder`.
 *
 * @internal
 */
export class StringBuilder {
  private array: string[] = [];

  append(text: string): StringBuilder {
    this.array.push(text);
    return this;
  }

  toString(): string {
    return this.array.join('');
  }
}
