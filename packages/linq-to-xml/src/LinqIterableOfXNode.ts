/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { PredicateWithIndex } from '@tsdotnet/common-interfaces';
import { where } from '@tsdotnet/linq/dist/filters';

import { XName, XNode } from './internal';
import { ancestors, remove } from './transformations';
import { LinqIterable, LinqIterableOfXElement } from './internal';

/**
 * Provides additional methods specific to a `LinqIterable<XNode>`.
 */
export class LinqIterableOfXNode extends LinqIterable<XNode> {
  ancestors(name?: XName | null): LinqIterableOfXElement {
    return new LinqIterableOfXElement(ancestors(name)(this.source));
  }

  /**
   * Removes each `XNode` represented in this sequence from its parent
   * `XContainer`.
   */
  remove(): void {
    remove(this.source);
  }

  /**
   * Filters the sequence using the given predicate.
   *
   * @param predicate The predicate.
   * @returns The filtered sequence.
   */
  where(predicate: PredicateWithIndex<XNode>): LinqIterableOfXNode {
    return new LinqIterableOfXNode(where(predicate)(this.source));
  }
}

/**
 * Converts an `Iterable<XNode>` into a LINQ-style iterable.
 *
 * @param source The source `Iterable<XNode>`.
 * @returns A `LinqIterableOfXNode` instance.
 */
export function linqNodes(source: Iterable<XNode>): LinqIterableOfXNode {
  return source instanceof LinqIterableOfXNode
    ? source
    : new LinqIterableOfXNode(source);
}
