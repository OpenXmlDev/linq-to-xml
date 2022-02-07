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
   * Returns the first element of this sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @returns The first element.
   * @throws If the (optionally filtered) sequence is empty.
   * @see {@linkcode last} and {@linkcode single}
   */
  first(predicate?: PredicateWithIndex<T>): T {
    return first(this.filterSequence(predicate));
  }

  /**
   * Returns the first element of this sequence or `undefined`, if the sequence is empty.
   *
   * When using this API, you should appreciate the differences between C# vs. JavaScript
   * and TypeScript regarding the default values used for different types, e.g., as
   * assigned by using the `default` keyword in C# or when not explicitly initializing
   * fields or variables in JavaScript.
   *
   * In C#, the default values are as follows:
   * - nullable (e.g., `string?`) and non-nullable (e.g.,`string`) reference types: `null`
   * - nullable value types (e.g., `int?`, `bool?`): `null`
   * - non-nullable value types (e.g., `int`, `bool`): `0` and `false`
   *
   * In JavaScript, the default value for uninitialized fields or variables is `undefined`
   * in all cases. In TypeScript, you must either explicitly allow `undefined` in the
   * declaration or use the non-null assertion operator (`!`) to assign `undefined`.
   *
   * Now, let's look at the signature of the well-known `FirstOrDefault()` extension method
   * in C# (based on the .NET 6 documentation, which uses `TSource` instead of `T`):
   *
   * ```csharp
   * public static T? FirstOrDefault<T>(this IEnumerable<T> source);
   * ```
   *
   * Based on our understanding of the default values, the most natural signature in
   * TypeScript is the following:
   *
   * ```typescript
   * firstOrDefault(): T | undefined;
   * ```
   *
   * On an abstract level, the C# and TypeScript counterparts behave in the same way.
   * For empty sequences, they both return the respective default values. On a concrete
   * level, however, the language-specific difference between the default values for
   * non-nullable value types in C# (e.g., `int`, `bool`) and the correspnding types
   * in TypeScript (e.g., `number`, `boolean`) is that:
   * - in C#, the default values are `0` and `false`, respectively; and
   * - in TypeScript, the default value is `undefined` in all cases.
   *
   * Should you want to receive a value other than `undefined` in case the sequence
   * is empty, you can use one of the overloads that allows you to specify a default
   * value:
   *
   * ```typescript
   * firstOrDefault(defaultValue: T): T;
   * firstOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;
   * ```
   *
   * @returns The first element of this sequence or `undefined`, if this sequence is empty.
   * @see {@linkcode lastOrDefault} and {@linkcode singleOrDefault}
   */
  firstOrDefault(): T | undefined;

  /**
   * Returns either (1) the first element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;`undefined`, if:
   * - this sequence is empty or
   * - the predicate returns `false` for all elements of this sequence.
   *
   * @example
   * ```typescript
   * const sequence = linqIterable([1, 2, 3, 4, 5]);
   * const nonNullValue = sequence.firstOrDefault((n) => n > 3); // 4
   * const defaultValue = sequence.firstOrDefault((n) => n > 5); // undefined
   * ```
   *
   * @param predicate The predicate.
   * @returns Either (1) the first element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;`undefined`.
   * @see {@linkcode lastOrDefault} and {@linkcode singleOrDefault}
   */
  firstOrDefault(predicate: PredicateWithIndex<T>): T | undefined;

  /**
   * Returns the first element of this sequence or the given default value, if this
   * sequence is empty.
   *
   * @remarks
   * Do not use this overload in case the elements of this sequence are functions.
   * See the section on [overloads](https://openxmldev.github.io/linq-to-xml/#overloads)
   * for details.
   *
   * @example
   * ```typescript
   * const sequence = linqIterable<number>([]);
   * const defaultValue = sequence.firstOrDefault(0); // 0
   * ```
   *
   * @param defaultValue The default value to be returned if this sequence is empty.
   * @returns The first element of this sequence or the given default value, if this
   * sequence is empty.
   * @see {@linkcode lastOrDefault} and {@linkcode singleOrDefault}
   */
  firstOrDefault(defaultValue: T): T;

  /**
   * Returns either (1) the first element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;the given default value, if:
   * - this sequence is empty or
   * - the predicate returns `false` for all elements of this sequence.
   *
   * @example
   * ```typescript
   * const sequence = linqIterable([1, 2, 3, 4, 5]);
   * const nonNullValue = sequence.firstOrDefault((n) => n > 3, 0); // 4
   * const defaultValue = sequence.firstOrDefault((n) => n > 5, 0); // 0
   * ```
   *
   * @param predicate The predicate.
   * @param defaultValue The default value.
   * @returns Either (1) the first element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;the given default value.
   * @see {@linkcode lastOrDefault} and {@linkcode singleOrDefault}
   */
  firstOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;

  firstOrDefault(
    predicateOrDefault?: PredicateWithIndex<T> | T,
    defaultValue?: T
  ): T | undefined {
    if (predicateOrDefault === undefined && defaultValue === undefined) {
      // firstOrDefault(): T | undefined;
      return firstOrDefault<T>()(this.source);
    } else if (predicateOrDefault !== undefined && defaultValue === undefined) {
      if (typeof predicateOrDefault === 'function') {
        // firstOrDefault(predicate: PredicateWithIndex<T>): T | undefined;
        return firstOrDefault<T>()(
          this.filterSequence(predicateOrDefault as PredicateWithIndex<T>)
        );
      } else {
        // firstOrDefault(defaultValue: T): T;
        return firstOrDefault(predicateOrDefault as T)(this.source);
      }
    } else {
      // firstOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;
      return firstOrDefault(defaultValue as T)(
        this.filterSequence(predicateOrDefault as PredicateWithIndex<T>)
      );
    }
  }

  /**
   * Returns the last element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @returns The last element.
   * @throws If the (optionally filtered) sequence is empty.
   * @see {@linkcode first} and {@linkcode single}
   */
  last(predicate?: PredicateWithIndex<T>): T {
    return last(this.filterSequence(predicate));
  }

  /**
   * Returns the last element of this sequence or `undefined`, if the sequence is empty.
   *
   * When using this API, you should appreciate the differences between C# vs. JavaScript
   * and TypeScript regarding the default values used for different types, e.g., as
   * assigned by using the `default` keyword in C# or when not explicitly initializing
   * fields or variables in JavaScript.
   *
   * In C#, the default values are as follows:
   * - nullable (e.g., `string?`) and non-nullable (e.g.,`string`) reference types: `null`
   * - nullable value types (e.g., `int?`, `bool?`): `null`
   * - non-nullable value types (e.g., `int`, `bool`): `0` and `false`
   *
   * In JavaScript, the default value for uninitialized fields or variables is `undefined`
   * in all cases. In TypeScript, you must either explicitly allow `undefined` in the
   * declaration or use the non-null assertion operator (`!`) to assign `undefined`.
   *
   * Now, let's look at the signature of the well-known `LastOrDefault()` extension method
   * in C# (based on the .NET 6 documentation, which uses `TSource` instead of `T`):
   *
   * ```csharp
   * public static T? LastOrDefault<T>(this IEnumerable<T> source);
   * ```
   *
   * Based on our understanding of the default values, the most natural signature in
   * TypeScript is the following:
   *
   * ```typescript
   * lastOrDefault(): T | undefined;
   * ```
   *
   * On an abstract level, the C# and TypeScript counterparts behave in the same way.
   * For empty sequences, they both return the respective default values. On a concrete
   * level, however, the language-specific difference between the default values for
   * non-nullable value types in C# (e.g., `int`, `bool`) and the correspnding types
   * in TypeScript (e.g., `number`, `boolean`) is that:
   * - in C#, the default values are `0` and `false`, respectively; and
   * - in TypeScript, the default value is `undefined` in all cases.
   *
   * Should you want to receive a value other than `undefined` in case the sequence
   * is empty, you can use one of the overloads that allows you to specify a default
   * value:
   *
   * ```typescript
   * lastOrDefault(defaultValue: T): T;
   * lastOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;
   * ```
   *
   * @returns The last element of this sequence or `undefined`, if this sequence is empty.
   * @see {@linkcode firstOrDefault} and {@linkcode singleOrDefault}
   */
  lastOrDefault(): T | undefined;

  /**
   * Returns either (1) the last element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;`undefined`, if:
   * - this sequence is empty or
   * - the predicate returns `false` for all elements of this sequence.
   *
   * @example
   * ```typescript
   * const sequence = linqIterable([1, 2, 3, 4, 5]);
   * const nonNullValue = sequence.lastOrDefault((n) => n > 3); // 4
   * const defaultValue = sequence.lastOrDefault((n) => n > 5); // undefined
   * ```
   *
   * @param predicate The predicate.
   * @returns Either (1) the last element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;`undefined`.
   * @see {@linkcode firstOrDefault} and {@linkcode singleOrDefault}
   */
  lastOrDefault(predicate: PredicateWithIndex<T>): T | undefined;

  /**
   * Returns the last element of this sequence or the given default value, if this
   * sequence is empty.
   *
   * @remarks
   * Do not use this overload in case the elements of this sequence are functions.
   * See the section on [overloads](https://openxmldev.github.io/linq-to-xml/#overloads)
   * for details.
   *
   * @example
   * ```typescript
   * const sequence = linqIterable<number>([]);
   * const defaultValue = sequence.lastOrDefault(0); // 0
   * ```
   *
   * @param defaultValue The default value to be returned if this sequence is empty.
   * @returns The last element of this sequence or the given default value, if this
   * sequence is empty.
   * @see {@linkcode firstOrDefault} and {@linkcode singleOrDefault}
   */
  lastOrDefault(defaultValue: T): T;

  /**
   * Returns either (1) the last element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;the given default value, if:
   * - this sequence is empty or
   * - the predicate returns `false` for all elements of this sequence.
   *
   * @example
   * ```typescript
   * const sequence = linqIterable([1, 2, 3, 4, 5]);
   * const nonNullValue = sequence.lastOrDefault((n) => n > 3, 0); // 4
   * const defaultValue = sequence.lastOrDefault((n) => n > 5, 0); // 0
   * ```
   *
   * @param predicate The predicate.
   * @param defaultValue The default value.
   * @returns Either (1) the last element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;the given default value.
   * @see {@linkcode firstOrDefault} and {@linkcode singleOrDefault}
   */
  lastOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;

  lastOrDefault(
    predicateOrDefault?: PredicateWithIndex<T> | T,
    defaultValue?: T
  ): T | undefined {
    if (predicateOrDefault === undefined && defaultValue === undefined) {
      // lastOrDefault(): T | undefined;
      return lastOrDefault<T>()(this.source);
    } else if (predicateOrDefault !== undefined && defaultValue === undefined) {
      if (typeof predicateOrDefault === 'function') {
        // lastOrDefault(predicate: PredicateWithIndex<T>): T | undefined;
        return lastOrDefault<T>()(
          this.filterSequence(predicateOrDefault as PredicateWithIndex<T>)
        );
      } else {
        // lastOrDefault(defaultValue: T): T;
        return lastOrDefault(predicateOrDefault as T)(this.source);
      }
    } else {
      // lastOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;
      return lastOrDefault(defaultValue as T)(
        this.filterSequence(predicateOrDefault as PredicateWithIndex<T>)
      );
    }
  }

  /**
   * Returns the single element of the sequence.
   * If a predicate is provided, filters the sequence based on the predicate.
   *
   * @param predicate The optional predicate.
   * @returns The single element.
   * @throws If the (optionally filtered) sequence does not contain exactly one element.
   * @see {@linkcode first} and {@linkcode last}
   */
  single(predicate?: PredicateWithIndex<T>): T {
    return single(this.filterSequence(predicate));
  }

  /**
   * Returns the single element of this sequence or `undefined`, if the sequence is empty.
   *
   * When using this API, you should appreciate the differences between C# vs. JavaScript
   * and TypeScript regarding the default values used for different types, e.g., as
   * assigned by using the `default` keyword in C# or when not explicitly initializing
   * fields or variables in JavaScript.
   *
   * In C#, the default values are as follows:
   * - nullable (e.g., `string?`) and non-nullable (e.g.,`string`) reference types: `null`
   * - nullable value types (e.g., `int?`, `bool?`): `null`
   * - non-nullable value types (e.g., `int`, `bool`): `0` and `false`
   *
   * In JavaScript, the default value for uninitialized fields or variables is `undefined`
   * in all cases. In TypeScript, you must either explicitly allow `undefined` in the
   * declaration or use the non-null assertion operator (`!`) to assign `undefined`.
   *
   * Now, let's look at the signature of the well-known `SingleOrDefault()` extension method
   * in C# (based on the .NET 6 documentation, which uses `TSource` instead of `T`):
   *
   * ```csharp
   * public static T? SingleOrDefault<T>(this IEnumerable<T> source);
   * ```
   *
   * Based on our understanding of the default values, the most natural signature in
   * TypeScript is the following:
   *
   * ```typescript
   * singleOrDefault(): T | undefined;
   * ```
   *
   * On an abstract level, the C# and TypeScript counterparts behave in the same way.
   * For empty sequences, they both return the respective default values. On a concrete
   * level, however, the language-specific difference between the default values for
   * non-nullable value types in C# (e.g., `int`, `bool`) and the correspnding types
   * in TypeScript (e.g., `number`, `boolean`) is that:
   * - in C#, the default values are `0` and `false`, respectively; and
   * - in TypeScript, the default value is `undefined` in all cases.
   *
   * Should you want to receive a value other than `undefined` in case the sequence
   * is empty, you can use one of the overloads that allows you to specify a default
   * value:
   *
   * ```typescript
   * singleOrDefault(defaultValue: T): T;
   * singleOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;
   * ```
   *
   * @returns The single element or `undefined`, if this sequence is empty.
   * @throws If this sequence contains more than one element.
   * @see {@linkcode firstOrDefault} and {@linkcode lastOrDefault}
   */
  singleOrDefault(): T | undefined;

  /**
   * Returns either (1) the single element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;`undefined`, if:
   * - this sequence is empty or
   * - the predicate returns `false` for all elements of this sequence.
   *
   * @param predicate The predicate.
   * @returns Either (1) the single element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;`undefined`, if the predicate returns `false` for all
   * elements.
   * @throws If there is more than one element for which the predicate returns `true`.
   * @see {@linkcode firstOrDefault} and {@linkcode lastOrDefault}
   */
  singleOrDefault(predicate: PredicateWithIndex<T>): T | undefined;

  /**
   * Returns the single element of this sequence or the given default value, if this
   * sequence is empty.
   *
   * @remarks
   * Do not use this overload in case the elements of this sequence are functions.
   * See the section on [overloads](https://openxmldev.github.io/linq-to-xml/#overloads)
   * for details.
   *
   * @param defaultValue The default value to be returned if this sequence is empty.
   * @returns The single element of this sequence or the given default value, if this
   * sequence is empty.
   * @throws If this sequence contains more than one element.
   * @see {@linkcode firstOrDefault} and {@linkcode lastOrDefault}
   */
  singleOrDefault(defaultValue: T): T;

  /**
   * Returns either (1) the single element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;the given default value, if:
   * - this sequence is empty or
   * - the predicate returns `false` for all elements of this sequence.
   *
   * @param predicate The predicate.
   * @param defaultValue The default value to be returned if this sequence is empty or
   * the predicate returns false for all elements.
   * @returns Either (1) the single element of this sequence for which the predicate
   * returns `true` or (2)&nbsp;the given default value, if the predicate returns
   * `false` for all elements.
   * @throws If there is more than one element for which the predicate returns `true`.
   * @see {@linkcode firstOrDefault} and {@linkcode lastOrDefault}
   */
  singleOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;

  singleOrDefault(
    predicateOrDefault?: PredicateWithIndex<T> | T,
    defaultValue?: T
  ): T | undefined {
    if (predicateOrDefault === undefined && defaultValue === undefined) {
      // singleOrDefault(): T | undefined;
      return singleOrDefault<T>()(this.source);
    } else if (predicateOrDefault !== undefined && defaultValue === undefined) {
      if (typeof predicateOrDefault === 'function') {
        // singleOrDefault(predicate: PredicateWithIndex<T>): T | undefined;
        return singleOrDefault<T>()(
          this.filterSequence(predicateOrDefault as PredicateWithIndex<T>)
        );
      } else {
        // singleOrDefault(defaultValue: T): T;
        return singleOrDefault(predicateOrDefault as T)(this.source);
      }
    } else {
      // singleOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T;
      return singleOrDefault(defaultValue as T)(
        this.filterSequence(predicateOrDefault as PredicateWithIndex<T>)
      );
    }
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
