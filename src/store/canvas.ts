import { defineStore } from "pinia";
import { ref } from "vue";

export const INITIAL_WIDTH = 800;
export const INITIAL_HEIGHT = 450;
export const FULL_WIDTH = 1920;

type CanvasDimensions = {
  width: number;
  height: number;
};

export const useCanvasStore = defineStore("canvas", () => {
  const dimensions = ref<CanvasDimensions>({
    width: INITIAL_HEIGHT,
    height: INITIAL_HEIGHT,
  });
  const scale = ref<number>(FULL_WIDTH / INITIAL_HEIGHT);

  // Adjust the dimensions of a canvas
  // - Will be useful for defining custom project size
  const setDimensions = (width: number, height?: number) => {
    if (!width) {
      return;
    }

    if (!height) {
      const ratio = dimensions.value.width / dimensions.value.height;
      const scaledHeight = width * ratio;
      dimensions.value.width = width;
      dimensions.value.height = scaledHeight;
    }

    dimensions.value.width = width;
    dimensions.value.height = height as number;
  };

  // Resize the whole canvas by a scale
  // Will be used with wheel button mainly
  const resize = (newScale: number) => {
    if (!newScale) {
      return;
    }

    dimensions.value.width *= newScale;
    dimensions.value.height *= newScale;
    scale.value = newScale;
  };

  return {
    dimensions,
    setDimensions,
    resize,
  };
});
