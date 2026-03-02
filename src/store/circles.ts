import { ContextMenuLocation } from "./../types/ContextMenuLocation";
import { useContextMenuStore } from "./contextMenu";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import Circle, { CircleInterface } from "../model/Circle";
import { RectangleInterface } from "../model/Rectangle";

export const useCirclesStore = defineStore("circles", () => {
  const circles = ref<Record<number, CircleInterface>>({});
  const selectedCircleId = ref<number | null>(null);
  const contextMenuStore = useContextMenuStore();
  const { isContextMenuOpened, contextMenuLocation } =
    storeToRefs(contextMenuStore);

  const selectedCircleRadius = computed(() => {
    if (!selectedCircleId.value) {
      return 0;
    }

    const circle = circles.value[selectedCircleId.value];
    return circle ? circle.getRadius() : 0;
  });

  const setSelectedCircleRadius = (value?: number) => {
    if (!selectedCircleId.value || !value) {
      return;
    }

    const circle = circles.value[selectedCircleId.value];
    if (!circle) {
      return;
    }

    const radius = Math.min(value, 1000);
    circle.setRadius(radius);
  };

  const selectedCircleColor = computed(() => {
    if (!selectedCircleId.value) {
      return "#ffffff";
    }

    return circles.value[selectedCircleId.value].getColor();
  });

  const setSelectedCircleColor = (value?: string) => {
    if (!selectedCircleId.value || !value) {
      return;
    }

    circles.value[selectedCircleId.value].setColor(value);
  };
  /**
   * Opens up custom context menu to manage circle properties.
   * If called without arguments, deselects all circles.
   */
  const selectCircle = (event?: MouseEvent, id?: number | null): void => {
    const { clientX = 0, clientY = 0 } = event ?? {};
    selectedCircleId.value = id ?? null;

    if (!id) {
      isContextMenuOpened.value = false;
      return;
    }

    isContextMenuOpened.value = true;
    contextMenuLocation.value = { x: clientX, y: clientY };
  };
  // typed event handler for SVG click
  const createCircle = (event: MouseEvent): void => {
    selectCircle(); // Deselect current selection

    const { clientX, clientY } = event;
    const id = Object.keys(circles.value).length + 1;
    const circle = new Circle(id, clientX, clientY);

    circles.value[id] = circle;
  };

  return {
    circles,
    selectedCircleId,
    selectedCircleRadius,
    setSelectedCircleRadius,
    selectedCircleColor,
    setSelectedCircleColor,
    createCircle,
    selectCircle,
  };
});
