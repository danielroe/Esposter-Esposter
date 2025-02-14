import { TodoListItem } from "@/models/tableEditor/todoList/TodoListItem";
import { useTableEditorStore } from "@/store/tableEditor";
import { useItemStore } from "@/store/tableEditor/item";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, test } from "vitest";

describe("Item Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("pushes", () => {
    const tableEditorStore = useTableEditorStore<TodoListItem>()();
    const { tableEditor } = storeToRefs(tableEditorStore);
    const itemStore = useItemStore();
    const { pushItemList } = itemStore;
    const newItem = new TodoListItem();

    expect(tableEditor.value.items.length).toStrictEqual(0);
    pushItemList([newItem]);
    expect(tableEditor.value.items.length).toStrictEqual(1);
    expect(tableEditor.value.items[0]).toStrictEqual(newItem);
  });

  test("initialises", () => {
    const tableEditorStore = useTableEditorStore<TodoListItem>()();
    const { tableEditor } = storeToRefs(tableEditorStore);
    const itemStore = useItemStore();
    const { initialiseItemList } = itemStore;
    const newItem = new TodoListItem();

    expect(tableEditor.value.items.length).toStrictEqual(0);
    initialiseItemList([newItem]);
    expect(tableEditor.value.items.length).toStrictEqual(1);
    expect(tableEditor.value.items[0]).toStrictEqual(newItem);
  });

  test("creates", () => {
    const tableEditorStore = useTableEditorStore<TodoListItem>()();
    const { tableEditor } = storeToRefs(tableEditorStore);
    const itemStore = useItemStore();
    const { createItem } = itemStore;
    const newItem = new TodoListItem();

    expect(tableEditor.value.items.length).toStrictEqual(0);
    createItem(newItem);
    expect(tableEditor.value.items.length).toStrictEqual(1);
    expect(tableEditor.value.items[0]).toStrictEqual(newItem);
  });

  test("updates", () => {
    const tableEditorStore = useTableEditorStore<TodoListItem>()();
    const { tableEditor } = storeToRefs(tableEditorStore);
    const itemStore = useItemStore();
    const { initialiseItemList, updateItem } = itemStore;
    const newItem = new TodoListItem();
    const updatedName = "updatedName";

    initialiseItemList([newItem]);
    expect(tableEditor.value.items[0].name).not.toStrictEqual(updatedName);
    updateItem({ ...newItem, name: updatedName });
    expect(tableEditor.value.items[0].name).toStrictEqual(updatedName);
  });

  test("deletes", () => {
    const tableEditorStore = useTableEditorStore<TodoListItem>()();
    const { tableEditor } = storeToRefs(tableEditorStore);
    const itemStore = useItemStore();
    const { initialiseItemList, deleteItem } = itemStore;
    const newItem = new TodoListItem();

    initialiseItemList([newItem]);
    expect(tableEditor.value.items.length).toStrictEqual(1);
    deleteItem(newItem.id);
    expect(tableEditor.value.items.length).toStrictEqual(0);
  });
});
