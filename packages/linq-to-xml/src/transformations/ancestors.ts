/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform';
import { getAncestors, XElement, XName, XNode } from '../internal';

export function ancestors<T extends XNode>(
  name?: XName | null
): IterableValueTransform<T, XElement> {
  return function (source: Iterable<T>): Iterable<XElement> {
    return name !== null
      ? getManyAncestors(source, name ?? null, false)
      : XElement.emptySequence;
  };
}

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
