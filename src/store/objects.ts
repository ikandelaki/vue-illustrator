import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import Circle, { CircleInterface } from "../model/Circle";
import Rectangle, { RectangleInterface } from "../model/Rectangle";
import { useContextMenuStore } from "./contextMenu";
import { ShapeType, CIRCLE, RECTANGLE } from "../types/ShapeTypes";

type ShapeObject = CircleInterface | RectangleInterface;

export const useObjectsStore = defineStore("objects", () => {
  const objects = ref<Record<number, ShapeObject>>({});
  const selectedObjectId = ref<number | null>(null);
  const selectedObjectType = ref<ShapeType | null>(null);
  const contextMenuStore = useContextMenuStore();
  const { isContextMenuOpened, contextMenuLocation } =
    storeToRefs(contextMenuStore);

  /**
   * Get the selected object (could be circle or rectangle)
   */
  const selectedObject = computed(() => {
    if (!selectedObjectId.value) return null;
    return objects.value[selectedObjectId.value] ?? null;
  });

  /**
   * Get radius if selected object is a circle, otherwise 0
   */
  const selectedObjectRadius = computed(() => {
    const obj = selectedObject.value;
    if (!obj || obj.type !== CIRCLE) return 0;
    return (obj as CircleInterface).getRadius();
  });

  /**
   * Set radius of selected circle
   */
  const setSelectedObjectRadius = (value?: number) => {
    if (!selectedObjectId.value || !value) return;
    const obj = objects.value[selectedObjectId.value];
    if (!obj || obj.type !== CIRCLE) return;
    const radius = Math.min(value, 1000);
    (obj as CircleInterface).setRadius(radius);
  };

  /**
   * Get color of selected object
   */
  const selectedObjectColor = computed(() => {
    const obj = selectedObject.value;
    if (!obj) return "#ffffff";
    return obj.getColor();
  });

  /**
   * Set color of selected object
   */
  const setSelectedObjectColor = (value?: string) => {
    if (!selectedObjectId.value || !value) return;
    const obj = objects.value[selectedObjectId.value];
    if (!obj) return;
    obj.setColor(value);
  };

  /**
   * Select an object and open context menu
   */
  const selectObject = (
    event?: MouseEvent,
    id?: number | null,
    type?: ShapeType,
  ): void => {
    const { clientX = 0, clientY = 0 } = event ?? {};
    selectedObjectId.value = id ?? null;
    selectedObjectType.value = type ?? null;

    if (!id) {
      isContextMenuOpened.value = false;
      return;
    }

    isContextMenuOpened.value = true;
    contextMenuLocation.value = { x: clientX, y: clientY };
  };

  /**
   * Create a new object (circle or rectangle)
   */
  const createObject = (shapeType: ShapeType, event: MouseEvent): void => {
    selectObject(); // Deselect current selection

    const { clientX, clientY } = event;
    const id = Math.max(...Object.keys(objects.value).map(Number), 0) + 1;

    if (shapeType === CIRCLE) {
      const circle = new Circle(id, clientX, clientY);
      objects.value[id] = circle;
    } else if (shapeType === RECTANGLE) {
      const rectangle = new Rectangle(id, clientX, clientY);
      objects.value[id] = rectangle;
    }
  };

  /**
   * Get circles from objects
   */
  const circles = computed(() => {
    return Object.fromEntries(
      Object.entries(objects.value).filter(([_, obj]) => obj.type === CIRCLE),
    ) as Record<number, CircleInterface>;
  });

  /**
   * Get rectangles from objects
   */
  const rectangles = computed(() => {
    return Object.fromEntries(
      Object.entries(objects.value).filter(
        ([_, obj]) => obj.type === RECTANGLE,
      ),
    ) as Record<number, RectangleInterface>;
  });

  return {
    objects,
    circles,
    rectangles,
    selectedObjectId,
    selectedObjectType,
    selectedObjectRadius,
    setSelectedObjectRadius,
    selectedObjectColor,
    setSelectedObjectColor,
    selectObject,
    createObject,
  };
});
