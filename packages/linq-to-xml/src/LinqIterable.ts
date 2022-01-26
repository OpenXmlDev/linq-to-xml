/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  PredicateWithIndex,
  SelectorWithIndex,
} from '@tsdotnet/common-interfaces';

import {
  IterableFilter,
  IterableTransform,
  IterableValueTransform,
} from '@tsdotnet/linq/dist/IterableTransform';

import { where } from '@tsdotnet/linq/dist/filters';

import applyFilters from '@tsdotnet/linq/dist/applyFilters';

import {
  all,
  any,
  count,
  first,
  firstOrDefault,
  last,
  lastOrDefault,
  single,
  singleOrDefault,
  toArray,
} from '@tsdotnet/linq/dist/resolutions';

import { groupBy, select, selectMany } from '@tsdotnet/linq/dist/transforms';

import {
  Grouping,
  GroupingResult,
} from '@tsdotnet/linq/dist/transforms/groupBy';

/**
 * A LINQ to XML iterable.
 */
export class LinqIterable<T> implements Iterable<T> {
  /**
   * Initializes a new instance.
   *
   * @param source The source sequence.
   */
  constructor(protected readonly source: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]();
  }

  /**
   * Filters this sequence, using zero or more filters.
   *
   * @param filters The filters to use.
   * @return A filtered sequence.
   */
  filter(...filters: IterableFilter<T>[]): LinqIterable<T> {
    return filters.length ? this.filters(filters) : this;
  }

  /**
   * Filters this sequence, using the given filters.
   *
   * @param filters The filters to use.
   * @return A filtered sequence.
   */
  filters(filters: Iterable<IterableFilter<T>>): LinqIterable<T> {
    return new LinqIterable<T>(applyFilters(this.source, filters));
  }

  /**
   * Transforms this sequence, using the given transformation.
   *
   * @param transformation The transformation to use.
   * @return A transformed sequence.
   */
  transform<TResult>(
    transformation: IterableValueTransform<T, TResult>
  ): LinqIterable<TResult> {
    return new LinqIterable(transformation(this.source));
  }

  /**
   * Applies the given resolution to this sequence.
   *
   * @param resolution The resolution to use.
   * @return The resolved value.
   */
  resolve<TResult>(resolution: IterableTransform<T, TResult>): TResult {
    return resolution(this.source);
  }

  //
  // Resolutions
  //

  /**
   * Returns true if the predicate is true for every element in the sequence or
   * if the sequence is empty.
   *
   * @param predicate The predicate.
   */
  all(predicate: PredicateWithIndex<T>): boolean {
    return all(predicate)(this.source);
  }

  /**
   * If a predicate is provided, returns true if the predicate is true for any
   * element in the sequence.
   * If no predicate is provided, returns true if the sequence has any entries.
   *
   * @param predicate The optional predicate.
   */
  any(predicate?: PredicateWithIndex<T>): boolean {
    return any(predicate)(this.source);
  }

  /**
   * Returns the number of elements in the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The number of elements in the sequence.
   */
  count(predicate?: PredicateWithIndex<T>): number {
    return predicate
      ? count(where(predicate)(this.source))
      : count(this.source);
  }

  /**
   * Returns the first element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The first element.
   * @throws If the (optionally filtered) sequence is empty.
   */
  first(predicate?: PredicateWithIndex<T>): T {
    return first(this.filterSequence(predicate));
  }

  /**
   * Returns the first element of the sequence or `null`, if the sequence is empty.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The first element or `null`.
   */
  firstOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return firstOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  /**
   * Returns the last element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The last element.
   * @throws If the (optionally filtered) sequence is empty.
   */
  last(predicate?: PredicateWithIndex<T>): T {
    return last(this.filterSequence(predicate));
  }

  /**
   * Returns the last element of the sequence or `null`, if the sequence is empty.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The last element or `null`.
   */
  lastOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return lastOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  /**
   * Returns the single element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The single element.
   * @throws If the (optionally filtered) sequence does not contain exactly one element.
   */
  single(predicate?: PredicateWithIndex<T>): T {
    return single(this.filterSequence(predicate));
  }

  /**
   * Returns the single element of the sequence or `null`, if the sequence is empty.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @return The single element or `null`.
   * @throws If the (optionally filtered) sequence contains more than one element.
   */
  singleOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return singleOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  /**
   * Returns all the elements in the sequence as an array.
   */
  toArray(): T[] {
    return toArray(this.source);
  }

  private filterSequence(predicate?: PredicateWithIndex<T>): Iterable<T> {
    return predicate ? where(predicate)(this.source) : this.source;
  }

  //
  // Transformations
  //

  /**
   * Groups elements by selected key.
   *
   * @param keySelector Selects the grouping keys.
   * @return The grouped elements.
   */
  groupBy<TKey>(
    keySelector: SelectorWithIndex<T, TKey>
  ): LinqIterable<LinqIterableGrouping<TKey, T>> {
    return new LinqIterable(
      this.transform(groupBy(keySelector)).select(
        (g: GroupingResult<TKey, T>) => new LinqIterableGrouping<TKey, T>(g)
      )
    );
  }

  /**
   * Projects, or maps, each element of a sequence into a new form.
   *
   * @param selector The selector used to project, or map, the elements.
   * @return The projected, or mapped, sequence.
   */
  select<TResult>(
    selector: SelectorWithIndex<T, TResult>
  ): LinqIterable<TResult> {
    return new LinqIterable<TResult>(select(selector)(this.source));
  }

  /**
   * Merges the selected sequences into one flat sequence.
   *
   * @param selector The selector.
   * @return The merged, flat sequence.
   */
  selectMany<TResult>(
    selector: SelectorWithIndex<T, Iterable<TResult>>
  ): LinqIterable<TResult> {
    return new LinqIterable<TResult>(selectMany(selector)(this.source));
  }
}

/**
 * Represents a grouping of sequence elements.
 */
export class LinqIterableGrouping<TKey, T>
  extends LinqIterable<T>
  implements Grouping<TKey, T>
{
  readonly key: TKey;

  constructor(grouping: GroupingResult<TKey, T>) {
    super(grouping.elements);
    this.key = grouping.key;
  }
}

/**
 * Converts any `Iterable<T>` into a LINQ-style iterable.
 *
 * @param source The source `Iterable<T>`.
 * @returns A `LinqIterable<T>` instance.
 */
export function linqIterable<T>(source: Iterable<T>): LinqIterable<T> {
  return source instanceof LinqIterable ? source : new LinqIterable(source);
}
