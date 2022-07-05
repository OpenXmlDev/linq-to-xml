/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableFilter } from '@tsdotnet/linq/dist/IterableTransform.js';

/**
 * Applies a sequence of filters to a sequence of values.
 *
 * @param sequence The sequence of values on which to apply the filters.
 * @param filters The sequence of filters to apply.
 * @return The filtered sequence of values.
 */
export function filter<T>(
  sequence: Iterable<T>,
  filters: Iterable<IterableFilter<T>>
): Iterable<T> {
  for (const filter of filters) {
    sequence = filter(sequence);
  }

  return sequence;
}
