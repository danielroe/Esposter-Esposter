import { AItemEntity, aItemEntitySchema } from "@/models/shared/AItemEntity";
import type { ItemEntityType } from "@/models/tableEditor/ItemEntityType";
import { createItemEntityTypeSchema } from "@/models/tableEditor/ItemEntityType";
import { TodoListItemType, todoListItemTypeSchema } from "@/models/tableEditor/todoList/TodoListItemType";

export class TodoListItem extends AItemEntity implements ItemEntityType<TodoListItemType> {
  type = TodoListItemType.Todo;
  notes = "";
}

export const todoListItemSchema = aItemEntitySchema.merge(createItemEntityTypeSchema(todoListItemTypeSchema));
