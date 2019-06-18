import * as P from 'parsimmon';

export const digits = P.regex(/\d+/).desc('Digits');
export const digitsTyped = digits.map(n => Number.parseInt(n, 10));
