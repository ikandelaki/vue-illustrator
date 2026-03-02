import { defineStore } from "pinia";
import { ref } from "vue";
import { ContextMenuLocation } from "../types/ContextMenuLocation";

export const useContextMenuStore = defineStore("contextMenu", () => {
  const isContextMenuOpened = ref<boolean>(false);
  const contextMenuLocation = ref<ContextMenuLocation>({ x: 0, y: 0 });

  return { isContextMenuOpened, contextMenuLocation };
});
