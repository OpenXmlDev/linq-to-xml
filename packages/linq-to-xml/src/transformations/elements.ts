/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform';
import { XContainer, XElement, XName, XNode } from '../internal';

export function elements<T extends XContainer>(
  name?: XName | null
): IterableValueTransform<T, XElement> {
  return function (source: Iterable<T>): Iterable<XElement> {
    return name !== null
      ? getManyElements(source, name ?? null)
      : XElement.emptySequence;
  };
}

function* getManyElements<T extends XContainer>(
  source: Iterable<T>,
  name: XName | null
) {
  for (const root of source) {
    if (root && root._content instanceof XNode) {
      let n: XNode = root._content;
      do {
        n = n._next!;
        if (n instanceof XElement && (name === null || n._name === name)) {
          yield n;
        }
      } while (n._parent === root && n !== root._content);
    }
  }
}
