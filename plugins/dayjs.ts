import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default defineNuxtPlugin(() => {
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.extend(relativeTime);
});
