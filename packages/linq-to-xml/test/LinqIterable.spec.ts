/**
 * @author Thomas Barnekow
 * @license MIT
 */

import applyFilters from '@tsdotnet/linq/dist/applyFilters';
import { skip, take } from '@tsdotnet/linq/dist/filters';
import { select } from '@tsdotnet/linq/dist/transforms';
import { all } from '@tsdotnet/linq/dist/resolutions';

import {
  linqIterable,
  LinqIterable,
  LinqIterableBase,
  LinqIterableGrouping,
  XAttribute,
  XElement,
  XName,
  XNamespace,
} from '../src';

import { createWordDocumentPackage, W } from './TestHelpers';

// Create a pkg:package with a w:document containing three w:p descendants.
// Use for reading only. Do not mutate.
const wordPackage: XElement = createWordDocumentPackage();
const getLinqIterable = () => linqIterable([...wordPackage.descendants(W.p)]);

function hasRsidR(value: string) {
  return (p: XElement) => p.attribute(W.rsidR)?.value === value;
}

//
// Generic Filter, Transformation, and Resolution Executors
//

describe('filter(...filters: IterableFilter<T>[]): LinqIterable<T>', () => {
  it('returns the result of the wrapped function', () => {
    const skipOne = skip<XElement>(1);
    const takeOne = take<XElement>(1);
    const expectedSequence = applyFilters(getLinqIterable(), [
      skipOne,
      takeOne,
    ]);

    const sequence = getLinqIterable().filter(skipOne, takeOne);

    expect([...sequence]).toEqual([...expectedSequence]);
  });

  it('returns the instance if no filters are passed', () => {
    const instance = getLinqIterable();
    const sequence = instance.filter();
    expect(sequence).toBe(instance);
  });
});

describe('filters(filters: Iterable<IterableFilter<T>>): LinqIterable<T>', () => {
  it('returns the result of the wrapped function', () => {
    const filters = [skip<XElement>(1), take<XElement>(1)];
    const expectedSequence = applyFilters(getLinqIterable(), filters);

    const sequence = getLinqIterable().applyFilters(filters);

    expect([...sequence]).toEqual([...expectedSequence]);
  });
});

describe('transform<TResult>(transform: IterableValueTransform<T, TResult>): LinqIterable<TResult>', () => {
  it('executes the transformation', () => {
    // The source is a sequence of three elements named w:p.
    // The transformation turns the sequence of elements into a sequence of names.
    const source: LinqIterable<XElement> = getLinqIterable();
    const transformation = select<XElement, XName>((e) => e.name);

    const sequence = source.transform(transformation);

    expect(sequence.toArray()).toEqual([W.p, W.p, W.p]);
  });
});

describe('resolve<TResolution>(resolution: IterableTransform<T, TResolution>): TResolution', () => {
  it('executes the resolution', () => {
    const source: LinqIterable<XElement> = getLinqIterable();
    const resolution = all<XElement>((e) => e.name === W.p);

    const result = source.resolve(resolution);

    expect(result).toBe(true);
  });
});

//
// Filters
//

describe('defaultIfEmpty(defaultValue: T): TLinq', () => {
  it('sets the default number value to be returned if the sequence is empty', () => {
    const emptySequence = linqIterable<number>([]);
    const defaultValue = 0;

    const sequence = emptySequence.defaultIfEmpty(defaultValue);

    const resolution = sequence.firstOrDefault();
    expect(resolution).toBe(defaultValue);
  });

  it('sets the default string value to be returned if the sequence is empty', () => {
    const emptySequence = linqIterable<string>([]);
    const defaultValue = 'Hello World!';

    const sequence = emptySequence.defaultIfEmpty(defaultValue);

    const resolution = sequence.firstOrDefault();
    expect(resolution).toBe(defaultValue);
  });
});

//
// Resolutions
//

describe('all(predicate: PredicateWithIndex<T>): boolean', () => {
  it('returns true for empty sequences regardless of the predicate', () => {
    const empty = linqIterable<XElement>([]);

    expect(empty.all(() => false)).toBe(true);
    expect(empty.all(() => true)).toBe(true);
  });

  it('returns true if the predicate is true for all sequence items', () => {
    const elements = linqIterable([
      new XElement(W.p),
      new XElement(W.p),
      new XElement(W.p),
    ]);

    expect(elements.all((e) => e.name === W.p)).toBe(true);
  });

  it('returns false if the predicate is false for any sequence items', () => {
    const elements = linqIterable([
      new XElement(W.p),
      new XElement(W.tbl),
      new XElement(W.p),
    ]);

    expect(elements.all((e) => e.name === W.p)).toBe(false);
  });
});

describe('any(predicate?: PredicateWithIndex<T>): boolean', () => {
  it('returns true for non-empty sequences and undefined predicates', () => {
    expect(wordPackage.descendants().any()).toBe(true);
    expect(linqIterable([1]).any()).toBe(true);
  });

  it('returns true if the defined predicate is true for any sequence item', () => {
    // We have three w:p elements in the pkg:package.
    expect(wordPackage.descendants().any((e) => e.name === W.p)).toBe(true);
    expect(linqIterable([0, 1]).any((n) => n > 0)).toBe(true);
  });

  it('returns false for empty sequences and undefined predicates', () => {
    expect(wordPackage.descendants(W.tbl).any()).toBe(false);
    expect(linqIterable<number>([]).any()).toBe(false);
  });

  it('returns false if the defined predicate is false for all sequence items', () => {
    // We have no w:tbl elements in the pkg:package.
    expect(wordPackage.descendants().any((e) => e.name === W.tbl)).toBe(false);
    expect(linqIterable([0, 1]).any((n) => n < 0)).toBe(false);
  });
});

describe('count(predicate?: PredicateWithIndex<T>): number', () => {
  it('returns zero for empty sequences', () => {
    // We don't have w:tbl descendants.
    expect(wordPackage.descendants(W.tbl).count()).toBe(0);

    // We have three w:p elements but the predicate selects none of those.
    expect(wordPackage.descendants(W.p).count(() => false)).toBe(0);
  });

  it('returns the non-zero count of all items of non-empty sequences', () => {
    // We have three w:p elements.
    expect(wordPackage.descendants(W.p).count()).toBe(3);

    // We have one w:p element with w:rsidR="00000000".
    expect(
      wordPackage
        .descendants(W.p)
        .count((e) => e.attribute(W.rsidR)?.value === '00000000')
    ).toBe(1);
  });
});

describe('first(predicate?: PredicateWithIndex<T>): T', () => {
  it('returns the first item of a non-empty sequence', () => {
    const paragraphs = wordPackage.descendants(W.p);
    const firstParagraph = paragraphs.first();
    expect(firstParagraph.value).toEqual('Heading');
  });

  it('throws for empty sequences', () => {
    // We have no w:tbl elements.
    expect(() => wordPackage.descendants(W.tbl).first()).toThrow();
    expect(() => linqIterable<any>([]).first()).toThrow();
  });

  it('returns the first item of a non-empty sequence for which the predicate is true', () => {
    // We have one "special" w:p with w:rsidR="00000000".
    const paragraphs = wordPackage.descendants(W.p);
    const paragraph = paragraphs.first(hasRsidR('00000000'));
    expect(paragraph.isEmpty).toBe(true);
  });

  it('throws for non-empty sequences if the predicate is false for all items', () => {
    // We have three w:p elements.
    const paragraphs = wordPackage.descendants(W.p);
    expect(() => paragraphs.first(() => false)).toThrow();
  });
});

describe('firstOrDefault(): T | undefined', () => {
  it('returns the first item of a non-empty sequence', () => {
    const paragraphs = wordPackage.descendants(W.p);
    const firstParagraph = paragraphs.firstOrDefault();
    expect(firstParagraph?.value).toEqual('Heading');
  });

  it('returns undefined (API default) for empty sequences', () => {
    expect(linqIterable<XElement>([]).firstOrDefault()).toBeUndefined();
    expect(linqIterable<string>([]).firstOrDefault()).toBeUndefined();
    expect(linqIterable<number>([]).firstOrDefault()).toBeUndefined();
    expect(linqIterable<boolean>([]).firstOrDefault()).toBeUndefined();
  });
});

describe('firstOrDefault(predicate: PredicateWithIndex<T>): T | undefined', () => {
  it('returns the first item of a non-empty sequence for which the predicate is true', () => {
    // We have one "special" w:p with w:rsidR="00000000".
    const sequence = wordPackage.descendants(W.p);
    const paragraph = sequence.firstOrDefault(hasRsidR('00000000'));
    expect(paragraph?.isEmpty).toBe(true);
  });

  it('returns undefined (API default) for non-empty sequences if the predicate is false for all items', () => {
    expect(
      linqIterable([new XElement(W.p)]).firstOrDefault(() => false)
    ).toBeUndefined();
    expect(
      linqIterable(['a', 'b']).firstOrDefault(() => false)
    ).toBeUndefined();
    expect(linqIterable([1, 2]).firstOrDefault(() => false)).toBeUndefined();
    expect(
      linqIterable([true, false]).firstOrDefault(() => false)
    ).toBeUndefined();
  });

  it('returns undefined (API default) for empty sequences', () => {
    expect(
      linqIterable<XElement>([]).firstOrDefault(() => true)
    ).toBeUndefined();
    expect(linqIterable<string>([]).firstOrDefault(() => true)).toBeUndefined();
    expect(linqIterable<number>([]).firstOrDefault(() => true)).toBeUndefined();
    expect(
      linqIterable<boolean>([]).firstOrDefault(() => true)
    ).toBeUndefined();
  });
});

describe('firstOrDefault(defaultValue: T): T', () => {
  it('returns the first item of a non-empty sequence', () => {
    const sequence = linqIterable([1, 2, 3]);
    const firstElement = sequence.firstOrDefault(0);
    expect(firstElement).toEqual(1);
  });

  it('returns the given default value for empty sequences', () => {
    expect(linqIterable<number>([]).firstOrDefault(0)).toEqual(0);
    expect(linqIterable<boolean>([]).firstOrDefault(true)).toEqual(true);
    expect(linqIterable<string>([]).firstOrDefault('foo')).toEqual('foo');
  });
});

describe('firstOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T', () => {
  it('returns the first item of a non-empty sequence for which the predicate is true', () => {
    const sequence = linqIterable([1, 2, 3, 4]);
    const firstElement = sequence.firstOrDefault((e) => e % 2 === 0, 0);
    expect(firstElement).toEqual(2);
  });

  it('returns the given default value for non-empty sequences if the predicate is false for all items', () => {
    const sequence = linqIterable([1, 3, 5, 7]);
    const firstElement = sequence.firstOrDefault((e) => e % 2 === 0, 0);
    expect(firstElement).toEqual(0);
  });

  it('returns the given default value for empty sequences', () => {
    const sequence = linqIterable<number>([]);
    const firstElement = sequence.firstOrDefault((e) => e % 2 === 0, 0);
    expect(firstElement).toEqual(0);
  });
});

describe('last(predicate?: PredicateWithIndex<T>): T', () => {
  it('returns the last item for non-empty sequences', () => {
    // The last w:p is an empty element.
    const paragraphs = wordPackage.descendants(W.p);
    const paragraph = paragraphs.last();
    expect(paragraph.isEmpty).toBe(true);
  });

  it('throws for empty sequences', () => {
    const emptySequence = wordPackage.descendants(W.tbl);
    expect(() => emptySequence.last()).toThrow();
  });

  it('returns the last item for which the predicate is true for non-empty sequences', () => {
    expect(wordPackage.descendants(W.p).count(hasRsidR('007A3403'))).toBe(2);
    const paragraphs = wordPackage.descendants(W.p);

    const paragraph = paragraphs.last(hasRsidR('007A3403'));

    expect(paragraph?.value).toEqual('Body Text.');
  });

  it('throws for non-empty sequences if the predicate is false for all items', () => {
    const paragraphs = wordPackage.descendants(W.p);
    expect(() => paragraphs.last(() => false)).toThrow();
  });
});

describe('lastOrDefault(): T | undefined', () => {
  it('returns the last item of a non-empty sequence', () => {
    const paragraphs = wordPackage.descendants(W.p);
    const lastParagraph = paragraphs.lastOrDefault();
    expect(lastParagraph?.value).toEqual('');
  });

  it('returns undefined (API default) for empty sequences', () => {
    expect(linqIterable<XElement>([]).lastOrDefault()).toBeUndefined();
    expect(linqIterable<string>([]).lastOrDefault()).toBeUndefined();
    expect(linqIterable<number>([]).lastOrDefault()).toBeUndefined();
    expect(linqIterable<boolean>([]).lastOrDefault()).toBeUndefined();
  });
});

describe('lastOrDefault(predicate: PredicateWithIndex<T>): T | undefined', () => {
  it('returns the last item of a non-empty sequence for which the predicate is true', () => {
    // We have one "special" w:p with w:rsidR="00000000".
    const sequence = wordPackage.descendants(W.p);
    const paragraph = sequence.lastOrDefault(hasRsidR('00000000'));
    expect(paragraph?.isEmpty).toBe(true);
  });

  it('returns undefined (API default) for non-empty sequences if the predicate is false for all items', () => {
    expect(
      linqIterable([new XElement(W.p)]).lastOrDefault(() => false)
    ).toBeUndefined();
    expect(linqIterable(['a', 'b']).lastOrDefault(() => false)).toBeUndefined();
    expect(linqIterable([1, 2]).lastOrDefault(() => false)).toBeUndefined();
    expect(
      linqIterable([true, false]).lastOrDefault(() => false)
    ).toBeUndefined();
  });

  it('returns undefined (API default) for empty sequences', () => {
    expect(
      linqIterable<XElement>([]).lastOrDefault(() => true)
    ).toBeUndefined();
    expect(linqIterable<string>([]).lastOrDefault(() => true)).toBeUndefined();
    expect(linqIterable<number>([]).lastOrDefault(() => true)).toBeUndefined();
    expect(linqIterable<boolean>([]).lastOrDefault(() => true)).toBeUndefined();
  });
});

describe('lastOrDefault(defaultValue: T): T', () => {
  it('returns the last item of a non-empty sequence', () => {
    const sequence = linqIterable([1, 2, 3]);
    const lastElement = sequence.lastOrDefault(0);
    expect(lastElement).toEqual(3);
  });

  it('returns the given default value for empty sequences', () => {
    expect(linqIterable<number>([]).lastOrDefault(0)).toEqual(0);
    expect(linqIterable<boolean>([]).lastOrDefault(true)).toEqual(true);
    expect(linqIterable<string>([]).lastOrDefault('foo')).toEqual('foo');
  });
});

describe('lastOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T', () => {
  it('returns the last item of a non-empty sequence for which the predicate is true', () => {
    const sequence = linqIterable([1, 2, 3, 4]);
    const lastElement = sequence.lastOrDefault((e) => e % 2 === 0, 0);
    expect(lastElement).toEqual(4);
  });

  it('returns the given default value for non-empty sequences if the predicate is false for all items', () => {
    const sequence = linqIterable([1, 3, 5, 7]);
    const lastElement = sequence.lastOrDefault((e) => e % 2 === 0, 0);
    expect(lastElement).toEqual(0);
  });

  it('returns the given default value for empty sequences', () => {
    const sequence = linqIterable<number>([]);
    const lastElement = sequence.lastOrDefault((e) => e % 2 === 0, 0);
    expect(lastElement).toEqual(0);
  });
});

describe('single(predicate?: PredicateWithIndex<T>): T', () => {
  it('returns the single item of a single-item sequence', () => {
    const singleItemSequence = wordPackage.descendants(W.document);
    const document = singleItemSequence.single();
    expect(document.name).toBe(W.document);
  });

  it('throws for empty sequences', () => {
    const emptySequence = wordPackage.descendants(W.tbl);
    expect(() => emptySequence.single()).toThrow();
  });

  it('throws for for multi-element sequences', () => {
    const multiElementSequence = wordPackage.descendants(W.p);
    expect(() => multiElementSequence.single()).toThrow();
  });

  it('returns the single item for which the predicate is true for non-empty sequences', () => {
    const paragraphs = wordPackage.descendants(W.p);
    const paragraph = paragraphs.single(hasRsidR('00000000'));
    expect(paragraph.isEmpty).toBe(true);
  });

  it('throws for non-empty sequences if the predicate is false for all items', () => {
    const paragraphs = wordPackage.descendants(W.p);
    expect(() => paragraphs.single(() => false)).toThrow();
  });

  it('throws for multi-element sequences if the predicate is true for more than one item', () => {
    const paragraphs = wordPackage.descendants(W.p);
    expect(() => paragraphs.single(() => true)).toThrow();
  });
});

describe('singleOrDefault(): T | undefined', () => {
  it('returns the single item of a non-empty sequence', () => {
    const singleItemSequence = wordPackage.descendants(W.document);
    const document = singleItemSequence.singleOrDefault();
    expect(document?.name).toBe(W.document);
  });

  it('returns undefined (API default) for empty sequences', () => {
    expect(linqIterable<XElement>([]).singleOrDefault()).toBeUndefined();
    expect(linqIterable<string>([]).singleOrDefault()).toBeUndefined();
    expect(linqIterable<number>([]).singleOrDefault()).toBeUndefined();
    expect(linqIterable<boolean>([]).singleOrDefault()).toBeUndefined();
  });

  it('throws if the sequence contains more than one element', () => {
    const sequence = linqIterable([1, 2]);
    expect(() => sequence.singleOrDefault()).toThrow();
  });
});

describe('singleOrDefault(predicate: PredicateWithIndex<T>): T | undefined', () => {
  it('returns the single item of a non-empty sequence for which the predicate is true', () => {
    // We have one "special" w:p with w:rsidR="00000000".
    const sequence = wordPackage.descendants(W.p);
    const paragraph = sequence.singleOrDefault(hasRsidR('00000000'));
    expect(paragraph?.isEmpty).toBe(true);
  });

  it('returns undefined (API default) for non-empty sequences if the predicate is false for all items', () => {
    expect(
      linqIterable([new XElement(W.p)]).singleOrDefault(() => false)
    ).toBeUndefined();
    expect(
      linqIterable(['a', 'b']).singleOrDefault(() => false)
    ).toBeUndefined();
    expect(linqIterable([1, 2]).singleOrDefault(() => false)).toBeUndefined();
    expect(
      linqIterable([true, false]).singleOrDefault(() => false)
    ).toBeUndefined();
  });

  it('returns undefined (API default) for empty sequences', () => {
    expect(
      linqIterable<XElement>([]).singleOrDefault(() => true)
    ).toBeUndefined();
    expect(
      linqIterable<string>([]).singleOrDefault(() => true)
    ).toBeUndefined();
    expect(
      linqIterable<number>([]).singleOrDefault(() => true)
    ).toBeUndefined();
    expect(
      linqIterable<boolean>([]).singleOrDefault(() => true)
    ).toBeUndefined();
  });

  it('throws if there is more than one element for which the predicate returns true', () => {
    const sequence = linqIterable([1, 2, 3, 4, 5]);
    expect(() => sequence.singleOrDefault((n) => n > 3)).toThrow();
  });
});

describe('singleOrDefault(defaultValue: T): T', () => {
  it('returns the single item of a non-empty sequence', () => {
    const sequence = linqIterable([1]);
    const singleElement = sequence.singleOrDefault(0);
    expect(singleElement).toEqual(1);
  });

  it('returns the given default value for empty sequences', () => {
    expect(linqIterable<number>([]).singleOrDefault(0)).toEqual(0);
    expect(linqIterable<boolean>([]).singleOrDefault(true)).toEqual(true);
    expect(linqIterable<string>([]).singleOrDefault('foo')).toEqual('foo');
  });

  it('throws if the sequence contains more than one element', () => {
    const sequence = linqIterable([1, 2]);
    expect(() => sequence.singleOrDefault(0)).toThrow();
  });
});

describe('singleOrDefault(predicate: PredicateWithIndex<T>, defaultValue: T): T', () => {
  it('returns the single item of a non-empty sequence for which the predicate is true', () => {
    const sequence = linqIterable([1, 2, 3]);
    const singleElement = sequence.singleOrDefault((e) => e % 2 === 0, 0);
    expect(singleElement).toEqual(2);
  });

  it('returns the given default value for non-empty sequences if the predicate is false for all items', () => {
    const sequence = linqIterable([1, 3, 5]);
    const singleElement = sequence.singleOrDefault((e) => e % 2 === 0, 0);
    expect(singleElement).toEqual(0);
  });

  it('returns the given default value for empty sequences', () => {
    const sequence = linqIterable<number>([]);
    const singleElement = sequence.singleOrDefault((e) => e % 2 === 0, 0);
    expect(singleElement).toEqual(0);
  });

  it('throws if there is more than one element for which the predicate returns true', () => {
    const sequence = linqIterable([1, 2, 3, 4, 5]);
    expect(() => sequence.singleOrDefault((n) => n > 3, 0)).toThrow();
  });
});

describe('toArray(): T[]', () => {
  it('returns a non-empty array for non-empty sequences', () => {
    const element = new XElement(
      W.p,
      new XElement(W.r, new XElement(W.t, 'Hello World!'))
    );
    const sequence = element.descendantsAndSelf().select((e) => e.name);

    expect(sequence.toArray()).toEqual([W.p, W.r, W.t]);
  });

  it('returns an empty array for an empty sequence', () => {
    const emptySequence = linqIterable<any>([]);
    expect(emptySequence.toArray()).toEqual([]);
  });
});

//
// Transformations
//

describe('groupBy<TKey>(keySelector: SelectorWithIndex<T, TKey>): LinqIterable<GroupingResult<TKey, T>>', () => {
  const source = linqIterable([
    new XElement(
      W.r,
      new XAttribute(XNamespace.xmlns.getName('w'), W.w.namespaceName),
      new XElement(W.rPr, new XElement(W.b)),
      new XElement(W.t, 'Bold 1')
    ),
    new XElement(
      W.r,
      new XAttribute(XNamespace.xmlns.getName('w'), W.w.namespaceName),
      new XElement(W.rPr, new XElement(W.i)),
      new XElement(W.t, 'Italic')
    ),
    new XElement(
      W.r,
      new XAttribute(XNamespace.xmlns.getName('w'), W.w.namespaceName),
      new XElement(W.rPr, new XElement(W.b)),
      new XElement(W.t, 'Bold 2')
    ),
  ]);

  it('returns multiple groupings of elements, depending on key selector', () => {
    const runGroupings = source.groupBy(
      (r) => r.element(W.rPr)?.toString() ?? ''
    );

    const boldRunGrouping = runGroupings.single(
      (g) => g.key.indexOf('<w:b/>') >= 0
    );

    expect(boldRunGrouping).toBeInstanceOf(LinqIterableGrouping);
    expect(boldRunGrouping.select((e: XElement) => e.value).toArray()).toEqual([
      'Bold 1',
      'Bold 2',
    ]);

    const italicRunGrouping = runGroupings.single(
      (g) => g.key.indexOf('<w:i/>') >= 0
    );

    expect(boldRunGrouping).toBeInstanceOf(LinqIterableGrouping);
    expect(
      italicRunGrouping.select((e: XElement) => e.value).toArray()
    ).toEqual(['Italic']);
  });

  it('returns a single grouping of elements for constant key selectors', () => {
    const keys = [null, undefined, 42, 'key', true];

    for (const key of keys) {
      const runGroupings = source.groupBy(() => key);
      const runGrouping = runGroupings.single();

      expect(runGrouping).toBeInstanceOf(LinqIterableGrouping);
      expect(runGrouping.select((r: XElement) => r.value).toArray()).toEqual([
        'Bold 1',
        'Italic',
        'Bold 2',
      ]);
    }
  });
});

describe('select<TSelect>(selector: SelectorWithIndex<T, TSelect>): LinqIterable<TSelect>', () => {
  // The source could be the result of selecting the descendants of the w:body element.
  const source = linqIterable([
    new XElement(
      W.p,
      new XAttribute(W.rsidR, '1'),
      new XAttribute(W.rsidRDefault, '2')
    ),
    new XElement(
      W.r,
      new XAttribute(W.rsidR, '3'),
      new XAttribute(W.rsidRDefault, '4')
    ),
    new XElement(W.t),
  ]);

  it('returns the sequence of results', () => {
    const sequence = source.select((e) => e.name);
    const topLevelArray = [...sequence];

    expect(topLevelArray).toEqual([W.p, W.r, W.t]);
  });

  it('returns nested sequences if the results are sequences', () => {
    const sequence = source.select((e) => e.attributes());
    const topLevelArray = [...sequence];
    const nestedArrays = topLevelArray.map((a) => [...a]);

    expect(topLevelArray.length).toBe(3);
    expect(nestedArrays.map((a) => a.length)).toEqual([2, 2, 0]);
  });

  it('returns an empty sequence if the source is an empty sequence', () => {
    const source = linqIterable<number>([]);
    const sequence = source.select((n) => n + 1);
    expect(sequence.count()).toBe(0);
  });
});

describe('selectMany<TSelect>(selector: SelectorWithIndex<T, Iterable<TSelect>>): LinqIterable<TSelect>', () => {
  // The source could be the result of selecting the descendants of the w:body element.
  const source = linqIterable<XElement>([
    new XElement(
      W.p,
      new XAttribute(W.rsidR, '1'),
      new XAttribute(W.rsidRDefault, '2')
    ),
    new XElement(
      W.r,
      new XAttribute(W.rsidR, '3'),
      new XAttribute(W.rsidRDefault, '4')
    ),
    new XElement(W.t),
  ]);

  it('returns a flattened sequence of the items of a nested sequence', () => {
    const sequence = source.selectMany((e) => e.attributes());

    expect(sequence.select((a) => a.name).toArray()).toEqual([
      W.rsidR,
      W.rsidRDefault,
      W.rsidR,
      W.rsidRDefault,
    ]);
  });

  it('returns an empty sequence if the source is empty', () => {
    // The elements contained in the source sequence do not have any child elements.
    const sequence = source.selectMany((e) => e.elements());
    expect(sequence.count()).toBe(0);
  });
});

describe('function linqIterable<T>(source: Iterable<T>): LinqIterable<T>', () => {
  it('returns a new LinqIterable<T> if the source is not an instance of LinqIterable<T>', () => {
    const source = [1, 2, 3];

    const iterable = linqIterable(source);

    expect(iterable).toBeInstanceOf(LinqIterable);
    expect(iterable).toBeInstanceOf(LinqIterableBase);
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqIterable<T>', () => {
    const source = new LinqIterable([1, 2, 3]);
    const iterable = linqIterable(source);
    expect(iterable).toBe(source);
  });
});
