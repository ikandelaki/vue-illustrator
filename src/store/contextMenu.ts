import { defineStore } from "pinia";
import { ref } from "vue";
import { ContextMenuLocation } from "../types/ContextMenuLocation";

export const useContextMenuStore = defineStore("contextMenu", () => {
  const isContextMenuOpened = ref<boolean>(false);
  const contextMenuLocation = ref<ContextMenuLocation>({ x: 0, y: 0 });
  const selectedMenuItemIndex = ref<number | null>(null);

  const setSelectedMenuItemIndex = (idx?: number | null) => {
    if (!idx || idx === null) {
      selectedMenuItemIndex.value = null;
      return;
    }

    selectedMenuItemIndex.value = idx;
  };

  const setIsContextMenuOpened = (val?: boolean) => {
    if (val === undefined) {
      isContextMenuOpened.value = true;
      return;
    }

    isContextMenuOpened.value = val;
  };

  const setContextMenuLocation = (x: number, y: number) => {
    contextMenuLocation.value = { x, y };
  };

  return {
    isContextMenuOpened,
    contextMenuLocation,
    selectedMenuItemIndex,
    setSelectedMenuItemIndex,
    setIsContextMenuOpened,
    setContextMenuLocation,
  };
});
