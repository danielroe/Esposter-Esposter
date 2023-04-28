import { AItemEntity } from "@/models/tableEditor/AItemEntity";
import type { ItemCategoryDefinition } from "@/models/tableEditor/ItemCategoryDefinition";
import type { ItemEntityType } from "@/models/tableEditor/ItemEntityType";
import { ItemType } from "@/models/tableEditor/ItemType";
import { TodoList } from "@/models/tableEditor/todoList/TodoList";
import { VuetifyComponent } from "@/models/tableEditor/vuetifyComponent/VuetifyComponent";

export const tableEditorItemCategoryDefinitions: ItemCategoryDefinition<ItemType>[] = [
  {
    value: ItemType.TodoList,
    title: prettifyName(ItemType.TodoList),
    icon: "mdi-check",
    targetTypeKey: "type",
    create: () => new TodoList(),
  },
  {
    value: ItemType.VuetifyComponent,
    title: prettifyName(ItemType.VuetifyComponent),
    icon: "mdi-vuetify",
    targetTypeKey: "type",
    create: () => new VuetifyComponent(),
  },
];

class NullItem extends AItemEntity implements ItemEntityType<string> {
  type = "None";
}

const NULL_ITEM_CATEGORY_DEFINITION: ItemCategoryDefinition<string> = {
  value: "None",
  title: "None",
  icon: "mdi-help",
  targetTypeKey: "type",
  create: () => new NullItem(),
};

export const getItemCategoryDefinition = <T extends string, U extends AItemEntity & ItemEntityType<T>>(
  itemCategoryDefinitions: ItemCategoryDefinition<T>[],
  item: U
) =>
  itemCategoryDefinitions.find((icd) => icd.value === item[icd.targetTypeKey as keyof U]) ??
  NULL_ITEM_CATEGORY_DEFINITION;
