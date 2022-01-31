/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute } from './internal';
import { LinqIterableBase } from './LinqIterable';

/**
 * Provides additional methods specific to a `LinqIterable<XAttribute>`.
 */
export class LinqIterableOfXAttribute extends LinqIterableBase<
  XAttribute,
  LinqIterableOfXAttribute
> {
  /**
   * Initializes a new instance with the given source sequence.
   *
   * @param source The source sequence.
   */
  constructor(source: Iterable<XAttribute>) {
    super(source, linqAttributes);
  }

  /**
   * Removes each `XAttribute` represented in this sequence from its parent
   * `XElement`.
   */
  remove(): void {
    const attributes = [...this.source];
    for (const attribute of attributes) {
      if (attribute) attribute.remove();
    }
  }
}

/**
 * Converts an `Iterable<XAttribute>` into a LINQ-style iterable.
 *
 * @param source The source `Iterable<XAttribute>`.
 * @returns A `LinqIterableOfXAttribute` instance.
 */
export function linqAttributes(
  source: Iterable<XAttribute>
): LinqIterableOfXAttribute {
  return source instanceof LinqIterableOfXAttribute
    ? source
    : new LinqIterableOfXAttribute(source);
}
