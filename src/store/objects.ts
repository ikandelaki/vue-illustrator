import { useSelectedShapeStore } from "./selectedShape";
import { useCanvasStore } from "./canvas";
import Triangle, {
  DEFAULT_TRIANGLE_WIDTH,
  TriangleInterface,
} from "./../model/Triangle";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import Circle, { CircleInterface } from "../model/Circle";
import Rectangle, {
  DEFAULT_RECT_HEIGHT,
  DEFAULT_RECT_WIDTH,
  RectangleInterface,
} from "../model/Rectangle";
import { useContextMenuStore } from "./contextMenu";
import {
  ShapeType,
  CIRCLE,
  RECTANGLE,
  SHAPE_TYPES,
  TRIANGLE,
} from "../types/ShapeTypes";
import { getObjectCenterPosition } from "../utils/math";
import CircleShape from "../components/CircleShape.vue";
import RectangleShape from "../components/RectangleShape.vue";
import TriangleShape from "../components/TriangleShape.vue";
import { useGlobalStore } from "./global";

export type ShapeObject =
  | CircleInterface
  | RectangleInterface
  | TriangleInterface;

export const useObjectsStore = defineStore("objects", () => {
  const objects = ref<Record<number, ShapeObject>>({});
  const selectedObjectId = ref<number | null>(null);
  const selectedObjectType = ref<ShapeType | null>(null);
  const contextMenuStore = useContextMenuStore();
  const selectedShapeStore = useSelectedShapeStore();
  const {
    setContextMenuLocation,
    setIsContextMenuOpened,
    setSelectedMenuItemIndex,
  } = contextMenuStore;
  const globalStore = useGlobalStore();
  const { selectedShape } = storeToRefs(selectedShapeStore);
  const { size, color } = storeToRefs(globalStore);

  /**
   * Get the selected object (could be circle or rectangle)
   */
  const selectedObject = computed(() => {
    if (!selectedObjectId.value) {
      return null;
    }

    return objects.value[selectedObjectId.value] ?? null;
  });

  /**
   * Get radius if selected object is a circle, otherwise 0
   */
  const selectedObjectRadius = computed(() => {
    const obj = selectedObject.value;

    if (!obj || obj.type !== CIRCLE) {
      return 0;
    }

    return (obj as CircleInterface).getRadius();
  });

  /**
   * Set radius of selected circle
   */
  const setSelectedObjectRadius = (value?: number) => {
    if (!selectedObjectId.value || !value) {
      return;
    }

    const obj = objects.value[selectedObjectId.value];
    if (!obj || obj.type !== CIRCLE) {
      return;
    }

    const radius = Math.min(value, 1000);
    (obj as CircleInterface).setRadius(radius);
  };

  /**
   * Get color of selected object
   */
  const selectedObjectColor = computed(() => {
    const obj = selectedObject.value;
    if (!obj) {
      return "#ffffff";
    }

    return obj.getColor();
  });

  /**
   * Set color of selected object
   */
  const setSelectedObjectColor = (value?: string) => {
    if (!selectedObjectId.value || !value) {
      return;
    }

    const obj = objects.value[selectedObjectId.value];
    if (!obj) {
      return;
    }

    obj.setColor(value);
  };

  /**
   * Select an object without opening context menu
   *
   * @param id
   * @returns
   */
  const setSelectedObject = (id: number) => {
    if (!id) {
      return;
    }

    selectedObjectId.value = id;
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
      setIsContextMenuOpened(false);
      return;
    }

    setIsContextMenuOpened();
    setContextMenuLocation(clientX, clientY);
    setSelectedMenuItemIndex(null);
  };

  /**
   * Create a new object (circle or rectangle)
   */
  const createObject = (shapeType: ShapeType, event: MouseEvent): void => {
    deSelectObject(); // Deselect current selection

    // 2. Invert the full canvas transform: translate(offset) scale(scale)
    const canvasX = event.offsetX;
    const canvasY = event.offsetY;

    const id = Math.max(...Object.keys(objects.value).map(Number), 0) + 1;

    if (shapeType === SHAPE_TYPES.circle) {
      const circle = new Circle(id, canvasX, canvasY, size.value, color.value);
      objects.value[id] = circle;

      return;
    }

    if (shapeType === SHAPE_TYPES.rectangle) {
      const x = canvasX - DEFAULT_RECT_WIDTH / 2;
      const y = canvasY - DEFAULT_RECT_HEIGHT / 2;
      const rectangle = new Rectangle(
        id,
        x,
        y,
        size.value,
        size.value,
        color.value,
      );
      objects.value[id] = rectangle;

      return;
    }

    if (shapeType === SHAPE_TYPES.triangle) {
      const x1 = canvasX;
      const y1 = canvasY;
      const triangle = new Triangle(
        id,
        x1,
        y1,
        x1 + size.value,
        y1,
        x1,
        y1 + size.value,
        color.value,
      );
      objects.value[id] = triangle;
    }
  };

  /**
   * X and Y represent the future center position of the object
   *
   * @param x
   * @param y
   * @returns
   */
  const updateSelectedObjectPosition = (x: number, y: number): void => {
    if (!selectedObjectId.value || !selectedObject.value) {
      return;
    }

    if (selectedObject.value.type === SHAPE_TYPES.circle) {
      // 2. Calculate the "Grab Offset" (to prevent the shape from jumping to the mouse)

      selectedObject.value.cx = x;
      selectedObject.value.cy = y;

      return;
    }

    if (selectedObject.value.type === SHAPE_TYPES.rectangle) {
      selectedObject.value.x = x - selectedObject.value.width / 2;
      selectedObject.value.y = y - selectedObject.value.height / 2;

      return;
    }

    if (selectedObject.value.type === SHAPE_TYPES.triangle) {
      const tri = selectedObject.value as TriangleInterface;
      const { x: currentX = 0, y: currentY = 0 } = getObjectCenterPosition(tri);
      const deltaX = x - currentX;
      const deltaY = y - currentY;
      tri.x1 += deltaX;
      tri.x2 += deltaX;
      tri.x3 += deltaX;
      tri.y1 += deltaY;
      tri.y2 += deltaY;
      tri.y3 += deltaY;
    }
  };

  const deSelectObject = () => {
    selectObject();
  };

  const deleteObject = (id: number | null) => {
    if (id === undefined || id === null || !objects.value[id]) {
      return;
    }

    delete objects.value[id];
    setIsContextMenuOpened(false);
    setSelectedMenuItemIndex(null);
  };

  const setObjectName = (event: Event, id: number) => {
    const { value = "" } = (event.currentTarget as HTMLInputElement) || {};
    if (!value || !id) {
      return;
    }

    objects.value[id as number].name = value;
  };

  const handleCreateObject = (event: MouseEvent): void => {
    if (selectedShape.value === SHAPE_TYPES.circle) {
      createObject(CIRCLE, event);
      return;
    }

    if (selectedShape.value === SHAPE_TYPES.rectangle) {
      createObject(RECTANGLE, event);
      return;
    }

    if (selectedShape.value === SHAPE_TYPES.triangle) {
      createObject(TRIANGLE, event);
      return;
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

  const selectedObjectOpacity = computed(() => {
    if (!selectedObjectId.value || !selectedObject.value) {
      return 1;
    }

    return selectedObject.value.opacity;
  });

  const setSelectedObjectOpacity = (val: number) => {
    if (val > 1 || val < 0) {
      console.error("Opacity can not be more than 100 or less than 0");
      return;
    }

    if (!selectedObject.value) {
      return;
    }

    selectedObject.value.opacity = val;
  };

  return {
    objects,
    circles,
    rectangles,
    selectedObjectId,
    selectedObject,
    setSelectedObject,
    selectedObjectType,
    selectedObjectRadius,
    setSelectedObjectRadius,
    selectedObjectColor,
    setSelectedObjectColor,
    selectObject,
    createObject,
    updateSelectedObjectPosition,
    deSelectObject,
    deleteObject,
    setObjectName,
    handleCreateObject,
    selectedObjectOpacity,
    setSelectedObjectOpacity,
  };
});

// registry that maps type string to component
export const shapeRegistry: Record<string, any> = {
  [CIRCLE]: CircleShape,
  [RECTANGLE]: RectangleShape,
  [TRIANGLE]: TriangleShape,
};

// generic list that will grow as we add new types
export const shapeComponents = computed(() => shapeRegistry);

// registry that maps type string to object classes
export const objectRegistry: Record<string, any> = {
  [CIRCLE]: Circle,
  [RECTANGLE]: Rectangle,
  [TRIANGLE]: Triangle,
};

export const objectMap = computed(() => objectRegistry);
