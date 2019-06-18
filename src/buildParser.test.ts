import buildParser from './buildParser';

const fakeCurrentDate = () => new Date('2019-01-01T01:02:03');

describe('parse tests for date only', () => {
  it('Returns when special value date only', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t');
    expect(result).toStrictEqual(new Date('2019-01-01T00:00:00'));
  });

  it('Returns when date only and surrounded by whitespace', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse(' t ');
    expect(result).toStrictEqual(new Date('2019-01-01T00:00:00'));
  });

  it('Returns when special value date only', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('2');
    expect(result).toStrictEqual(new Date('2019-01-02T00:00:00'));
  });
});

describe('parse tests for term maths', () => {
  it('Returns when one term included', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+1d');
    expect(result).toStrictEqual(new Date('2019-01-02T00:00:00'));
  });

  it('Returns when one term included defaulting to days', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+1');
    expect(result).toStrictEqual(new Date('2019-01-02T00:00:00'));
  });

  it('Returns when one term included with whitespace', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t +1d');
    expect(result).toStrictEqual(new Date('2019-01-02T00:00:00'));
  });

  it('Returns when two terms included', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+2w+1d');
    expect(result).toStrictEqual(new Date('2019-01-16T00:00:00'));
  });

  it('Returns when two terms included with whitespace', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t +2w +1d');
    expect(result).toStrictEqual(new Date('2019-01-16T00:00:00'));
  });

  it('Returns when all ValueFactors included', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+2y+2m+2w+2d');
    expect(result).toStrictEqual(new Date('2021-03-17T00:00:00'));
  });

  it('Returns when days cause result in following month', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+31d');
    expect(result).toStrictEqual(new Date('2019-02-01T00:00:00'));
  });

  it('Returns when days cause result in previous month', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t-1d');
    expect(result).toStrictEqual(new Date('2018-12-31T00:00:00'));
  });

  it('Returns when days cause result in following year', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+365d');
    expect(result).toStrictEqual(new Date('2020-01-01T00:00:00'));
  });

  it('Returns when days cause result in previous year', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t-365d');
    expect(result).toStrictEqual(new Date('2018-01-01T00:00:00'));
  });

  it('Returns when weeks cause result in following month', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+5w');
    expect(result).toStrictEqual(new Date('2019-02-05T00:00:00'));
  });

  it('Returns when months cause result in following year', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+13m');
    expect(result).toStrictEqual(new Date('2020-02-01T00:00:00'));
  });
});

describe('parse tests for including terms', () => {
  it('Returns when special value date with term', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse('t+1d');
    expect(result).toStrictEqual(new Date('2019-01-02T00:00:00'));
  });

  it('Returns when non-delimited date with term', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate, localeOverride: 'en-AU' });
    const result = p.parse('1203+1d');
    expect(result).toStrictEqual(new Date('2019-03-13T00:00:00'));
  });

  it('Returns when delimited date with term', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate, localeOverride: 'en-AU' });
    const result = p.parse('12.03+1d');
    expect(result).toStrictEqual(new Date('2019-03-13T00:00:00'));
  });

  it('Returns when delimited date contains hyphen with term', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate, localeOverride: 'en-AU' });
    const result = p.parse('12-03+1d');
    expect(result).toStrictEqual(new Date('2019-03-13T00:00:00'));
  });
});
