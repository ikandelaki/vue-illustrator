import { defineStore } from "pinia";
import { ref } from "vue";

export const INITIAL_WIDTH = 800;
export const INITIAL_HEIGHT = 450;
export const FULL_WIDTH = 1920;
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 5;
export const SCALE_STEP = 0.1;

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
  const offset = ref<{ x: number; y: number }>({ x: 0, y: 0 });

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
  const resize = (delta: number, mouseX: number, mouseY: number) => {
    const oldScale = scale.value;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale + delta));

    if (newScale === oldScale) return;

    // Which canvas-space point is currently under the mouse?
    // mouseX = canvasX * oldScale + offset.x
    const canvasX = (mouseX - offset.value.x) / oldScale;
    const canvasY = (mouseY - offset.value.y) / oldScale;

    setScale(newScale);

    // Recompute offset so that same canvas point lands back under the mouse:
    // mouseX = canvasX * newScale + newOffset.x
    offset.value = {
      x: mouseX - canvasX * newScale,
      y: mouseY - canvasY * newScale,
    };
  };

  const setOffset = (x: number, y: number) => {
    offset.value.x = x;
    offset.value.y = y;
  };

  return {
    dimensions,
    scale,
    setDimensions,
    resize,
    offset,
    setOffset,
  };
});
