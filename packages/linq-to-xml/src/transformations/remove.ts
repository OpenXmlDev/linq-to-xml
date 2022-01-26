/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XAttribute, XNode } from '../internal';

export function remove<T extends XAttribute | XNode>(
  source: Iterable<T>
): void {
  const items = [...source];
  for (const item of items) {
    if (item) item.remove();
  }
}
