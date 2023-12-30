import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(localizedFormat);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(timezone);

// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale('ja');
dayjs.tz.setDefault('Asia/Tokyo');

export { default } from 'dayjs';
