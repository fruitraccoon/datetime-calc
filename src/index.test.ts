import { buildParser } from './index';

describe('Interface tests', () => {
  it('Has a buildParser export', () => {
    expect(buildParser()).not.toBeFalsy;
  });
});
