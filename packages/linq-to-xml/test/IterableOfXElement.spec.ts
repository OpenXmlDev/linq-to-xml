// import { count, first } from '@tsdotnet/linq/dist/resolutions';
import { XElement } from '../src/internal';
import { createWordDocumentPackage, W } from './TestHelpers';

test('IterableOfXElement.elements()', () => {
  const wordPackage: XElement = createWordDocumentPackage();

  const texts = wordPackage.descendants(W.p).elements(W.r).elements(W.t);

  // The first time we resolve, we get the correct count.
  expect(texts.count()).toEqual(2);

  // The second time we resolve, we get zero.
  expect(texts.count()).toEqual(0);
});

test('IterableOfXElement.attributes()', () => {
  const wordPackage: XElement = createWordDocumentPackage();
  const attributes = wordPackage.descendants(W.p).attributes();
  expect(attributes.count()).toBe(8);
});
