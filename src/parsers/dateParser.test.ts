import { buildDateParser } from './dateParser';

const testDate = new Date('2019-01-01T00:00:00');
const fakeCurrentDate = () => testDate;

describe('parse tests for delimited date input', () => {
  it('Returns date for three delimited values using US locale', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1-2-2000');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2000-01-02T00:00:00'));
  });

  it('Returns date for three delimited values using non-US locale', () => {
    const p = buildDateParser(fakeCurrentDate, { localeOverride: 'fr' });
    const result = p.parse('1-2-2000');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2000-02-01T00:00:00'));
  });

  it('Returns date for three delimited values with leading zeros', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('01-02-2000');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2000-01-02T00:00:00'));
  });

  it('Returns date for two delimited values using US locale', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1-2');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-01-02T00:00:00'));
  });

  it('Returns date for two delimited values using non-US locale', () => {
    const p = buildDateParser(fakeCurrentDate, { localeOverride: 'fr' });
    const result = p.parse('1-2');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-02-01T00:00:00'));
  });

  it('Returns date when multiple delimiters are used', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1, 20, 2000');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2000-01-20T00:00:00'));
  });

  it('Fails to return a date for invalid day', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('2-31-2000');
    expect(result.status).toBe(false);
  });

  it('Fails to return a date for invalid month', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('13-1-2000');
    expect(result.status).toBe(false);
  });

  it('Fails to return a date for invalid small year', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1-15-999');
    expect(result.status).toBe(false);
  });

  it('Fails to return a date for invalid large year', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1-15-10000');
    expect(result.status).toBe(false);
  });
});
