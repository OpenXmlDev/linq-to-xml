/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform.js';
import { getAncestors, XElement, XName, XNode } from '../internal.js';

/**
 * Returns a function that, for the elements of the source sequence passed to
 * that function, returns the concatenated sequences of ancestors of such
 * elements in reverse document order.
 *
 * If a name is provided, the resulting sequence contains only those ancestors
 * having a matching name.
 *
 * @typeParam T The type of the elements contained in the source sequence.
 * @param name The optional name used to filter the sequence of ancestors.
 * @returns A function that will return a flat sequence of ancestors in reverse
 * document order.
 */
export function ancestors<T extends XNode>(
  name?: XName | null
): IterableValueTransform<T, XElement> {
  return function (source: Iterable<T>): Iterable<XElement> {
    return name !== null
      ? getManyAncestors(source, name ?? null, false)
      : XElement.emptySequence;
  };
}

/**
 * Returns a function that, for the elements of the source sequence passed to
 * that function, returns the concatenated sequences of ancestors of such
 * elements, including the elements themselves, in reverse document order.
 *
 * If a name is provided, the resulting sequence contains only those elements
 * and ancestors having a matching name.
 *
 * @param name The optional name used to filter the sequence of ancestors and
 * elements.
 * @returns A function that will return a flat sequence of ancestors, including
 * the elements, in reverse document order.
 */
export function ancestorsAndSelf(
  name?: XName | null
): IterableValueTransform<XElement, XElement> {
  return function (source: Iterable<XElement>): Iterable<XElement> {
    return name !== null
      ? getManyAncestors(source, name ?? null, true)
      : XElement.emptySequence;
  };
}

function* getManyAncestors<T extends XNode>(
  source: Iterable<T>,
  name: XName | null,
  self: boolean
) {
  for (const node of source) {
    for (const ancestor of getAncestors(node, name, self)) {
      yield ancestor;
    }
  }
}
