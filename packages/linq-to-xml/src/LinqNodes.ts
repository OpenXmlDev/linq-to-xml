/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XName, XNode } from './internal.js';
import { ancestors, remove } from './transformations/index.js';
import { LinqIterableBase, LinqElements } from './internal.js';

/**
 * Provides additional methods specific to a `LinqIterable<XNode>`.
 */
export class LinqNodes extends LinqIterableBase<XNode, LinqNodes> {
  /**
   * Initializes a new instance with the given source sequence.
   *
   * @param source The source sequence.
   */
  constructor(source: Iterable<XNode>) {
    super(source, linqNodes);
  }

  ancestors(name?: XName | null): LinqElements {
    return new LinqElements(ancestors(name)(this.source));
  }

  /**
   * Removes each `XNode` represented in this sequence from its parent
   * `XContainer`.
   */
  remove(): void {
    remove(this.source);
  }
}

/**
 * Converts an `Iterable<XNode>` into a LINQ-style iterable.
 *
 * @param source The source `Iterable<XNode>`.
 * @returns A `LinqNodes` instance.
 */
export function linqNodes(source: Iterable<XNode>): LinqNodes {
  return source instanceof LinqNodes ? source : new LinqNodes(source);
}
