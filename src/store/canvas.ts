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
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
  });
  // If scale is 1, then current viewport is 800x450, if it is 1600x900, it will be 2, etc.
  const scale = ref<number>(1);

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

  // Resize the whole canvas by a scale (essentially the same as zooming in)
  // Will be used with wheel button mainly
  const resize = (newScaleVal: number) => {
    if (!newScaleVal) {
      return;
    }

    const newScale = scale.value + newScaleVal;
    const newWidth = INITIAL_WIDTH * newScale;

    if (newWidth <= 100) {
      return;
    }

    dimensions.value.width = newWidth;
    dimensions.value.height = INITIAL_HEIGHT * newScale;

    scale.value = newScale;
  };

  return {
    dimensions,
    scale,
    setDimensions,
    resize,
  };
});
