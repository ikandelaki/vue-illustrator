import { defineStore } from "pinia";
import { SHAPE_TYPES, ShapeType } from "../types/ShapeTypes";
import { ref } from "vue";

export const useSelectedShapeStore = defineStore("selectedShape", () => {
  const selectedShape = ref<ShapeType>(SHAPE_TYPES.circle);

  const setSelectedShape = (value: ShapeType) => {
    if (!(value in SHAPE_TYPES)) {
      console.error(">> setSelectedShape: not a correct shape type");
      return;
    }

    if (value === selectedShape.value) {
      return;
    }

    selectedShape.value = value;
  };

  return { selectedShape, setSelectedShape };
});
