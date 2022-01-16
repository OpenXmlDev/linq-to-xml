/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XElement } from '../src/internal';
import { createWordDocumentPackage, W } from './TestHelpers';

// Create a pkg:package with a w:document containing three w:p descendants.
const wordPackage: XElement = createWordDocumentPackage();

//
// Resolutions
//

describe('all(predicate: PredicateWithIndex<T>): boolean', () => {
  // TODO: Add unit tests.
});

describe('any(predicate?: PredicateWithIndex<T>): boolean', () => {
  // TODO: Add unit tests.
});

describe('count(predicate?: PredicateWithIndex<T>): number', () => {
  test('count() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);

    // Act
    const count = iterable.count();

    // Assert
    expect(count).toBe(3);
  });

  test('count() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act
    const count = iterable.count();

    // Assert
    expect(count).toBe(0);
  });

  test('count(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '00000000';

    // Act
    const count = iterable.count(predicate);

    // Assert
    expect(count).toBe(1);
  });

  test('count(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) => p.attribute(W.rsidR)?.value === 'XYZ';

    // Act
    const count = iterable.count(predicate);

    // Assert
    expect(count).toBe(0);
  });
});

describe('first(predicate?: PredicateWithIndex<T>): T', () => {
  test('first() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);

    // Act
    const paragraph = iterable.first();

    // Assert
    expect(paragraph.value).toEqual('Heading');
  });

  test('first() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act and assert
    expect(() => iterable.first()).toThrow();
  });

  test('first(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '00000000';

    // Act
    const paragraph = iterable.first(predicate);

    // Assert
    expect(paragraph.value).toEqual('');
  });

  test('first(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === 'Non-existent';

    // Act
    expect(() => iterable.first(predicate)).toThrow();
  });
});

describe('firstOrDefault(predicate?: PredicateWithIndex<T>): T | null', () => {
  test('firstOrDefault() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);

    // Act
    const paragraph = iterable.firstOrDefault();

    // Assert
    expect(paragraph?.value).toEqual('Heading');
  });

  test('firstOrDefault() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act
    const tbl = iterable.firstOrDefault();

    // Assert
    expect(tbl).toBeNull();
  });

  test('firstOrDefault(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '00000000';

    // Act
    const paragraph = iterable.firstOrDefault(predicate);

    // Assert
    expect(paragraph?.value).toEqual('');
  });

  test('firstOrDefault(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === 'Non-existent';

    // Act
    const paragraph = iterable.firstOrDefault(predicate);

    // Assert
    expect(paragraph).toBeNull();
  });
});

describe('last(predicate?: PredicateWithIndex<T>): T', () => {
  test('last() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);

    // Act
    const paragraph = iterable.last();

    // Assert
    expect(paragraph.value).toEqual('');
  });

  test('last() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act and assert
    expect(() => iterable.last()).toThrow();
  });

  test('last(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '00000000';

    // Act
    const paragraph = iterable.last(predicate);

    // Assert
    expect(paragraph.value).toEqual('');
  });

  test('last(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === 'Non-existent';

    // Act
    expect(() => iterable.last(predicate)).toThrow();
  });
});

describe('lastOrDefault(predicate?: PredicateWithIndex<T>): T | null', () => {
  test('lastOrDefault() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);

    // Act
    const paragraph = iterable.lastOrDefault();

    // Assert
    expect(paragraph?.value).toEqual('');
  });

  test('lastOrDefault() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act
    const tbl = iterable.lastOrDefault();

    // Assert
    expect(tbl).toBeNull();
  });

  test('lastOrDefault(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '007A3403';

    // Act
    const paragraph = iterable.lastOrDefault(predicate);

    // Assert
    expect(paragraph?.value).toEqual('Body Text.');
  });

  test('lastOrDefault(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === 'Non-existent';

    // Act
    const paragraph = iterable.lastOrDefault(predicate);

    // Assert
    expect(paragraph).toBeNull();
  });
});

describe('single(predicate?: PredicateWithIndex<T>): T', () => {
  test('single() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.document);

    // Act
    const document = iterable.single();

    // Assert
    expect(document.name).toBe(W.document);
  });

  test('single() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act and assert
    expect(() => iterable.single()).toThrow();
  });

  test('single(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '00000000';

    // Act
    const paragraph = iterable.single(predicate);

    // Assert
    expect(paragraph.value).toEqual('');
  });

  test('single(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === 'Non-existent';

    // Act
    expect(() => iterable.single(predicate)).toThrow();
  });
});

describe('singleOrDefault(predicate?: PredicateWithIndex<T>): T | null', () => {
  test('singleOrDefault() for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.document);

    // Act
    const document = iterable.singleOrDefault();

    // Assert
    expect(document?.name).toBe(W.document);
  });

  test('singleOrDefault() for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.tbl);

    // Act
    const tbl = iterable.singleOrDefault();

    // Assert
    expect(tbl).toBeNull();
  });

  test('singleOrDefault(predicate) for non-empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === '00000000';

    // Act
    const paragraph = iterable.singleOrDefault(predicate);

    // Assert
    expect(paragraph?.value).toEqual('');
  });

  test('singleOrDefault(predicate) for empty sequence', () => {
    // Arrange
    const iterable = wordPackage.descendants(W.p);
    const predicate = (p: XElement) =>
      p.attribute(W.rsidR)?.value === 'Non-existent';

    // Act
    const paragraph = iterable.singleOrDefault(predicate);

    // Assert
    expect(paragraph).toBeNull();
  });
});

describe('toArray(): T[]', () => {
  // test('', () => {
  //   // TODO: Implement
  // });
});

//
// Transformations
//

describe('groupBy<TKey>(keySelector: SelectorWithIndex<T, TKey>): ILinqIterable<GroupingResult<TKey, T>>', () => {
  // test('', () => {
  //   // TODO: Implement
  // });
});

describe('select<TSelect>(selector: SelectorWithIndex<T, TSelect>): ILinqIterable<TSelect>', () => {
  // test('', () => {
  //   // TODO: Implement
  // });
});

describe('selectMany<TSelect>(selector: SelectorWithIndex<T, Iterable<TSelect>>): ILinqIterable<TSelect>', () => {
  // test('', () => {
  //   // TODO: Implement
  // });
});
