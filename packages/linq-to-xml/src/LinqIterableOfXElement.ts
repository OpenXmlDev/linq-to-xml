/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { PredicateWithIndex } from '@tsdotnet/common-interfaces';
import { IterableFilter } from '@tsdotnet/linq/dist/IterableTransform';
import applyFilters from '@tsdotnet/linq/dist/applyFilters';

import {
  skip,
  skipLast,
  skipUntil,
  skipWhile,
  take,
  takeLast,
  takeUntil,
  takeWhile,
  where,
} from '@tsdotnet/linq/dist/filters';

import { XElement, XName } from './internal';

import {
  ancestors,
  ancestorsAndSelf,
  attributes,
  descendantNodes,
  descendantNodesAndSelf,
  descendants,
  descendantsAndSelf,
  elements,
  nodes,
  remove,
} from './transformations';

import {
  LinqIterable,
  LinqIterableOfXAttribute,
  LinqIterableOfXNode,
} from './internal';

/**
 * Provides additional methods specific to a `LinqIterable<XElement>` such as:
 * - `ancestors`, `descendants`, `elements`, and `attributes`;
 * - `skip`, `skipWhile`, `take`, `takeWhile`, and `where`; and
 * - `filter` and `filters`.
 *
 * @remarks
 *
 * The `filter` and `filters` methods can be used to filter sequences of
 * `XElement` instances, using any appropriate `IterableFilter<XElement>`
 * (or `IterableValueTransform<XElement, XElement>`). Therefore, those
 * methods provide an easy-to-use extension mechanism.
 */
export class LinqIterableOfXElement extends LinqIterable<XElement> {
  /**
   * Returns a filtered sequence.
   *
   * @param filters The filters to use.
   * @returns A filtered sequence.
   */
  override filter(
    ...filters: IterableFilter<XElement>[]
  ): LinqIterableOfXElement {
    return filters.length ? this.filters(filters) : this;
  }

  /**
   * Returns a filtered sequence.
   *
   * @param filters The filters to use.
   * @returns A filtered sequence.
   */
  override filters(
    filters: Iterable<IterableFilter<XElement>>
  ): LinqIterableOfXElement {
    return new LinqIterableOfXElement(applyFilters(this.source, filters));
  }

  //
  // LINQ to XML Transformations
  //

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of ancestors of such elements in reverse document order.
   * If a name is provided, the resulting sequence contains only those ancestors
   * having a matching name.
   *
   * @param name The optional name used to filter the sequence of ancestors.
   * @returns A flat sequence of ancestors in reverse document order.
   */
  ancestors(name?: XName | null): LinqIterableOfXElement {
    return new LinqIterableOfXElement(ancestors(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of ancestors of such elements, including the elements themselves,
   * in reverse document order.
   * If a name is provided, the resulting sequence contains only those ancestors
   * having a matching name.
   *
   * @param name The optional name used to filter the sequence of ancestors.
   * @returns A flat sequence of ancestors, including the elements, in reverse
   * document order.
   */
  ancestorsAndSelf(name?: XName | null): LinqIterableOfXElement {
    return new LinqIterableOfXElement(ancestorsAndSelf(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated sequences
   * of attributes of such elements. If a name is provided, the resulting sequence
   * contains only those attributes having a matching name.
   *
   * @param name The optional name used to filter the sequence of attributes.
   * @returns A function that will return a flat sequence of attributes.
   */
  attributes(name?: XName | null): LinqIterableOfXAttribute {
    return new LinqIterableOfXAttribute(attributes(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendant nodes of such elements in document order.
   *
   * @returns The concatenated, flat sequence of descendant nodes in document
   * order.
   */
  descendantNodes(): LinqIterableOfXNode {
    return new LinqIterableOfXNode(descendantNodes(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendant nodes of such elements, including the elements
   * themselves, in document order.
   *
   * @returns The concatenated, flat sequence of descendant nodes, including
   * the source elements, in document order.
   */
  descendantNodesAndSelf(): LinqIterableOfXNode {
    return new LinqIterableOfXNode(descendantNodesAndSelf(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendants of such elements in document order.
   * If a name is provided, the resulting sequence contains only those
   * descendants having a matching name.
   *
   * @returns The concatenated, flat sequence of descendant nodes in document
   * order.
   */
  descendants(name?: XName | null): LinqIterableOfXElement {
    return new LinqIterableOfXElement(descendants(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendants of such elements, including the elements
   * themselves, in document order.
   * If a name is provided, the resulting sequence contains only those
   * elements and descendants having a matching name.
   *
   * @returns The concatenated, flat sequence of descendants, including
   * the source elements, in document order.
   */
  descendantsAndSelf(name?: XName | null): LinqIterableOfXElement {
    return new LinqIterableOfXElement(descendantsAndSelf(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of child elements of such elements in document order.
   *
   * If a name is provided, the resulting sequence contains only those
   * child elements having a matching name.
   *
   * @returns The concatenated, flat sequence of child elements in document
   * order.
   */
  elements(name?: XName | null): LinqIterableOfXElement {
    return new LinqIterableOfXElement(elements(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of child nodes of such elements in document order.
   *
   * @returns The concatenated, flat sequence of child nodes in document
   * order.
   */
  nodes(): LinqIterableOfXNode {
    return new LinqIterableOfXNode(nodes(this.source));
  }

  /**
   * Removes each element contained in this sequence from its parent
   * `XContainer`.
   */
  remove(): void {
    remove(this.source);
  }

  //
  // LINQ Filters
  //

  skip(count: number): LinqIterableOfXElement {
    return new LinqIterableOfXElement(skip<XElement>(count)(this.source));
  }

  skipLast(count: number): LinqIterableOfXElement {
    return new LinqIterableOfXElement(skipLast<XElement>(count)(this.source));
  }

  skipUntil(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement {
    return new LinqIterableOfXElement(
      skipUntil<XElement>(predicate)(this.source)
    );
  }

  skipWhile(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement {
    return new LinqIterableOfXElement(
      skipWhile<XElement>(predicate)(this.source)
    );
  }

  take(count: number): LinqIterableOfXElement {
    return new LinqIterableOfXElement(take<XElement>(count)(this.source));
  }

  takeLast(count: number): LinqIterableOfXElement {
    return new LinqIterableOfXElement(takeLast<XElement>(count)(this.source));
  }

  takeUntil(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement {
    return new LinqIterableOfXElement(
      takeUntil<XElement>(predicate)(this.source)
    );
  }

  takeWhile(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement {
    return new LinqIterableOfXElement(
      takeWhile<XElement>(predicate)(this.source)
    );
  }

  /**
   * Filters the sequence using the given predicate.
   *
   * @param predicate The predicate.
   * @returns The filtered sequence.
   */
  where(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement {
    return new LinqIterableOfXElement(where(predicate)(this.source));
  }
}

/**
 * Converts an `Iterable<XElement>` into a LINQ-style iterable.
 *
 * @param source The source `Iterable<XElement>`.
 * @returns A `LinqIterableOfXElement` instance.
 */
export function linqElements(
  source: Iterable<XElement>
): LinqIterableOfXElement {
  return source instanceof LinqIterableOfXElement
    ? source
    : new LinqIterableOfXElement(source);
}
