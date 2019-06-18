import * as P from 'parsimmon';
import { buildDateParser, IDateParserOptions } from './parsers/dateParser';
import { termParser, ITerm } from './parsers/termParser';

export interface IParseOptions extends IDateParserOptions {
  getCurrentDate?: () => Date;
}

export interface IParser {
  parse: (input: string) => Date | null;
}

const defaultGetCurrentDate = () => new Date();

export default function buildParser(options?: IParseOptions): IParser {
  const getCurrentDate = (options && options.getCurrentDate) || defaultGetCurrentDate;
  const dParser = buildDateParser(getCurrentDate, options).trim(P.optWhitespace);
  const tParser = termParser.trim(P.optWhitespace);

  const p = P.seqMap(dParser, tParser.many(), (d, ts) =>
    ts.reduce((acc, t) => applyTerm(acc, t), d)
  );

  return {
    parse: (input: string) => {
      const result = p.parse(input);
      return result.status ? result.value : null;
    },
  };
}

function applyTerm(date: Date, term: ITerm) {
  switch (term.valueFactor) {
    case 'd':
      date.setDate(term.coefficient + date.getDate());
      break;
    case 'w':
      date.setDate(term.coefficient * 7 + date.getDate());
      break;
    case 'm':
      date.setMonth(term.coefficient + date.getMonth());
      break;
    case 'y':
      date.setFullYear(term.coefficient + date.getFullYear());
      break;
    default:
      throw new Error(`ValueFactor '${term.valueFactor}' is not supported`);
  }
  return date;
}
