import type { DataTableHeader } from "@/models/vuetify/DataTableHeader";
import dayjs from "dayjs";

export const surveyerHeaders: DataTableHeader[] = [
  { title: "Name", key: "name" },
  { title: "Created At", key: "createdAt", value: (item) => dayjs(item.createdAt).format("ddd, MMM D, YYYY h:mm A") },
  { title: "Updated At", key: "updatedAt", value: (item) => dayjs(item.updatedAt).format("ddd, MMM D, YYYY h:mm A") },
  { title: "Actions", key: "actions", sortable: false },
];
