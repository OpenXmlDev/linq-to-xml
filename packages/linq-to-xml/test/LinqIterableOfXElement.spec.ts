/**
 * @author Thomas Barnekow
 * @license MIT
 */

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

import {
  linqElements,
  LinqIterableOfXElement,
  XElement,
} from '../src/internal';

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
} from '../src/transformations';

import { createWordDocumentPackage, W } from './TestHelpers';

const testPackage: XElement = createWordDocumentPackage();
const getLinqIterableOfXElement = () => testPackage.descendants(W.p);

describe('filter(...filters: IterableFilter<XElement>[]): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const skipOne = skip<XElement>(1);
    const takeOne = take<XElement>(1);
    const expectedSequence = applyFilters(getLinqIterableOfXElement(), [
      skipOne,
      takeOne,
    ]);

    const sequence = getLinqIterableOfXElement().filter(skipOne, takeOne);

    expect([...sequence]).toEqual([...expectedSequence]);
  });

  it('returns the instance if no filters are passed', () => {
    const instance = getLinqIterableOfXElement();
    const sequence = instance.filter();
    expect(sequence).toBe(instance);
  });
});

describe('filters(filters: Iterable<IterableFilter<XElement>>): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const filters = [skip<XElement>(1), take<XElement>(1)];
    const expectedSequence = applyFilters(getLinqIterableOfXElement(), filters);

    const sequence = getLinqIterableOfXElement().filters(filters);

    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('ancestors(name?: XName): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = ancestors()(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().ancestors();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('ancestorsAndSelf(name?: XName): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = ancestorsAndSelf()(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().ancestorsAndSelf();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('attributes(name?: XName): LinqIterableOfXAttribute', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = attributes()(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().attributes();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendantNodes(): LinqIterableOfXNode', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendantNodes(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().descendantNodes();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendantNodesAndSelf(): LinqIterableOfXNode', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendantNodesAndSelf(
      getLinqIterableOfXElement()
    );
    const sequence = getLinqIterableOfXElement().descendantNodesAndSelf();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendants(name?: XName | null): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendants()(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().descendants();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('descendantsAndSelf(name?: XName): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = descendantsAndSelf()(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().descendantsAndSelf();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('elements(name?: XName | null): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = elements()(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().elements();
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('nodes(): LinqIterableOfXNode', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = nodes(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().nodes();
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

describe('skip(count: number): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = skip<XElement>(1)(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().skip(1);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('skipLast(count: number): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = skipLast<XElement>(1)(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().skipLast(1);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('skipUntil(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const value = 'Body Text.';
    const expectedSequence = skipUntil<XElement>((e) => e.value === value)(
      getLinqIterableOfXElement()
    );
    const sequence = getLinqIterableOfXElement().skipUntil(
      (e) => e.value === value
    );
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('skipWhile(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const value = 'Heading';
    const expectedSequence = skipWhile<XElement>((e) => e.value === value)(
      getLinqIterableOfXElement()
    );
    const sequence = getLinqIterableOfXElement().skipWhile(
      (e) => e.value === value
    );
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('take(count: number): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = take<XElement>(2)(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().take(2);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('takeLast(count: number): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = takeLast<XElement>(2)(getLinqIterableOfXElement());
    const sequence = getLinqIterableOfXElement().takeLast(2);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('takeUntil(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const value = 'Body Text.';
    const expectedSequence = takeUntil<XElement>((e) => e.value === value)(
      getLinqIterableOfXElement()
    );
    const sequence = getLinqIterableOfXElement().takeUntil(
      (e) => e.value === value
    );
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('takeWhile(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const value = '';
    const expectedSequence = takeWhile<XElement>((e) => e.value !== value)(
      getLinqIterableOfXElement()
    );
    const sequence = getLinqIterableOfXElement().takeWhile(
      (e) => e.value !== value
    );
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('where(predicate: PredicateWithIndex<XElement>): LinqIterableOfXElement', () => {
  it('returns the result of the wrapped function', () => {
    const expectedSequence = where<XElement>((e) => !e.isEmpty)(
      getLinqIterableOfXElement()
    );
    const sequence = getLinqIterableOfXElement().where((e) => !e.isEmpty);
    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('function linqElements(source: Iterable<XElement>): LinqIterableOfXElement', () => {
  it('returns a new LinqIterableOfXElement if the source is not an instance of LinqIterableOfXElement', () => {
    const source = [new XElement(W.p), new XElement(W.r), new XElement(W.t)];
    const iterable = linqElements(source);
    expect(iterable).toBeInstanceOf(LinqIterableOfXElement);
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqIterableOfXElement', () => {
    const source = new LinqIterableOfXElement([
      new XElement(W.p),
      new XElement(W.r),
      new XElement(W.t),
    ]);
    const iterable = linqElements(source);
    expect(iterable).toBe(source);
  });
});
