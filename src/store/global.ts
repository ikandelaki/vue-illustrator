import { defineStore } from "pinia";
import { ref } from "vue";

export const DEFAULT_SIZE = 50;
export const MIN_SIZE = 1;
export const MAX_SIZE = 1000;

export const useGlobalStore = defineStore("global", () => {
  const size = ref<number>(50);
  const color = ref<string>('#ffffff');

  const setSize = (val: number) => {
    if (val < MIN_SIZE || val > MAX_SIZE) {
      console.error(
        `Size should be more than ${MIN_SIZE} and less than ${MAX_SIZE}`,
      );
      return;
    }

    size.value = val;
  };

  const setColor = (val: string) => {
	  if (!val) {
	  	console.error("Color should be a proper string");
		return;
	  }

	  color.value = val;
  }

  return {
    size,
    setSize,
	color,
	setColor
  };
});
