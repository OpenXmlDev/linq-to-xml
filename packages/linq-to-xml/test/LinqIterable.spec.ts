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
  XAttribute,
  XElement,
  XName,
} from '../src/internal';

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

    const sequence = getLinqIterable().filters(filters);

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

describe('firstOrDefault(predicate?: PredicateWithIndex<T>): T | null', () => {
  it('returns the first item of a non-empty sequence', () => {
    const paragraphs = wordPackage.descendants(W.p);
    const firstParagraph = paragraphs.firstOrDefault();
    expect(firstParagraph?.value).toEqual('Heading');
  });

  it('returns null for empty sequences', () => {
    // We have no w:tbl elements.
    expect(wordPackage.descendants(W.tbl).firstOrDefault()).toBeNull();
    expect(linqIterable<any>([]).firstOrDefault()).toBeNull();
  });

  it('returns the first item of a non-empty sequence for which the predicate is true', () => {
    // We have one "special" w:p with w:rsidR="00000000".
    const iterable = wordPackage.descendants(W.p);
    const paragraph = iterable.firstOrDefault(hasRsidR('00000000'));
    expect(paragraph?.isEmpty).toBe(true);
  });

  it('returns null for non-empty sequences if the predicate is false for all items', () => {
    // We have three w:p elements.
    const paragraphs = wordPackage.descendants(W.p);
    expect(paragraphs.firstOrDefault(() => false)).toBeNull();
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

    const paragraph = paragraphs.lastOrDefault(hasRsidR('007A3403'));

    expect(paragraph?.value).toEqual('Body Text.');
  });

  it('throws for non-empty sequences if the predicate is false for all items', () => {
    const paragraphs = wordPackage.descendants(W.p);
    expect(() => paragraphs.last(() => false)).toThrow();
  });
});

describe('lastOrDefault(predicate?: PredicateWithIndex<T>): T | null', () => {
  it('returns the last item for non-empty sequences', () => {
    const paragraphs = wordPackage.descendants(W.p);
    const paragraph = paragraphs.lastOrDefault();
    expect(paragraph?.isEmpty).toBe(true);
  });

  it('returns null for empty sequences', () => {
    const emptySequence = wordPackage.descendants(W.tbl);
    expect(emptySequence.lastOrDefault()).toBeNull();
  });

  it('returns the last item for which the predicate is true for non-empty sequences', () => {
    expect(wordPackage.descendants(W.p).count(hasRsidR('007A3403'))).toBe(2);
    const paragraphs = wordPackage.descendants(W.p);

    const paragraph = paragraphs.lastOrDefault(hasRsidR('007A3403'));

    expect(paragraph?.value).toEqual('Body Text.');
  });

  it('returns null for non-empty sequences if the predicate is false for all items', () => {
    const paragraphs = wordPackage.descendants(W.p);
    expect(paragraphs.lastOrDefault(() => false)).toBeNull();
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

describe('singleOrDefault(predicate?: PredicateWithIndex<T>): T | null', () => {
  it('returns the single item of a single-item sequence', () => {
    const singleItemSequence = wordPackage.descendants(W.document);
    const document = singleItemSequence.singleOrDefault();
    expect(document?.name).toBe(W.document);
  });

  it('returns null for empty sequences', () => {
    const emptySequence = wordPackage.descendants(W.tbl);
    expect(emptySequence.singleOrDefault()).toBeNull();
  });

  it('returns the single item for which the predicate is true for non-empty sequences', () => {
    // We have one w:p with w:rsidR="00000000".
    const paragraphs = wordPackage.descendants(W.p);
    const paragraph = paragraphs.singleOrDefault(hasRsidR('00000000'));
    expect(paragraph?.isEmpty).toBe(true);
  });

  it('returns null for non-empty sequences if the predicate is false for all items', () => {
    const paragraphs = wordPackage.descendants(W.p);
    expect(paragraphs.singleOrDefault(() => false)).toBeNull();
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
      new XElement(W.rPr, new XElement(W.b)),
      new XElement(W.t, 'Bold 1')
    ),
    new XElement(
      W.r,
      new XElement(W.rPr, new XElement(W.i)),
      new XElement(W.t, 'Italic')
    ),
    new XElement(
      W.r,
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
    expect([...boldRunGrouping].map((e) => e.value)).toEqual([
      'Bold 1',
      'Bold 2',
    ]);

    const italicRunGrouping = runGroupings.single(
      (g) => g.key.indexOf('<w:i/>') >= 0
    );
    expect([...italicRunGrouping].map((e) => e.value)).toEqual(['Italic']);
  });

  it('returns a single grouping of elements for constant key selectors', () => {
    const keys = [null, undefined, 42, 'key', true];

    for (const key of keys) {
      const runGroupings = source.groupBy(() => key);
      const runGrouping = runGroupings.single();
      expect([...runGrouping].map((r) => r.value)).toEqual([
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
    expect(iterable.toArray()).toEqual(source);
  });

  it('returns the source, if it is already a LinqIterable<T>', () => {
    const source = new LinqIterable([1, 2, 3]);
    const iterable = linqIterable(source);
    expect(iterable).toBe(source);
  });
});
