/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  PredicateWithIndex,
  SelectorWithIndex,
} from '@tsdotnet/common-interfaces';

import { where } from '@tsdotnet/linq/dist/filters';

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
import { GroupingResult } from '@tsdotnet/linq/dist/transforms/groupBy';

import {
  getAncestors,
  getAttributes,
  getNodes,
  XAttribute,
  XContainer,
  XElement,
  XName,
  XNode,
} from './internal';

/**
 * Defines common Linq-inspired operations.
 */
export interface ILinqIterable<T> extends Iterable<T> {
  //
  // Resolutions
  //

  all(predicate: PredicateWithIndex<T>): boolean;
  any(predicate?: PredicateWithIndex<T>): boolean;
  count(predicate?: PredicateWithIndex<T>): number;
  first(predicate?: PredicateWithIndex<T>): T;
  firstOrDefault(predicate?: PredicateWithIndex<T>): T | null;
  last(predicate?: PredicateWithIndex<T>): T;
  lastOrDefault(predicate?: PredicateWithIndex<T>): T | null;
  single(predicate?: PredicateWithIndex<T>): T;
  singleOrDefault(predicate?: PredicateWithIndex<T>): T | null;
  toArray(): T[];

  //
  // Transformations
  //

  groupBy<TKey>(
    keySelector: SelectorWithIndex<T, TKey>
  ): ILinqIterable<GroupingResult<TKey, T>>;

  select<TSelect>(
    selector: SelectorWithIndex<T, TSelect>
  ): ILinqIterable<TSelect>;

  selectMany<TSelect>(
    selector: SelectorWithIndex<T, Iterable<TSelect>>
  ): ILinqIterable<TSelect>;
}

/**
 * Defines additional operations for ILinqIterable<XAttribute>.
 */
export interface ILinqIterableOfXAttribute extends ILinqIterable<XAttribute> {
  remove(): void;
  where(predicate: PredicateWithIndex<XAttribute>): ILinqIterableOfXAttribute;
}

/**
 * Defines additional operations for ILinqIterable<XNode>.
 */
export interface ILinqIterableOfXNode extends ILinqIterable<XNode> {
  ancestors(name?: XName): ILinqIterableOfXElement;
  remove(): void;
  where(predicate: PredicateWithIndex<XNode>): ILinqIterableOfXNode;
}

/**
 * Defines additional operations for ILinqIterable<XElement>.
 */
export interface ILinqIterableOfXElement extends ILinqIterable<XElement> {
  ancestors(name?: XName): ILinqIterableOfXElement;
  ancestorsAndSelf(name?: XName): ILinqIterableOfXElement;
  attributes(name?: XName): ILinqIterableOfXAttribute;
  descendantNodes(): ILinqIterableOfXNode;
  descendantNodesAndSelf(): ILinqIterableOfXNode;
  descendants(name?: XName | null): ILinqIterableOfXElement;
  descendantsAndSelf(name?: XName): ILinqIterableOfXElement;
  elements(name?: XName | null): ILinqIterableOfXElement;
  nodes(): ILinqIterableOfXNode;
  remove(): void;
  where(predicate: PredicateWithIndex<XElement>): ILinqIterableOfXElement;
}

/**
 * Base class that provides common Linq-inspired features:
 * - "resolutions" such as `first()`, `last()`, and `single()`, and
 * - "transformations" such as `groupBy()`, `select()`, and `selectMany()`.
 */
export class LinqIterable<T> implements ILinqIterable<T> {
  constructor(protected source: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]();
  }

  //
  // Resolutions
  //

  all(predicate: PredicateWithIndex<T>): boolean {
    return all(predicate)(this.source);
  }

  any(predicate?: PredicateWithIndex<T>): boolean {
    return any(predicate)(this.source);
  }

  count(predicate?: PredicateWithIndex<T>): number {
    return count(this.filterSequence(predicate));
  }

  first(predicate?: PredicateWithIndex<T>): T {
    return first(this.filterSequence(predicate));
  }

  firstOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return firstOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  last(predicate?: PredicateWithIndex<T>): T {
    return last(this.filterSequence(predicate));
  }

  lastOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return lastOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  single(predicate?: PredicateWithIndex<T>): T {
    return single(this.filterSequence(predicate));
  }

  singleOrDefault(predicate?: PredicateWithIndex<T>): T | null {
    return singleOrDefault<T>()(this.filterSequence(predicate)) ?? null;
  }

  toArray(): T[] {
    return toArray(this.source);
  }

  private filterSequence(predicate?: PredicateWithIndex<T>): Iterable<T> {
    return predicate ? where(predicate)(this.source) : this.source;
  }

  //
  // Transformations
  //

  groupBy<TKey>(
    keySelector: SelectorWithIndex<T, TKey>
  ): ILinqIterable<GroupingResult<TKey, T>> {
    return new LinqIterable([...groupBy(keySelector)(this.source)]);
  }

  select<TSelect>(
    selector: SelectorWithIndex<T, TSelect>
  ): ILinqIterable<TSelect> {
    return new LinqIterable<TSelect>(select(selector)(this.source));
  }

  selectMany<TSelect>(
    selector: SelectorWithIndex<T, Iterable<TSelect>>
  ): ILinqIterable<TSelect> {
    return new LinqIterable(selectMany(selector)(this.source));
  }
}

/**
 * Provides additional methods specific to a `LinqIterable<XAttribute>`.
 */
export class LinqIterableOfXAttribute
  extends LinqIterable<XAttribute>
  implements ILinqIterableOfXAttribute
{
  constructor(source: Iterable<XAttribute>) {
    super(source);
  }

  remove(): void {
    const attributes = [...this.source];
    for (const attribute of attributes) {
      attribute.remove();
    }
  }

  where(predicate: PredicateWithIndex<XAttribute>): ILinqIterableOfXAttribute {
    return new LinqIterableOfXAttribute(where(predicate)(this.source));
  }
}

/**
 * Provides additional methods specific to a `LinqIterable<XNode>`.
 */
export class LinqIterableOfXNode
  extends LinqIterable<XNode>
  implements ILinqIterableOfXNode
{
  constructor(source: Iterable<XNode>) {
    super(source);
  }

  ancestors(name?: XName): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(
      getManyAncestors(this.source, name ?? null, false)
    );
  }

  remove(): void {
    const nodes = [...this.source];
    for (const node of nodes) {
      node?.remove();
    }
  }

  where(predicate: PredicateWithIndex<XNode>): ILinqIterableOfXNode {
    return new LinqIterableOfXNode(where(predicate)(this.source));
  }
}

/**
 * Provides additional methods specific to a `LinqIterable<XElement>`.
 */
export class LinqIterableOfXElement
  extends LinqIterable<XElement>
  implements ILinqIterableOfXElement
{
  constructor(source: Iterable<XElement>) {
    super(source);
  }

  ancestors(name?: XName): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(
      getManyAncestors(this.source, name ?? null, false)
    );
  }

  ancestorsAndSelf(name?: XName): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(
      getManyAncestors(this.source, name ?? null, true)
    );
  }

  attributes(name?: XName): ILinqIterableOfXAttribute {
    return new LinqIterableOfXAttribute(
      getManyAttributes(this.source, name ?? null)
    );
  }

  descendantNodes(): ILinqIterableOfXNode {
    return new LinqIterableOfXNode(getManyDescendantNodes(this.source, false));
  }

  descendantNodesAndSelf(): ILinqIterableOfXNode {
    return new LinqIterableOfXNode(getManyDescendantNodes(this.source, true));
  }

  descendants(name?: XName | null): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(
      name !== null
        ? getManyDescendants(this.source, name ?? null, false)
        : XElement.emptySequence
    );
  }

  descendantsAndSelf(name?: XName): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(
      name !== null
        ? getManyDescendants(this.source, name ?? null, true)
        : XElement.emptySequence
    );
  }

  elements(name?: XName | null): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(
      name !== null
        ? getManyElements(this.source, name ?? null)
        : XElement.emptySequence
    );
  }

  nodes(): ILinqIterableOfXNode {
    return new LinqIterableOfXNode(getManyNodes(this.source));
  }

  remove(): void {
    const elements = [...this.source];
    for (const element of elements) {
      element?.remove();
    }
  }

  where(predicate: PredicateWithIndex<XElement>): ILinqIterableOfXElement {
    return new LinqIterableOfXElement(where(predicate)(this.source));
  }
}

function* getManyAncestors<T extends XNode>(
  source: Iterable<T>,
  name: XName | null,
  self: boolean
) {
  for (const node of source) {
    for (const ancestor of getAncestors(node, name, self)) {
      yield ancestor;
    }
  }
}

function* getManyAttributes(source: Iterable<XElement>, name: XName | null) {
  for (const element of source) {
    for (const attribute of getAttributes(element, name)) {
      yield attribute;
    }
  }
}

function* getManyDescendantNodes<T extends XContainer>(
  source: Iterable<T>,
  self: boolean
) {
  for (const root of source) {
    if (root === null) continue;
    if (self) yield root;

    let node: XNode | null = root;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const firstChildNode: XNode | null =
        node instanceof XContainer ? node.firstNode : null;

      if (firstChildNode !== null) {
        // Move down.
        node = firstChildNode;
      } else {
        while (
          node !== null &&
          node !== root &&
          node === node._parent!._content
        ) {
          // Move back up.
          node = node._parent;
        }

        if (node === null || node === root) {
          break;
        }

        // Move "right".
        node = node._next!;
      }

      yield node;
    }
  }
}

function* getManyDescendants(
  source: Iterable<XElement>,
  name: XName | null,
  self: boolean
) {
  for (const root of source) {
    if (root === null) continue;

    if (self) {
      const e = root as XElement;
      if (name === null || e.name === name) yield e;
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

function* getManyElements(source: Iterable<XElement>, name: XName | null) {
  for (const root of source) {
    if (root !== null && root._content instanceof XNode) {
      let n: XNode = root._content;
      do {
        n = n._next!;
        if (n instanceof XElement && (name === null || n._name === name)) {
          yield n;
        }
      } while (n._parent === root && n !== root._content);
    }
  }
}

function* getManyNodes<T extends XContainer>(source: Iterable<T>) {
  for (const root of source) {
    if (root === null) continue;

    for (const node of getNodes(root)) {
      yield node;
    }
  }
}
