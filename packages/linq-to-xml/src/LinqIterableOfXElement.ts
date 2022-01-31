/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { IterableFilter } from '@tsdotnet/linq/dist/IterableTransform';
import applyFilters from '@tsdotnet/linq/dist/applyFilters';

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
  linqAttributes,
  linqNodes,
  LinqIterableBase,
  LinqIterableOfXAttribute,
  LinqIterableOfXNode,
  XElement,
  XName,
} from './internal';

/**
 * Provides additional methods specific to a `LinqIterable<XElement>` such as
 * `ancestors`, `descendants`, `elements`, and `attributes`.
 */
export class LinqIterableOfXElement extends LinqIterableBase<
  XElement,
  LinqIterableOfXElement
> {
  /**
   * Initializes a new instance with the given source sequence.
   *
   * @param source The source sequence.
   */
  constructor(source: Iterable<XElement>) {
    super(source, linqElements);
  }

  /**
   * Returns a filtered sequence.
   *
   * @param filters The filters to use.
   * @returns A filtered sequence.
   */
  override filter(
    ...filters: IterableFilter<XElement>[]
  ): LinqIterableOfXElement {
    return filters.length ? this.applyFilters(filters) : this;
  }

  /**
   * Returns a filtered sequence.
   *
   * @param filters The filters to use.
   * @returns A filtered sequence.
   */
  override applyFilters(
    filters: Iterable<IterableFilter<XElement>>
  ): LinqIterableOfXElement {
    return linqElements(applyFilters(this.source, filters));
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
    return linqElements(ancestors(name)(this.source));
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
    return linqElements(ancestorsAndSelf(name)(this.source));
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
    return linqAttributes(attributes(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of descendant nodes of such elements in document order.
   *
   * @returns The concatenated, flat sequence of descendant nodes in document
   * order.
   */
  descendantNodes(): LinqIterableOfXNode {
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
  descendantNodesAndSelf(): LinqIterableOfXNode {
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
  descendants(name?: XName | null): LinqIterableOfXElement {
    return linqElements(descendants(name)(this.source));
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
    return linqElements(descendantsAndSelf(name)(this.source));
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
    return linqElements(elements(name)(this.source));
  }

  /**
   * For the elements contained in this sequence, returns the concatenated
   * sequences of child nodes of such elements in document order.
   *
   * @returns The concatenated, flat sequence of child nodes in document
   * order.
   */
  nodes(): LinqIterableOfXNode {
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
