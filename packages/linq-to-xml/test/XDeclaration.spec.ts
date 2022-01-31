/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XDeclaration } from '../src';

describe('toString(): string', () => {
  it('returns the string representation', () => {
    expect(new XDeclaration().toString()).toEqual('<?xml version="1.0"?>');

    expect(new XDeclaration('1.0').toString()).toEqual('<?xml version="1.0"?>');

    expect(new XDeclaration('1.0', 'UTF-8').toString()).toEqual(
      '<?xml version="1.0" encoding="UTF-8"?>'
    );

    expect(new XDeclaration('1.0', 'UTF-8', 'yes').toString()).toEqual(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    );
  });
});
