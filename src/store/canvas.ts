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

  // Resize the whole canvas by a scale (essentially the same as zooming in)
  // Will be used with wheel button mainly
  const resize = (newScaleVal: number, mouseX: number, mouseY: number) => {
    if (!newScaleVal) {
      return;
    }

    const oldScale = scale.value;
    const newScale = Math.max(0.1, Math.min(scale.value + newScaleVal, 5));

    // Calculate how far the mouse is from the current top-left of the canvas
    const dx = mouseX - offset.value.x;
    const dy = mouseY - offset.value.y;

    // Convert that distance into "Canvas Space" (unscaled coordinates)
    const canvasSpaceX = dx / oldScale;
    const canvasSpaceY = dy / oldScale;

    scale.value = newScale;

    // Adjust offsets so the point under the mouse stays under the mous
    offset.value.x = mouseX - canvasSpaceX * newScale;
    offset.value.y = mouseY - canvasSpaceY * newScale;
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
