<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import CircleShape from "./CircleShape.vue";
import RectangleShape from "./RectangleShape.vue";
import { CIRCLE, RECTANGLE, SHAPE_TYPES } from "../types/ShapeTypes";
import { useSelectedShapeStore } from "../store/selectedShape";

const objectsStore = useObjectsStore();
const selectedShapeStore = useSelectedShapeStore();
const { setSelectedObject, updateSelectedObjectPosition } = objectsStore;
const { objects, selectedObjectId, selectedObject } = storeToRefs(objectsStore);
const { selectedShape } = storeToRefs(selectedShapeStore);

// registry that maps type string to component
const shapeRegistry: Record<string, any> = {
  [CIRCLE]: CircleShape,
  [RECTANGLE]: RectangleShape,
};

// generic list that will grow as we add new types
const shapeComponents = computed(() => shapeRegistry);

const handleShapeClick = (id: number) => {
  if (selectedShape.value !== SHAPE_TYPES.cursor) {
    return;
  }

  setSelectedObject(id);
};
const handleShapeMove = (event: PointerEvent, objectId: number) => {
  // 1. Ensure this is the selected object
  console.log(">> handleShapeMove 1");
  if (objectId !== selectedObjectId.value || !selectedObject.value) return;

  // 2. Calculate the "Grab Offset" (where inside the shape you clicked)
  const startX = event.clientX - selectedObject.value.cx;
  const startY = event.clientY - selectedObject.value.cy;

  const onPointerMove = (moveEvent: PointerEvent) => {
    // 3. Update position based on global mouse movement minus the grab offset
    updateSelectedObjectPosition(
      moveEvent.clientX - startX,
      moveEvent.clientY - startY,
    );
  };

  const onPointerUp = () => {
    // 4. Cleanup global listeners
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  // 5. Attach to window to ensure we don't "lose" the drag if moving fast
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
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
  />
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
