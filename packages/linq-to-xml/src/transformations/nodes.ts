/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { getNodes, XContainer, XNode } from '../internal';

/**
 * For the elements contained in the source sequence, returns the concatenated
 * sequences of child nodes of such elements in document order.
 *
 * @typeParam T The type of the elements contained in the source sequence.
 * @returns The concatenated, flat sequence of child nodes in document order.
 */
export function nodes<T extends XContainer>(
  source: Iterable<T>
): Iterable<XNode> {
  return getManyNodes(source);
}

function* getManyNodes<T extends XContainer>(source: Iterable<T>) {
  for (const root of source) {
    if (root) {
      for (const node of getNodes(root)) {
        yield node;
      }
    }
  }
}
