import buildParser from './buildParser';

const testDate = new Date('2019-01-01T01:02:03');
const fakeCurrentDate = () => testDate;

describe('parse tests for date only', () => {
  it('Returns date when surrounded by whitespace', () => {
    const p = buildParser({ getCurrentDate: fakeCurrentDate });
    const result = p.parse(' t ');
    expect(result).toStrictEqual(new Date('2019-01-01T00:00:00'));
  });
});
