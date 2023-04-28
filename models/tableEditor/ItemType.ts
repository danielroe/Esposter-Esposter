import { z } from "zod";

export enum ItemType {
  TodoList = "TodoList",
  VuetifyComponent = "VuetifyComponent",
}

export const itemTypeSchema = z.nativeEnum(ItemType) satisfies z.ZodType<ItemType>;
