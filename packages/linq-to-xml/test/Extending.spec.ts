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
} from '@tsdotnet/linq/dist/IterableTransform.js';

import { skip, take, where } from '@tsdotnet/linq/dist/filters.js';

import { select } from '@tsdotnet/linq/dist/transforms.js';

import {
  first,
  firstOrDefault,
  single,
  singleOrDefault,
} from '@tsdotnet/linq/dist/resolutions.js';

import { filter } from '../src/transformations/filter.js';

//
// First Layer: Most Basic Methods
//

/**
 * This is the base class that only provides the most basic methods.
 */
abstract class LinqBase<T, TLinq extends LinqBase<T, TLinq>>
  implements Iterable<T>
{
  constructor(
    protected readonly source: Iterable<T>,
    protected readonly create: (source: Iterable<T>) => TLinq
  ) {}

  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]();
  }

  filter(...filters: IterableFilter<T>[]): TLinq {
    return this.filters(filters);
  }

  filters(filters: Iterable<IterableFilter<T>>): TLinq {
    return this.create(filter(this.source, filters));
  }

  /**
   * This is the only LinqBase method that would have to be overridden in
   * this pattern.
   */
  transform<TResult>(
    transform: IterableValueTransform<T, TResult>
  ): Linq<TResult> {
    return linq(transform(this.source));
  }

  resolve<TResolution>(
    resolve: IterableTransform<T, TResolution>
  ): TResolution {
    return resolve(this.source);
  }
}

/**
 * This is the concrete subclass that provides exactly the methods LinqBase.
 */
class Linq<T> extends LinqBase<T, Linq<T>> {
  constructor(source: Iterable<T>) {
    super(source, linq);
  }
}

/**
 * This is the factory function that already exists.
 */
function linq<T>(source: Iterable<T>): Linq<T> {
  return source instanceof Linq ? source : new Linq(source);
}

//
// Second Layer: Additional Methods
//

/**
 * This is a base class that provides convenience methods on top of the basic
 * methods provided by LinqBase<T, TLinq>.
 */
abstract class LinqExtendedBase<
  T,
  TLinq extends LinqExtendedBase<T, TLinq>
> extends LinqBase<T, TLinq> {
  //
  // Base class methods that need to be overridden
  //

  override transform<TResult>(
    transform: IterableValueTransform<T, TResult>
  ): LinqExtended<TResult> {
    return linqExtended(transform(this.source));
  }

  //
  // Additional methods: Filters
  //

  /**
   * Assume this is one of the common filters that are explicitly provided
   * by LinqExtended<T>.
   *
   * Owing to its generic nature, this method does not have to be overridden.
   */
  skip(count: number): TLinq {
    return this.create(skip<T>(count)(this.source));
  }

  /**
   * Assume this is one of the common filters that are explicitly provided
   * by LinqExtended<T>.
   *
   * Owing to its generic nature, this method does not have to be overridden.
   */
  take(count: number): TLinq {
    return this.create(take<T>(count)(this.source));
  }

  //
  // Additional methods: Transformations
  // Transformations are candidates for being overridden in subclasses.
  //

  select<TResult>(
    selector: SelectorWithIndex<T, TResult>
  ): LinqExtended<TResult> {
    return this.transform(select(selector));
  }

  //
  // Additional methods: Resolutions
  // Resolutions do not need to be overridden by subclasses.
  //

  /**
   * Assume this is one of the common resolutions that are explicitly provided
   * by LinqExtended<T>.
   */
  first(predicate?: PredicateWithIndex<T>): T {
    return first(this.filterSequence(predicate));
  }

  /**
   * Assume this is one of the common resolutions that are explicitly provided
   * by LinqExtended<T>.
   *
   * Note that firstOrDefault() should take an optional predicate while the
   * defaultIfEmpty() transformation can be used instead of passing the default
   * value as a parameter to firstOrDefault(). At least in my coding practice,
   * a default value is very rarely provided.
   */
  firstOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return firstOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  //
  // Helper methods
  //

  protected filterSequence(predicate?: PredicateWithIndex<T>): Iterable<T> {
    return predicate ? where(predicate)(this.source) : this.source;
  }
}

/**
 * This is a concrete subclass that provides exactly the methods of its parent.
 */
class LinqExtended<T> extends LinqExtendedBase<T, LinqExtended<T>> {
  constructor(source: Iterable<T>) {
    super(source, linqExtended);
  }
}

/**
 * This is the factory function that already exists.
 */
function linqExtended<T>(source: Iterable<T>): LinqExtended<T> {
  return source instanceof LinqExtended ? source : new LinqExtended(source);
}

//
// Third Layer: Custom Methods
//

/**
 * This is a second concrete subclass of LinqExtendedBase that provides additional
 * methods on top of its parent.
 */
class LinqIterable<T> extends LinqExtendedBase<T, LinqIterable<T>> {
  constructor(source: Iterable<T>) {
    super(source, linqIterable);
  }

  //
  // Base class methods that need to be overridden
  //

  override transform<TResult>(
    transform: IterableValueTransform<T, TResult>
  ): LinqIterable<TResult> {
    return linqIterable(transform(this.source));
  }

  override select<TResult>(
    selector: SelectorWithIndex<T, TResult>
  ): LinqIterable<TResult> {
    return this.transform(select(selector));
  }

  //
  // Additional methods
  //

  /**
   * Assume this is one of the methods provided on top of what LinqExtended<T>
   * already provides.
   */
  single(predicate?: PredicateWithIndex<T>): T {
    return single(this.filterSequence(predicate));
  }

  /**
   * Assume this is one of the methods provided on top of what LinqExtended<T>
   * already provides.
   */
  singleOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return singleOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }
}

/**
 * This is the factory function that already exists.
 */
function linqIterable<T>(source: Iterable<T>): LinqIterable<T> {
  return source instanceof LinqIterable ? source : new LinqIterable(source);
}

//
// Tests
//

test('LinqExtendedBase methods return instances of LinqIterable', () => {
  const sequence: LinqIterable<number> = linqIterable([1, 2, 3, 4, 5]);

  // Use the skip() and take() methods implemented by LinqExtendedBase<T, TLinq>
  // to filter the sequence. Note that filteredSequence is an instance of
  // LinqIterable<T>!
  const filteredSequence = sequence.skip(2).take(1);
  expect(filteredSequence).toBeInstanceOf(LinqIterable);

  // Use a resolution implemented by LinqIterable<T> to resolve a value.
  const resolution = filteredSequence.single();
  expect(resolution).toBe(3);
});

test('LinqBase methods return instances of LinqIterable', () => {
  const sequence: LinqIterable<number> = linqIterable([1, 2, 3, 4, 5]);

  // Use the filter() method implemented by LinqBase<T, TLinq> to filter the
  // sequence. Note that filteredSequence is an instance of LinqIterable<T>!
  const filteredSequence = sequence.filter(skip(2), take(1));
  expect(filteredSequence).toBeInstanceOf(LinqIterable);

  // Use a resolution implemented by LinqIterable<T> to resolve a value.
  const resolution = filteredSequence.single();
  expect(resolution).toBe(3);
});
