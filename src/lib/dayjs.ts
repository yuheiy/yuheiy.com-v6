import dayjs from "dayjs";
// eslint-disable-next-line import/no-unassigned-import
import "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("ja");
dayjs.tz.setDefault("Asia/Tokyo");

export { default } from "dayjs";
