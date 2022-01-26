/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform';
import { getAttributes, XAttribute, XElement, XName } from '../internal';

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
