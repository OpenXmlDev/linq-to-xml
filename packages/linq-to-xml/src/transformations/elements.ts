/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform.js';
import { XContainer, XElement, XName, XNode } from '../internal.js';

/**
 * Returns a function that, for the elements of the source sequence passed to
 * that function, returns the concatenated sequences of child elements of such
 * elements in document order.
 *
 * If a name is provided, the resulting sequence contains only those ancestors
 * having a matching name.
 *
 * @typeParam T The type of the elements contained in the source sequence.
 * @param name The optional name used to filter the sequence of child elements.
 * @returns A function that will return a flat sequence of child elements in
 * document order.
 */
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
