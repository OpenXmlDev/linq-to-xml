/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform.js';
import { getAttributes, XAttribute, XElement, XName } from '../internal.js';

/**
 * Returns a function that, for the elements of the source sequence passed to
 * that function, returns the concatenated sequences of attributes of such
 * elements.
 *
 * If a name is provided, the resulting sequence contains only those attributes
 * having a matching name.
 *
 * @param name The optional name used to filter the sequence of attributes.
 * @returns A function that will return a flat sequence of attributes.
 */
export function attributes(
  name?: XName | null
): IterableValueTransform<XElement, XAttribute> {
  return function (source: Iterable<XElement>): Iterable<XAttribute> {
    return name !== null
      ? getManyAttributes(source, name ?? null)
      : XAttribute.emptySequence;
  };
}

function* getManyAttributes(source: Iterable<XElement>, name: XName | null) {
  for (const element of source) {
    for (const attribute of getAttributes(element, name)) {
      yield attribute;
    }
  }
}
