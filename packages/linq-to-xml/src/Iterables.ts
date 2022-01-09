/* eslint-disable @typescript-eslint/no-unused-vars */

import { PredicateWithIndex } from '@tsdotnet/common-interfaces';
import { where } from '@tsdotnet/linq/dist/filters';
import {
  count,
  first,
  firstOrDefault,
  last,
  lastOrDefault,
  single,
  singleOrDefault,
} from '@tsdotnet/linq/dist/resolutions';

import {
  getAttributes,
  XAttribute,
  XContainer,
  XElement,
  XName,
  XNode,
} from './internal';

/**
 * Abstract base class that provides common Linq "resolutions" such as `first()`,
 * `last()`, and `single()`.
 */
abstract class IterableBase<T> implements Iterable<T> {
  constructor(protected source: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]();
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

  private filterSequence(predicate?: PredicateWithIndex<T>) {
    return predicate ? where(predicate)(this.source) : this.source;
  }
}

/**
 * IEnumerable{XAttribute}
 */
export class IterableOfXAttribute extends IterableBase<XAttribute> {
  constructor(source: Iterable<XAttribute>) {
    super(source);
  }

  remove(): void {
    for (const attribute of this.source) {
      attribute.remove();
    }
  }

  where(predicate: PredicateWithIndex<XAttribute>): IterableOfXAttribute {
    return new IterableOfXAttribute(where(predicate)(this.source));
  }
}

/**
 * IEnumerable{XNode}
 */
export class IterableOfXNode extends IterableBase<XNode> {
  constructor(source: Iterable<XNode>) {
    super(source);
  }

  ancestors(_name?: XName): IterableOfXElement {
    throw new Error('Method not implemented.');
  }

  ancestorsAndSelf(_name?: XName): IterableOfXElement {
    throw new Error('Method not implemented.');
  }

  remove(): void {
    const nodes = [...this.source];
    for (const node of nodes) {
      node?.remove();
    }
  }

  where(predicate: PredicateWithIndex<XNode>): IterableOfXNode {
    return new IterableOfXNode(where(predicate)(this.source));
  }
}

/**
 * IEnumerable{XElement}
 */
export class IterableOfXElement extends IterableBase<XElement> {
  constructor(source: Iterable<XElement>) {
    super(source);
  }

  ancestors(_name?: XName): IterableOfXElement {
    throw new Error('Method not implemented.');
  }

  ancestorsAndSelf(_name?: XName): IterableOfXElement {
    throw new Error('Method not implemented.');
  }

  attributes(name?: XName): IterableOfXAttribute {
    const attributeGenerator = function* (
      source: Iterable<XElement>,
      name: XName | null
    ) {
      for (const element of source) {
        for (const attribute of getAttributes(element, name)) {
          yield attribute;
        }
      }
    };

    return new IterableOfXAttribute(
      attributeGenerator(this.source, name ?? null)
    );
  }

  descendantNodes(): IterableOfXNode {
    throw new Error('Method not implemented.');
  }

  descendantNodesAndSelf(): IterableOfXNode {
    throw new Error('Method not implemented.');
  }

  descendants(name?: XName | null): IterableOfXElement {
    return new IterableOfXElement(
      name !== null
        ? this.getDescendants(name ?? null, false)
        : XElement.emptySequence
    );
  }

  descendantsAndSelf(name?: XName): IterableOfXElement {
    return new IterableOfXElement(
      name !== null
        ? this.getDescendants(name ?? null, true)
        : XElement.emptySequence
    );
  }

  elements(name?: XName | null): IterableOfXElement {
    return new IterableOfXElement(
      name !== null ? this.getElements(name ?? null) : XElement.emptySequence
    );
  }

  nodes(): IterableOfXNode {
    throw new Error('Method not implemented.');
  }

  remove(): void {
    const elements = [...this.source];
    for (const element of elements) {
      element?.remove();
    }
  }

  where(predicate: PredicateWithIndex<XElement>): IterableOfXElement {
    return new IterableOfXElement(where(predicate)(this.source));
  }

  /** @internal */
  private *getDescendants(name: XName | null, self: boolean) {
    for (const root of this.source) {
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

  /** @internal */
  private *getElements(name: XName | null) {
    for (const root of this.source) {
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
}
