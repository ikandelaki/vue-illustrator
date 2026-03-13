import { defineStore } from "pinia";
import { ref } from "vue";

type CanvasDimensions = {
  width: number;
  height: number;
};

export const useCanvasStore = defineStore("canvas", () => {
  const dimensions = ref<CanvasDimensions>({ width: 800, height: 450 });

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
  const resize = (scale: number) => {
    if (!scale) {
      return;
    }

    dimensions.value.width *= scale;
    dimensions.value.height *= scale;
  };

  return {
    dimensions,
    setDimensions,
    resize,
  };
});
