import * as P from 'parsimmon';
import { digits, digitsTyped } from './coreParsers';

export interface IDateParserOptions {
  localeOverride?: string | string[];
}

export function buildDateParser(getCurrentDate: () => Date, options?: IDateParserOptions) {
  const orderedDateParts = getOrderedShortDateParts(options && options.localeOverride);

  const dateSep = P.oneOf(',-/ .').atLeast(1);

  const twoDigits = P.regexp(/\d{2}/).desc('Two digits');
  const fourDigits = P.regexp(/\d{4}/).desc('Four digits');

  const specialCaseDateParser = P.string('t').map(() => {
    // "t" for "today" - current date at midnight
    const d = getCurrentDate();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const delimitedDateParser = P.seq(
    digitsTyped,
    dateSep,
    digitsTyped,
    dateSep.fallback<string[]>([]),
    digitsTyped.fallback(undefined)
  ).map(([p1, _s, p2, _s2, p3]) => {
    return buildDateFromParts(getCurrentDate, orderedDateParts, [p1, p2, p3]);
  });

  const nonDelimitedDateParser = digits.chain(nStr => {
    switch (nStr.length) {
      case 1:
      case 2:
        return P.succeed(
          buildDateFromParts(getCurrentDate, orderedDateParts, [
            Number.parseInt(nStr, 10),
            undefined,
            undefined,
          ])
        );

      case 4: {
        const p = twoDigits
          .map(n => Number.parseInt(n, 10))
          .times(2)
          .map(r =>
            buildDateFromParts(getCurrentDate, orderedDateParts, r as [
              number,
              number,
              number | undefined
            ])
          )
          .parse(nStr);
        return p.status ? P.succeed(p.value) : P.fail(`Invalid date '${nStr}'`);
      }

      case 6: {
        const p = twoDigits
          .map(n => Number.parseInt(n, 10))
          .times(3)
          .map(r =>
            buildDateFromParts(getCurrentDate, orderedDateParts, r as [number, number, number])
          )
          .parse(nStr);
        return p.status ? P.succeed(p.value) : P.fail(`Invalid date '${nStr}'`);
      }

      case 8:
        const p = P.seq(twoDigits, twoDigits, fourDigits)
          .map(ns => ns.map(n => Number.parseInt(n, 10)))
          .map(r =>
            buildDateFromParts(getCurrentDate, orderedDateParts, r as [number, number, number])
          )
          .parse(nStr);
        return p.status ? P.succeed(p.value) : P.fail(`Invalid date '${nStr}'`);

      default:
        return P.fail(`Invalid date '${nStr}'`);
    }
  });

  return P.alt(specialCaseDateParser, delimitedDateParser, nonDelimitedDateParser).chain(d =>
    d === null ? P.fail('Invalid') : P.succeed(d)
  );
}

type DatePart = 'year' | 'month' | 'day';

interface IDatePartMap {
  day: number;
  month?: number;
  year?: number;
}

function buildDateFromParts(
  getCurrentDate: () => Date,
  orderedDateParts: [DatePart, DatePart, DatePart],
  inputDateParts: [number, number | undefined, number | undefined]
) {
  const inputs = inputDateParts.filter(p => !!p);
  const ordered =
    inputs.length === 1
      ? orderedDateParts.filter(p => p === 'day')
      : inputs.length === 2
      ? orderedDateParts.filter(p => p !== 'year')
      : orderedDateParts;

  const map = ordered.reduce((acc, p, i) => ({ ...acc, [p]: inputs[i] }), {} as IDatePartMap);

  const currentDate = getCurrentDate();
  const currentYear = currentDate.getFullYear();
  return getDate(
    convertTwoDigitYear(map.year || currentYear, currentYear),
    map.month || currentDate.getMonth() + 1,
    map.day
  );
}

function convertTwoDigitYear(input: number, currentYear: number) {
  if (input >= 100) {
    return input;
  }
  return Math.abs(input + 2000 - currentYear) > 50 ? input + 1900 : input + 2000;
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
