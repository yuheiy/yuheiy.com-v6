import { siteLang, siteRegion } from '../consts';

const locale = `${siteLang}-${siteRegion}`;

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
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
