/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableValueTransform } from '@tsdotnet/linq/dist/IterableTransform';
import { XContainer, XElement, XName, XNode } from '../internal';

export function descendants<T extends XContainer>(
  name?: XName | null
): IterableValueTransform<T, XElement> {
  return function (source: Iterable<T>): Iterable<XElement> {
    return name !== null
      ? getManyDescendants(source, name ?? null, false)
      : XElement.emptySequence;
  };
}

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
