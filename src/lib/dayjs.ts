import "dayjs/locale/ja";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("ja");
dayjs.tz.setDefault("Asia/Tokyo");

export { default } from "dayjs";
