import { SITE_LANG, SITE_REGION } from '../consts';

const locale = `${SITE_LANG}-${SITE_REGION}`;

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
});

export function renderDateToHtml(date: Date) {
  return `<time datetime="${date.toISOString()}">${dateFormatter.format(date)}</time>`;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('renderDateToHtml', () => {
    expect(renderDateToHtml(new Date('2000-01-01'))).toMatchInlineSnapshot(
      `"<time datetime="2000-01-01T00:00:00.000Z">2000年1月1日</time>"`,
    );
  });
}

interface YearMonth {
  year: number;
  month: number;
}

function convertYearMonthToDate({ year, month }: YearMonth) {
  return new Date(Date.UTC(year, month - 1));
}

const yearMonthFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
});

function renderYearMonthToHtml(yearMonth: YearMonth) {
  const date = convertYearMonthToDate(yearMonth);
  return `<time datetime="${date.toISOString().slice(0, 7)}">${yearMonthFormatter.format(
    date,
  )}</time>`;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('renderYearMonthToHtml', () => {
    expect(renderYearMonthToHtml({ year: 2000, month: 1 })).toMatchInlineSnapshot(
      `"<time datetime="2000-01">2000年1月</time>"`,
    );
  });
}

export function renderYearMonthRangeToHtml(startYearMonth: YearMonth, endYearMonth?: YearMonth) {
  const parts = [renderYearMonthToHtml(startYearMonth), '&mdash;'];
  if (endYearMonth) {
    parts.push(renderYearMonthToHtml(endYearMonth));
  }
  return parts.join(' ');
}
