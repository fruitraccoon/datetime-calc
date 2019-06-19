# datetime-calc

_Simple arithmetic calculation DSL to use when entering dates_

[![npm](https://img.shields.io/npm/v/datetime-calc.svg)](https://www.npmjs.com/package/datetime-calc)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/datetime-calc.svg?style=flat)](https://bundlephobia.com/result?p=datetime-calc)

This package utilised the current date to allow text in a simple Domain Specific Language to be parsed into a Date.  The intended usage is to handle text entered into a form input field, to allow a more flexible way to enter date values.

## What it does

Assuming the current date is the **2nd of March, 2019** and the browser locale short date format is **dd/mm/yyyy**, some example values for entering explicit dates are:

| Input        | Result     | Description                                               |
| ------------ | ---------- | --------------------------------------------------------- |
| "14/06/2019" | 2019-06-14 | Dates can be entered in full as per a standard date field |
| "6"          | 2019-03-06 | The sixth of the current month and year                   |
| "1204"       | 2019-04-12 | April 12th of the current year                            |
| "231222      | 2022-12-23 | Explicit date with two digit year and no separators       |
| "12.04.89"   | 1989-04-12 | Several common separators are supported                   |
| "3-4"        | 2019-04-03 | separators can be used for partial dates                  |
| "t"          | 2019-03-02 | "t" is a shorthand for the current date ("today")         |

Additionally, simple arithmetic is also available to build the new Dates.  Available values are (d)ays, (w)eeks, (m)onths and (y)ears. For example:

| Input     | Result     | Description                                     |
| --------- | ---------- | ----------------------------------------------- |
| "t+2m"    | 2019-05-02 | Today plus two months                           |
| "t-1w"    | 2019-02-23 | A week ago                                      |
| "t+2w-1d" | 2019-03-15 | Multiple terms are supported                    |
| "2512-2w" | 2019-12-11 | Two weeks before Christmas                      |
| "t+3"     | 2019-03-05 | "Days" is assumed if only a number is specified |  |
