import { buildDateParser } from './dateParser';

const fakeCurrentDate = () => new Date('2019-01-01T01:02:03');

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

describe('parse tests for non-delimited date input', () => {
  it('Returns date for single digit', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('5');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-01-05T00:00:00'));
  });

  it('Returns date for two digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('23');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-01-23T00:00:00'));
  });

  it('Returns date for two digits with leading zero', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('03');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-01-03T00:00:00'));
  });

  it('Fails to return a date for invalid two digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('32');
    expect(result.status).toBe(false);
  });

  it('Fails to return a date for three digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('123');
    expect(result.status).toBe(false);
  });

  it('Returns date for four digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1221');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-12-21T00:00:00'));
  });

  it('Returns date for four digits using non-US locale', () => {
    const p = buildDateParser(fakeCurrentDate, { localeOverride: 'fr' });
    const result = p.parse('2112');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-12-21T00:00:00'));
  });

  it('Fails to return a date for five digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('21189');
    expect(result.status).toBe(false);
  });

  it('Returns date for six digits with 2000 millennium year', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('122110');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2010-12-21T00:00:00'));
  });

  it('Returns date for six digits with 1900 millennium year', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('122189');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('1989-12-21T00:00:00'));
  });

  it('Fails to return a date for seven digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('1211989');
    expect(result.status).toBe(false);
  });

  it('Returns date for eight digits', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('12212010');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2010-12-21T00:00:00'));
  });
});

describe('parse tests for special case date input', () => {
  it('Returns current date for "t"', () => {
    const p = buildDateParser(fakeCurrentDate);
    const result = p.parse('t');
    expect(result.status).toBe(true);
    expect(result.status && result.value).toStrictEqual(new Date('2019-01-01T00:00:00'));
  });
});
