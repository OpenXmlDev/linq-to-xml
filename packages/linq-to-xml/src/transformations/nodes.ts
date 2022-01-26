/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { getNodes, XContainer, XNode } from '../internal';

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
