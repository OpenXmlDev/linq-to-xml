/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XName, XNode } from './internal';
import { ancestors, remove } from './transformations';
import { LinqIterableBase, LinqIterableOfXElement } from './internal';

/**
 * Provides additional methods specific to a `LinqIterable<XNode>`.
 */
export class LinqIterableOfXNode extends LinqIterableBase<
  XNode,
  LinqIterableOfXNode
> {
  /**
   * Initializes a new instance with the given source sequence.
   *
   * @param source The source sequence.
   */
  constructor(source: Iterable<XNode>) {
    super(source, linqNodes);
  }

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
