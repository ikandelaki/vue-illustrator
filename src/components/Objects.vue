<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ShapeObject, useObjectsStore } from "../store/objects";
import CircleShape from "./CircleShape.vue";
import RectangleShape from "./RectangleShape.vue";
import {
  CIRCLE,
  RECTANGLE,
  SHAPE_TYPES,
  ShapeType,
  TRIANGLE,
} from "../types/ShapeTypes";
import { useSelectedShapeStore } from "../store/selectedShape";
import { useDragElement } from "../composables/mouse";
import ShapeResizer from "./ShapeResizer.vue";
import TriangleShape from "./TriangleShape.vue";

const objectsStore = useObjectsStore();
const selectedShapeStore = useSelectedShapeStore();
const { setSelectedObject, updateSelectedObjectPosition, selectObject } =
  objectsStore;
const { objects, selectedObjectId, selectedObject } = storeToRefs(objectsStore);
const { selectedShape } = storeToRefs(selectedShapeStore);

// registry that maps type string to component
const shapeRegistry: Record<string, any> = {
  [CIRCLE]: CircleShape,
  [RECTANGLE]: RectangleShape,
  [TRIANGLE]: TriangleShape,
};

// generic list that will grow as we add new types
const shapeComponents = computed(() => shapeRegistry);

const handleShapeClick = (id: number) => {
  if (selectedShape.value !== SHAPE_TYPES.cursor) {
    return;
  }

  setSelectedObject(id);
};

const calculateStartXAndYWithOffset = (
  event: MouseEvent,
  object: ShapeObject,
) => {
  if (object.type === SHAPE_TYPES.circle) {
    return {
      startX: event.clientX - object.cx,
      startY: event.clientY - object.cy,
    };
  }

  return {
    startX: event.clientX - object.x,
    startY: event.clientY - object.y,
  };
};

const handleShapeMove = (event: PointerEvent, objectId: number) => {
  // 1. Ensure this is the selected object
  if (objectId !== selectedObjectId.value || !selectedObject.value) return;

  // 2. Calculate the "Grab Offset" (to prevent the shape from jumping to the mouse)
  const { startX, startY } = calculateStartXAndYWithOffset(
    event,
    selectedObject.value,
  );

  const onPointerMove = (moveEvent: PointerEvent) => {
    // 3. Update position based on global mouse movement minus the grab offset
    updateSelectedObjectPosition(
      moveEvent.clientX - startX,
      moveEvent.clientY - startY,
    );
  };

  // 4. Use a composable to add and remove 'move' event listeners
  useDragElement(onPointerMove);
};
</script>

<template>
  <component
    v-for="object in objects"
    :is="shapeComponents[object.type] || null"
    :key="object.getId()"
    :object="object"
    :selected="selectedObjectId === object.getId()"
    class="shape"
    @click="handleShapeClick(object.getId())"
    @pointerdown="handleShapeMove($event, object.getId())"
    @contextmenu.prevent="selectObject($event, object.getId(), object.type)"
  />
  <ShapeResizer />
</template>

<style>
.shape {
  touch-action: none;
  cursor: pointer;

  &.selected {
    cursor: grab;
  }
}

.shape:active {
  cursor: grabbing;
}
</style>
