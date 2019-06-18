import * as P from 'parsimmon';
import { digitsTyped } from './coreParsers';

type Operator = '+' | '-';
type ValueFactor = 'd' | 'w' | 'm' | 'y';

export interface ITerm {
  coefficient: number;
  valueFactor: ValueFactor;
}

const operator = P.oneOf('+-') as P.Parser<Operator>;
const coefficient = digitsTyped.fallback(1);
const valueFactor = P.oneOf('dwmy').fallback('d') as P.Parser<ValueFactor>;

export const termParser = P.seqMap(operator, coefficient, valueFactor, (o, c, v) => {
  return {
    coefficient: o === '+' ? c : c * -1,
    valueFactor: v,
  } as ITerm;
});
