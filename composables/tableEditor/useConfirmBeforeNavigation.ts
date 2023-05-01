import { useTableEditorStore } from "@/store/tableEditor";

export const useConfirmBeforeNavigation = () => {
  const tableEditorStore = useTableEditorStore()();
  const { isSavable } = storeToRefs(tableEditorStore);

  onBeforeRouteLeave(() => {
    if (isSavable.value && !window.confirm("Changes that you made may not be saved.")) return false;
  });

  const refreshListener = (e: BeforeUnloadEvent) => {
    if (!isSavable.value) return;
    e.preventDefault();
    e.returnValue = "";
  };
  onBeforeMount(() => window.addEventListener("beforeunload", refreshListener));
  onBeforeUnmount(() => window.removeEventListener("beforeunload", refreshListener));
};