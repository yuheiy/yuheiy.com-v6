import { SITE_LANG, SITE_REGION } from '../consts';

const locale = `${SITE_LANG}-${SITE_REGION}`;

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
});

export function renderDateToHtml(date: Date) {
  let html = '';
  html += `<time datetime="${date.toISOString()}">`;
  html += dateFormatter.format(date);
  html += `</time>`;
  return html;
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

const yearMonthFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
});

export function renderYearMonthRangeToHtml(startYearMonth: YearMonth, endYearMonth?: YearMonth) {
  const startHtml = renderYearMonthToHtml(startYearMonth);
  const parts = [startHtml, '&mdash;'];
  if (endYearMonth) {
    const endHtml = renderYearMonthToHtml(endYearMonth);
    parts.push(endHtml);
  }
  return parts.join(' ');
}

function renderYearMonthToHtml(yearMonth: YearMonth) {
  const date = convertYearMonthToDate(yearMonth);
  let html = '';
  html += `<time datetime="${date.toISOString().slice(0, 7)}">`;
  html += yearMonthFormatter.format(date);
  html += `</time>`;
  return html;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('renderYearMonthToHtml', () => {
    expect(renderYearMonthToHtml({ year: 2000, month: 1 })).toMatchInlineSnapshot(
      `"<time datetime="2000-01">2000年1月</time>"`,
    );
  });
}

function convertYearMonthToDate({ year, month }: YearMonth) {
  return new Date(Date.UTC(year, month - 1));
}
