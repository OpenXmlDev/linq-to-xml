/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute } from './internal.js';
import { LinqIterableBase } from './LinqIterable.js';

/**
 * Provides additional methods specific to a `LinqIterable<XAttribute>`.
 */
export class LinqAttributes extends LinqIterableBase<
  XAttribute,
  LinqAttributes
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
 * @returns A `LinqAttributes` instance.
 */
export function linqAttributes(source: Iterable<XAttribute>): LinqAttributes {
  return source instanceof LinqAttributes ? source : new LinqAttributes(source);
}
