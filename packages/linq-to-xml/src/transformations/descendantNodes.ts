/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XContainer, XNode } from '../internal';

export function descendantNodes<T extends XContainer>(
  source: Iterable<T>
): Iterable<XNode> {
  return getManyDescendantNodes(source, false);
}

export function descendantNodesAndSelf<T extends XContainer>(
  source: Iterable<T>
): Iterable<XNode> {
  return getManyDescendantNodes(source, true);
}

function* getManyDescendantNodes<T extends XContainer>(
  source: Iterable<T>,
  self: boolean
) {
  for (const root of source) {
    if (root) {
      if (self) yield root;

      let node: XNode | null = root;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const firstChildNode: XNode | null =
          node instanceof XContainer ? node.firstNode : null;

        if (firstChildNode !== null) {
          // Move down.
          node = firstChildNode;
        } else {
          while (
            node !== null &&
            node !== root &&
            node === node._parent!._content
          ) {
            // Move back up.
            node = node._parent;
          }

          if (node === null || node === root) {
            break;
          }

          // Move "right".
          node = node._next!;
        }

        yield node;
      }
    }
  }
}
