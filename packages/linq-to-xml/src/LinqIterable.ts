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

import applyFilters from '@tsdotnet/linq/dist/applyFilters';

import {
  defaultIfEmpty,
  skip,
  skipLast,
  skipWhile,
  take,
  takeLast,
  takeWhile,
  where,
} from '@tsdotnet/linq/dist/filters';

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
 * Abstract base class for LINQ iterables.
 *
 * @remarks
 * This abstract class serves as the generic base class for all LINQ iterables
 * provided by this library. The {@linkcode LinqIterable<T>} class just derives
 * from this class and adds no further features. Other classes such as
 * {@linkcode LinqElements} inherit from this class and provide further methods.
 * The generics-based pattern used in this case means that all filter methods,
 * returning a `TLinq`, for example, will return instances of the subclasses.
 *
 * @typeParam T The type of the elements of the sequence.
 * @typeParam TLinq The type of the LINQ iterable returned by filters.
 */
export abstract class LinqIterableBase<
  T,
  TLinq extends LinqIterableBase<T, TLinq>
> implements Iterable<T>
{
  /**
   * Initializes a new instance with the given sequence.
   *
   * @param source The source sequence.
   */
  constructor(
    protected readonly source: Iterable<T>,
    protected readonly create: (source: Iterable<T>) => TLinq
  ) {}

  /**
   * Returns the sequence of elements represented by this `LinqIterable<T>`.
   *
   * @returns The sequence of elements represented by this `LinqIterable<T>`.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]();
  }

  /**
   * Filters this sequence, using zero or more filters.
   *
   * @param filters The filters to use.
   * @returns A filtered sequence.
   */
  filter(...filters: IterableFilter<T>[]): TLinq {
    return filters.length
      ? this.applyFilters(filters)
      : (this as unknown as TLinq);
  }

  /**
   * Filters this sequence, using the given filters.
   *
   * @param filters The filters to use.
   * @returns A filtered sequence.
   */
  applyFilters(filters: Iterable<IterableFilter<T>>): TLinq {
    return this.create(applyFilters(this.source, filters));
  }

  /**
   * Transforms this sequence, using the given transformation.
   *
   * @transform TResult The type of the elements of the transformed sequence.
   * @param transformation The transformation to use.
   * @returns A transformed sequence.
   */
  transform<TResult>(
    transformation: IterableValueTransform<T, TResult>
  ): LinqIterable<TResult> {
    return linqIterable(transformation(this.source));
  }

  /**
   * Applies the given resolution to this sequence.
   *
   * @typeParam TResult The type of the result of the resolution.
   * @param resolution The resolution to use.
   * @returns The resolved value.
   */
  resolve<TResult>(resolution: IterableTransform<T, TResult>): TResult {
    return resolution(this.source);
  }

  //
  // Filters
  //

  /**
   * Returns the elements of the specified sequence or the default value if the
   * sequence is empty.
   *
   * @param defaultValue The default value to be returned if this sequence is empty.
   * @returns The elements of the specified sequence or the default value if the sequence is empty.
   */
  defaultIfEmpty(defaultValue: T): TLinq {
    return this.create(defaultIfEmpty(defaultValue)(this.source));
  }

  /**
   * Returns a new sequence that contains the elements from this sequence with
   * the first `count` elements omitted.
   *
   * @param count The number of elements to be omitted.
   * @returns A new sequence that contains the elements from this sequence with
   * the first `count` elements omitted.
   */
  skip(count: number): TLinq {
    return this.create(skip<T>(count)(this.source));
  }

  /**
   * Returns a new sequence that contains the elements from this sequence with
   * the last `count` elements omitted.
   *
   * @param count The number of elements to be omitted.
   * @returns A new sequence that contains the elements from this sequence with
   * the first `count` elements omitted.
   */
  skipLast(count: number): TLinq {
    return this.create(skipLast<T>(count)(this.source));
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true
   * and then returns the remaining elements.
   *
   * @param predicate The specified condition.
   * @returns A new sequence with the remaining elements.
   */
  skipWhile(predicate: PredicateWithIndex<T>): TLinq {
    return this.create(skipWhile<T>(predicate)(this.source));
  }

  /**
   * Returns a new sequence that contains the specified number of contiguous
   * elements from the start of this sequence.
   *
   * @param count The number of elements to take.
   * @returns a new sequence that contains the specified number of contiguous
   * elements from the start of this sequence.
   */
  take(count: number): TLinq {
    return this.create(take<T>(count)(this.source));
  }

  /**
   * Returns a new sequence that contains the specified number of contiguous
   * elements from the end of this sequence.
   *
   * @param count The number of elements to take.
   * @returns A new sequence that contains the specified number of contiguous
   * elements from the end of this sequence.
   */
  takeLast(count: number): TLinq {
    return this.create(takeLast<T>(count)(this.source));
  }

  /**
   * Returns a new sequence that contains elements from this sequence that occur
   * before the element at which the specified condition is false.
   *
   * @param predicate The specified condition.
   * @returns A new sequence that contains elements from this sequence that occur
   * before the element at which the specified condition is false.
   */
  takeWhile(predicate: PredicateWithIndex<T>): TLinq {
    return this.create(takeWhile<T>(predicate)(this.source));
  }

  /**
   * Filters the sequence using the given predicate.
   *
   * @param predicate The predicate.
   * @returns The filtered sequence.
   */
  where(predicate: PredicateWithIndex<T>): TLinq {
    return this.create(where(predicate)(this.source));
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
   * @returns The number of elements in the sequence.
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
   * @returns The first element.
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
   * @returns The first element or `null`.
   */
  firstOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return firstOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  /**
   * Returns the last element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @returns The last element.
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
   * @returns The last element or `null`.
   */
  lastOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return lastOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  /**
   * Returns the single element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @returns The single element.
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
   * @returns The single element or `null`.
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

  /** @internal */
  private filterSequence(predicate?: PredicateWithIndex<T>): Iterable<T> {
    return predicate ? where(predicate)(this.source) : this.source;
  }

  //
  // Transformations
  //

  /**
   * Groups elements by selected key.
   *
   * @typeParam TKey The type of the grouping keys.
   * @param keySelector Selects the grouping keys.
   * @returns The grouped elements.
   */
  groupBy<TKey>(
    keySelector: SelectorWithIndex<T, TKey>
  ): LinqIterable<LinqIterableGrouping<TKey, T>> {
    return this.transform(groupBy(keySelector)).select(
      (g: GroupingResult<TKey, T>) => new LinqIterableGrouping<TKey, T>(g)
    );
  }

  /**
   * Projects, or maps, each element of a sequence into a new form.
   *
   * @typeParam TResult The type of the elements of the projected, or mapped, sequence.
   * @param selector The selector used to project, or map, the elements.
   * @returns The projected, or mapped, sequence.
   */
  select<TResult>(
    selector: SelectorWithIndex<T, TResult>
  ): LinqIterable<TResult> {
    return linqIterable<TResult>(select(selector)(this.source));
  }

  /**
   * Merges the selected sequences into one flat sequence.
   *
   * @typeParam TResult The type of the elements of the flat sequence.
   * @param selector The selector.
   * @returns The merged, flat sequence.
   */
  selectMany<TResult>(
    selector: SelectorWithIndex<T, Iterable<TResult>>
  ): LinqIterable<TResult> {
    return linqIterable<TResult>(selectMany(selector)(this.source));
  }
}

/**
 * A LINQ iterable.
 *
 * @typeParam T The type of the elements of the sequence.
 */
export class LinqIterable<T> extends LinqIterableBase<T, LinqIterable<T>> {
  constructor(source: Iterable<T>) {
    super(source, linqIterable);
  }
}

/**
 * Represents a grouping of sequence elements.
 *
 * @typeParam TKey The type of the grouping keys.
 * @typeParam T The type of the grouped elements.
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
 * @typeParam T The type of the elements of the `LinqIterable<T>`.
 * @param source The source `Iterable<T>`.
 * @returns A `LinqIterable<T>` instance.
 */
export function linqIterable<T>(source: Iterable<T>): LinqIterable<T> {
  return source instanceof LinqIterable ? source : new LinqIterable(source);
}
