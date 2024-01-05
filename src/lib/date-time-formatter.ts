import { SITE_LANG, SITE_REGION } from '../consts';

const locale = `${SITE_LANG}-${SITE_REGION}`;

const defaultDateTimeFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
});

export function renderDateHtml(date: Date) {
  return `<time datetime="${date.toISOString()}">${defaultDateTimeFormatter.format(date)}</time>`;
}

// YYYY-MM
type ProjectDate = `${number}${number}${number}${number}-${number}${number}`;

const projectDateTimeFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
});

function renderProjectDateHtml(date: ProjectDate) {
  return `<time datetime="${date}">${projectDateTimeFormatter.format(Date.parse(date))}</time>`;
}

export function renderProjectDateRangeHtml(startDate: ProjectDate, endDate?: ProjectDate) {
  const parts = [renderProjectDateHtml(startDate), '&mdash;'];
  if (endDate) {
    parts.push(renderProjectDateHtml(endDate));
  }
  return parts.join(' ');
}
