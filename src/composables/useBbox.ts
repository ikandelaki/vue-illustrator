import { computed } from "vue";
import { useObjectsStore } from "../store/objects";
import { storeToRefs } from "pinia";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";
import { RectangleInterface } from "../model/Rectangle";
import { TriangleInterface } from "../model/Triangle";

export const useBbox = (offsetLength: number = 0) => {
  const objectsStore = useObjectsStore();
  const { selectedObject } = storeToRefs(objectsStore);

  const bbox = computed(() => {
    if (!selectedObject.value) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    if (selectedObject.value.type === SHAPE_TYPES.circle) {
      const circle = selectedObject.value as CircleInterface;

      return {
        x: circle.cx - circle.radius - offsetLength,
        y: circle.cy - circle.radius - offsetLength,
        width: (circle.radius + offsetLength) * 2,
        height: (circle.radius + offsetLength) * 2,
      };
    }

    if (selectedObject.value.type === SHAPE_TYPES.rectangle) {
      const rectangle = selectedObject.value as RectangleInterface;

      return {
        x: rectangle.x - offsetLength,
        y: rectangle.y - offsetLength,
        width: rectangle.width,
        height: rectangle.height,
      };
    }

    if (selectedObject.value.type === SHAPE_TYPES.triangle) {
      const tri = selectedObject.value as TriangleInterface;

      const minX = Math.min(tri.x1, tri.x2, tri.x3);
      const maxX = Math.max(tri.x1, tri.x2, tri.x3);
      const minY = Math.min(tri.y1, tri.y2, tri.y3);
      const maxY = Math.max(tri.y1, tri.y2, tri.y3);

      return {
        x: minX - offsetLength,
        y: minY - offsetLength,
        width: maxX - minX + offsetLength * 2,
        height: maxY - minY + offsetLength * 2,
      };
    }

    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  });

  return { bbox };
};
