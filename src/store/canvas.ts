import { defineStore } from "pinia";
import { ref } from "vue";

export const INITIAL_WIDTH = 1920;
export const INITIAL_HEIGHT = 1080;
export const FULL_WIDTH = 1920;
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 5;
export const ZOOM_SENSITIVITY = 0.1;

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
  const scale = ref<number>(0.8);
  const transform = ref<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const setScale = (newScale: number) => {
    scale.value = newScale;

    dimensions.value.width = INITIAL_WIDTH * newScale;
    dimensions.value.height = INITIAL_HEIGHT * newScale;
  };

  // Resize the whole canvas by a scale (essentially the same as zooming in)
  // Will be used with wheel button mainly
  const zoom = (factor: number, mouseX: number, mouseY: number) => {
    const oldScale = scale.value;
    let newScale = oldScale + factor;

    newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

    const worldX = (mouseX - transform.value.x) / oldScale;
    const worldY = (mouseY - transform.value.y) / oldScale;

    transform.value.x = mouseX - worldX * newScale;
    transform.value.y = mouseY - worldY * newScale;

    scale.value = newScale;
  };

  const setTransform = (x: number, y: number) => {
    transform.value.x = x;
    transform.value.y = y;
  };

  return {
    dimensions,
    scale,
    setDimensions,
    zoom,
    transform,
    setTransform,
  };
});
