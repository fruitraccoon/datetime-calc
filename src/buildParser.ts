import * as P from 'parsimmon';
import { buildDateParser, IDateParserOptions } from './parsers/dateParser';

export interface IParseOptions extends IDateParserOptions {
  getCurrentDate?: () => Date;
}

export interface IParser {
  parse: (input: string) => Date | null;
}

const defaultGetCurrentDate = () => new Date();

export default function buildParser(options?: IParseOptions): IParser {
  const getCurrentDate = (options && options.getCurrentDate) || defaultGetCurrentDate;
  const dateParser = buildDateParser(getCurrentDate, options);
  const p = dateParser.trim(P.optWhitespace);

  return {
    parse: (input: string) => {
      const result = p.parse(input);
      return result.status ? result.value : null;
    },
  };
}
