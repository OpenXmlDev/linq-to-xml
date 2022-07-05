/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform.js';
import { XContainer, XElement, XName, XNode } from '../internal.js';

/**
 * Returns a function that, for the elements of the source sequence passed to
 * that function, returns the concatenated sequences of descendants of such
 * elements in document order.
 *
 * If a name is provided, the resulting sequence contains only those ancestors
 * having a matching name.
 *
 * @typeParam T The type of the elements contained in the source sequence.
 * @param name The optional name used to filter the sequence of descendants.
 * @returns A function that will return a flat sequence of descendants in
 * document order.
 */
export function descendants<T extends XContainer>(
  name?: XName | null
): IterableValueTransform<T, XElement> {
  return function (source: Iterable<T>): Iterable<XElement> {
    return name !== null
      ? getManyDescendants(source, name ?? null, false)
      : XElement.emptySequence;
  };
}

/**
 * Returns a function that, for the elements of the source sequence passed to
 * that function, returns the concatenated sequences of descendants of such
 * elements, including the elements themselves, in document order.
 *
 * If a name is provided, the resulting sequence contains only those elements
 * and descendants having a matching name.
 *
 * @param name The optional name used to filter the sequence of descendants
 * and elements.
 * @returns A function that will return a flat sequence of ancestors, including
 * the elements, in document order.
 */
export function descendantsAndSelf(
  name?: XName | null
): IterableValueTransform<XElement, XElement> {
  return function (source: Iterable<XElement>): Iterable<XElement> {
    return name !== null
      ? getManyDescendants(source, name ?? null, true)
      : XElement.emptySequence;
  };
}

function* getManyDescendants<T extends XContainer>(
  source: Iterable<T>,
  name: XName | null,
  self: boolean
) {
  for (const root of source) {
    if (root) {
      if (self && root instanceof XElement) {
        if (name === null || root.name === name) yield root;
      }

      let n: XNode | null = root;
      let c: XContainer | null = root;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (c !== null && c._content instanceof XNode) {
          n = (c._content as XNode)._next;
        } else {
          while (n !== null && n !== root && n === n._parent!._content) {
            n = n._parent;
          }

          if (n === null || n === root) break;

          n = n._next;
        }

        const e: XElement | null = n instanceof XElement ? n : null;

        if (e !== null && (name === null || e._name === name)) {
          yield e;
        }

        c = e;
      }
    }
  }
}
