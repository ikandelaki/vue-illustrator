import { defineStore } from "pinia";
import { ref } from "vue";

export const MIN_SIZE = 1;
export const MAX_SIZE = 1000;

export const useGlobalStore = defineStore("global", () => {
  const size = ref<number>(50);

  const setSize = (val: number) => {
    if (val < MIN_SIZE || val > MAX_SIZE) {
      console.error(
        `Size should be more than ${MIN_SIZE} and less than ${MAX_SIZE}`,
      );
      return;
    }

    size.value = val;
  };

  return {
    size,
    setSize,
  };
});
