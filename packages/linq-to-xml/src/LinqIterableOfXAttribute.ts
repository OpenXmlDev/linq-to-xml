/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { PredicateWithIndex } from '@tsdotnet/common-interfaces';
import { where } from '@tsdotnet/linq/dist/filters';

import { XAttribute } from './internal';
import { LinqIterable } from './LinqIterable';

/**
 * Provides additional methods specific to a `LinqIterable<XAttribute>`.
 */
export class LinqIterableOfXAttribute extends LinqIterable<XAttribute> {
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

  /**
   * Filters the sequence using the given predicate.
   *
   * @param predicate The predicate.
   * @returns The filtered sequence.
   */
  where(predicate: PredicateWithIndex<XAttribute>): LinqIterableOfXAttribute {
    return new LinqIterableOfXAttribute(where(predicate)(this.source));
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
