import { SITE_LANG, SITE_REGION } from '../consts';

interface YearMonth {
  year: number;
  month: number;
}

function convertYearMonthToDate({ year, month }: YearMonth) {
  return new Date(Date.UTC(year, month - 1));
}

const locale = `${SITE_LANG}-${SITE_REGION}`;

const yearMonthFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
});

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

export function renderYearMonthRangeToHtml(startYearMonth: YearMonth, endYearMonth?: YearMonth) {
  const startHtml = renderYearMonthToHtml(startYearMonth);
  const parts = [startHtml, '&ndash;'];
  if (endYearMonth) {
    const endHtml = renderYearMonthToHtml(endYearMonth);
    parts.push(endHtml);
  }
  return parts.join(' ');
}
