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
const { objects, selectedObjectId } = storeToRefs(objectsStore);
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

const handleShapeMove = (event: MouseEvent, objectId: number) => {
  if (objectId !== selectedObjectId.value) {
    return;
  }

  const onMouseMove = (moveEvent: MouseEvent) =>
    updateSelectedObjectPosition(moveEvent.clientX, moveEvent.clientY);

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
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
    @mousedown="handleShapeMove($event, object.getId())"
  />
</template>

<style>
.shape {
  cursor: pointer;
}
</style>
