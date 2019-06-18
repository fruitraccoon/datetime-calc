import { termParser, ITerm } from './termParser';

describe('parse tests for terms', () => {
  it('Returns a full term', () => {
    const result = termParser.parse('-2w');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual({
      coefficient: -2,
      valueFactor: 'w',
    } as ITerm);
  });

  it('Fails a term without an operator', () => {
    const result = termParser.parse('2w');
    expect(result.status).toBe(false);
  });

  it('Fails a term with two operators', () => {
    const result = termParser.parse('+-2w');
    expect(result.status).toBe(false);
  });

  it('Fails a term with two valueFactors', () => {
    const result = termParser.parse('+2wm');
    expect(result.status).toBe(false);
  });

  it('Returns a term without a coefficient', () => {
    const result = termParser.parse('+w');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual({
      coefficient: 1,
      valueFactor: 'w',
    } as ITerm);
  });

  it('Returns a term without a valueFactor', () => {
    const result = termParser.parse('+2');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual({
      coefficient: 2,
      valueFactor: 'd',
    } as ITerm);
  });

  it('Returns a term stripping leading zeros', () => {
    const result = termParser.parse('+002m');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual({
      coefficient: 2,
      valueFactor: 'm',
    } as ITerm);
  });
});
