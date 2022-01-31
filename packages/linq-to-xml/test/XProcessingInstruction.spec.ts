/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XProcessingInstruction } from '../src';
import { StringBuilder } from '../src/internal';

const pi = new XProcessingInstruction(
  'mso-application',
  'progid="Word.Document"'
);

describe('appendText(sb: StringBuilder)', () => {
  it('appends nothing', () => {
    const sb = new StringBuilder();
    pi.appendText(sb);
    expect(sb.toString()).toEqual('');
  });
});

describe('cloneNode(): XNode', () => {
  it('creates a copy with the same target and data', () => {
    const newPi = pi.cloneNode() as XProcessingInstruction;
    expect(newPi.target).toEqual(pi.target);
    expect(newPi.data).toEqual(pi.data);
  });
});

describe('toString(): string', () => {
  it('returns the string representation', () => {
    expect(pi.toString()).toEqual('<?mso-application progid="Word.Document"?>');
  });
});
