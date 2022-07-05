/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XContainer, XNode } from '../internal.js';

/**
 * For the elements contained in the source sequence, returns the concatenated
 * sequences of descendant nodes of such elements in document order.
 *
 * @typeParam T The type of the elements of the source sequence.
 * @param source The source sequence of elements.
 * @returns The concatenated, flat sequence of descendant nodes in document order.
 */
export function descendantNodes<T extends XContainer>(
  source: Iterable<T>
): Iterable<XNode> {
  return getManyDescendantNodes(source, false);
}

/**
 * For the elements contained in the source sequence, returns the concatenated
 * sequences of descendant nodes of such elements, including the elements
 * themselves, in document order.
 *
 * @typeParam T The type of the elements of the source sequence.
 * @param source The source sequence of elements.
 * @returns The concatenated, flat sequence of descendant nodes, including
 * the source elements, in document order
 */
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
