/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute, XNode } from '../internal';

/**
 * Removes each element contained in the source sequence from its parent
 * `XContainer`.
 *
 * @typeParam T The type of the elements contained in the soruce sequence.
 * @param source The source sequence.
 */
export function remove<T extends XAttribute | XNode>(
  source: Iterable<T>
): void {
  const items = [...source];
  for (const item of items) {
    if (item) item.remove();
  }
}
