/**
 * @author Thomas Barnekow
 * @license MIT
 */

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
} from './transformations/index.js';

import {
  linqAttributes,
  linqNodes,
  LinqIterableBase,
  LinqAttributes,
  LinqNodes,
  XElement,
  XName,
} from './internal.js';

/**
 * Abstract base class that provides additional methods specific to a `LinqIterable<XElement>`
 * such as `ancestors`, `attributes`, `descendants`, `elements`, and `remove`.
 *
 * @remarks
 * Implementations desiring to extend the `LinqIterable<XElement>`-related functionality
 * should inherit from this class rather than `LinqElements`. However, implementations
 * should follow the same pattern as used for `LinqElements` for concrete subclasses.
 */
export abstract class LinqElementsBase<
  TLinq extends LinqElementsBase<TLinq>
> extends LinqIterableBase<XElement, TLinq> {
  /**
   * Initializes a new instance with the given source sequence.
   *
   * @param source The source sequence.
   */
  constructor(
    source: Iterable<XElement>,
    create: (source: Iterable<XElement>) => TLinq
  ) {
    super(source, create);
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
  ancestors(name?: XName | null): TLinq {
    return this.create(ancestors(name)(this.source));
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
  ancestorsAndSelf(name?: XName | null): TLinq {
    return this.create(ancestorsAndSelf(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated sequences
   * of attributes of such elements. If a name is provided, the resulting sequence
   * contains only those attributes having a matching name.
   *
   * @param name The optional name used to filter the sequence of attributes.
   * @returns A function that will return a flat sequence of attributes.
   */
  attributes(name?: XName | null): LinqAttributes {
    return linqAttributes(attributes(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendant nodes of such elements in document order.
   *
   * @returns The concatenated, flat sequence of descendant nodes in document
   * order.
   */
  descendantNodes(): LinqNodes {
    return linqNodes(descendantNodes(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendant nodes of such elements, including the elements
   * themselves, in document order.
   *
   * @returns The concatenated, flat sequence of descendant nodes, including
   * the source elements, in document order.
   */
  descendantNodesAndSelf(): LinqNodes {
    return linqNodes(descendantNodesAndSelf(this.source));
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
  descendants(name?: XName | null): TLinq {
    return this.create(descendants(name)(this.source));
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
  descendantsAndSelf(name?: XName | null): TLinq {
    return this.create(descendantsAndSelf(name)(this.source));
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
  elements(name?: XName | null): TLinq {
    return this.create(elements(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of child nodes of such elements in document order.
   *
   * @returns The concatenated, flat sequence of child nodes in document
   * order.
   */
  nodes(): LinqNodes {
    return linqNodes(nodes(this.source));
  }

  /**
   * Removes each element contained in this sequence from its parent
   * `XContainer`.
   */
  remove(): void {
    remove(this.source);
  }
}

/**
 * Provides additional methods specific to a `LinqIterable<XElement>` such as
 * `ancestors`, `attributes`, `descendants`, `elements`, and `remove`.
 */
export class LinqElements extends LinqElementsBase<LinqElements> {
  constructor(source: Iterable<XElement>) {
    super(source, linqElements);
  }
}

/**
 * Converts an `Iterable<XElement>` into a LINQ-style iterable.
 *
 * @param source The source `Iterable<XElement>`.
 * @returns A `LinqElements` instance.
 */
export function linqElements(source: Iterable<XElement>): LinqElements {
  return source instanceof LinqElements ? source : new LinqElements(source);
}
