/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XNamespace, XAttribute } from '../src/internal';

const namespaceName =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const localName = 'val';

const namespace = XNamespace.get(namespaceName);
const name = namespace.getName('w', localName);
const value = 'Normal';

describe('An XAttribute instance', () => {
  const attribute = new XAttribute(name, value);

  it('should have expected attribute and field values', () => {
    expect(attribute.name).toBe(attribute._name);
    expect(attribute.value).toEqual(attribute._value);

    expect(attribute._name).toBe(name);
    expect(attribute._value).toBe(value);

    expect(attribute._next).toBeNull();
    expect(attribute._parent).toBeNull();
  });
});
