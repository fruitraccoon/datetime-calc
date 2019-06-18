import * as P from 'parsimmon';

export interface IDateParserOptions {
  localeOverride?: string | string[];
}

type DatePart = 'year' | 'month' | 'day';

interface IDatePartMap {
  day: number;
  month: number;
  year?: number;
}

export function buildDateParser(getCurrentDate: () => Date, options?: IDateParserOptions) {
  const orderedDateParts = getOrderedShortDateParts(options && options.localeOverride);

  const dateSep = P.oneOf(',-/ .').atLeast(1);

  const digits = P.regex(/\d+/).desc('Digits');
  const digitsTyped = digits.map(n => Number.parseInt(n, 10));

  const delimitedDateParser = P.seq(
    digitsTyped,
    dateSep,
    digitsTyped,
    dateSep.fallback<string[]>([]),
    digitsTyped.fallback(undefined)
  )
    .map(([p1, _s, p2, _s2, p3]) => {
      // If there is no year entered, then ignore the year positioning
      const parts = p3 === null ? orderedDateParts.filter(p => p !== 'year') : orderedDateParts;
      const inputs = p3 === null ? [p1, p2] : [p1, p2, p3];

      const map = parts.reduce((acc, p, i) => ({ ...acc, [p]: inputs[i] }), {} as IDatePartMap);

      return getDate(map.year || getCurrentDate().getFullYear(), map.month, map.day);
    })
    .chain(d => (d === null ? P.fail('Invalid') : P.succeed(d)));

  return delimitedDateParser;
}

function getDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const dYear = date.getFullYear();
  return dYear <= 9999 &&
    dYear >= 1000 &&
    dYear === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

function getOrderedShortDateParts(localeOverride?: string | string[]) {
  return new Intl.DateTimeFormat(localeOverride, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
    .formatToParts()
    .filter(p => p.type === 'day' || p.type === 'month' || p.type === 'year')
    .map(p => p.type as DatePart) as [DatePart, DatePart, DatePart];
}
