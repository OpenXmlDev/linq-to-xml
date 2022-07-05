/**
 * @author Thomas Barnekow
 * @license MIT
 */

import {
  skip,
  skipLast,
  skipWhile,
  take,
  takeLast,
  takeWhile,
  where,
} from '@tsdotnet/linq/dist/filters.js';

import {
  linqElements,
  LinqElements,
  LinqElementsBase,
  XElement,
} from '../src/index.js';

import {
  ancestors,
  ancestorsAndSelf,
  attributes,
  descendantNodes,
  descendantNodesAndSelf,
  descendants,
  descendantsAndSelf,
  elements,
  filter,
  nodes,
} from '../src/transformations/index.js';

import { createWordDocumentPackage, W } from './TestHelpers.js';

const testPackage: XElement = createWordDocumentPackage();
const getLinqElements = () => testPackage.descendants(W.p);

describe('filter(...filters: IterableFilter<XElement>[]): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const skipOne = skip<XElement>(1);
    const takeOne = take<XElement>(1);
    const expectedSequence = filter(getLinqElements(), [skipOne, takeOne]);

    const sequence = getLinqElements().filter(skipOne, takeOne);

    expect([...sequence]).toEqual([...expectedSequence]);
  });

  it('returns the instance if no filters are passed', () => {
    const instance = getLinqElements();
    const sequence = instance.filter();
    expect(sequence).toBe(instance);
  });
});

describe('filters(filters: Iterable<IterableFilter<XElement>>): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const filters = [skip<XElement>(1), take<XElement>(1)];
    const expectedSequence = filter(getLinqElements(), filters);

    const sequence = getLinqElements().applyFilters(filters);

    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('ancestors(name?: XName): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = ancestors()(getLinqElements());
    const sequence = getLinqElements().ancestors();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('ancestorsAndSelf(name?: XName): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = ancestorsAndSelf()(getLinqElements());
    const sequence = getLinqElements().ancestorsAndSelf();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('attributes(name?: XName): LinqAttributes', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = attributes()(getLinqElements());
    const sequence = getLinqElements().attributes();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendantNodes(): LinqNodes', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendantNodes(getLinqElements());
    const sequence = getLinqElements().descendantNodes();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendantNodesAndSelf(): LinqNodes', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendantNodesAndSelf(getLinqElements());
    const sequence = getLinqElements().descendantNodesAndSelf();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendants(name?: XName | null): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendants()(getLinqElements());
    const sequence = getLinqElements().descendants();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendantsAndSelf(name?: XName): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendantsAndSelf()(getLinqElements());
    const sequence = getLinqElements().descendantsAndSelf();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('elements(name?: XName | null): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = elements()(getLinqElements());
    const sequence = getLinqElements().elements();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('nodes(): LinqNodes', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = nodes(getLinqElements());
    const sequence = getLinqElements().nodes();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('remove(): void', () => {
  it('removes all sequence items', () => {
    const wordPackage: XElement = createWordDocumentPackage();
    const elements = () => wordPackage.descendants(W.r);
    expect(elements().any()).toBe(true);

    elements().remove();

    expect(elements().any()).toBe(false);
  });
});

//
// LINQ Filters
//

describe('skip(count: number): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = skip<XElement>(1)(getLinqElements());
    const sequence = getLinqElements().skip(1);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('skipLast(count: number): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = skipLast<XElement>(1)(getLinqElements());
    const sequence = getLinqElements().skipLast(1);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('skipWhile(predicate: PredicateWithIndex<XElement>): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const value = 'Heading';
    const expectedSequence = skipWhile<XElement>((e) => e.value === value)(
      getLinqElements()
    );
    const sequence = getLinqElements().skipWhile((e) => e.value === value);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('take(count: number): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = take<XElement>(2)(getLinqElements());
    const sequence = getLinqElements().take(2);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('takeLast(count: number): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = takeLast<XElement>(2)(getLinqElements());
    const sequence = getLinqElements().takeLast(2);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('takeWhile(predicate: PredicateWithIndex<XElement>): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const value = '';
    const expectedSequence = takeWhile<XElement>((e) => e.value !== value)(
      getLinqElements()
    );
    const sequence = getLinqElements().takeWhile((e) => e.value !== value);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('where(predicate: PredicateWithIndex<XElement>): LinqElements', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = where<XElement>((e) => !e.isEmpty)(
      getLinqElements()
    );
    const sequence = getLinqElements().where((e) => !e.isEmpty);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('function linqElements(source: Iterable<XElement>): LinqElements', () => {
  it('returns a new LinqElements if the source is not an instance of LinqElements', () => {
    const source = [new XElement(W.p), new XElement(W.r), new XElement(W.t)];
    const iterable = linqElements(source);
    expect(iterable).toBeInstanceOf(LinqElements);
    expect(iterable).toBeInstanceOf(LinqElementsBase);
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqElements', () => {
    const source = new LinqElements([
      new XElement(W.p),
      new XElement(W.r),
      new XElement(W.t),
    ]);
    const iterable = linqElements(source);
    expect(iterable).toBe(source);
  });
});
