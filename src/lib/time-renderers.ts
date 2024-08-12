import { siteLang, siteRegion } from '../consts';

interface YearMonth {
  year: number;
  month: number;
}

const locale = `${siteLang}-${siteRegion}`;

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
  timeZone: 'Asia/Tokyo',
});

const yearMonthFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  timeZone: 'Asia/Tokyo',
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

function convertYearMonthToDate({ year, month }: YearMonth) {
  return new Date(Date.UTC(year, month - 1));
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

export function renderYearMonthRangeToHtml(
  startYearMonth: YearMonth,
  endYearMonth?: YearMonth | undefined,
) {
  const startHtml = renderYearMonthToHtml(startYearMonth);
  const parts = [startHtml, '&ndash;'];
  if (endYearMonth !== undefined) {
    const endHtml = renderYearMonthToHtml(endYearMonth);
    parts.push(endHtml);
  }
  return parts.join(' ');
}
