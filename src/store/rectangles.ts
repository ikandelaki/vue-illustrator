import { defineStore } from "pinia";
import { ref } from "vue";
import {
  DEFAULT_RECT_HEIGHT,
  DEFAULT_RECT_WIDTH,
  RectangleInterface,
} from "../model/Rectangle";

export const useRectanglesStore = defineStore("rectangles", () => {
  const rectangles = ref<Record<number, RectangleInterface>>({});

  const createRectangle = (event: MouseEvent): void => {
    const { clientX = 0, clientY = 0 } = event ?? {};
    const id = Object.keys(rectangles.value).length + 1;

    const rect = {
      id,
      x: clientX,
      y: clientY,
      width: DEFAULT_RECT_WIDTH,
      height: DEFAULT_RECT_HEIGHT,
      rx: 0,
      ry: 0,
    };

    rectangles.value[id] = rect;
  };

  return { rectangles, createRectangle };
});
