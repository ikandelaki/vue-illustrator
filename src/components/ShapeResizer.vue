<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { computed } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";

const OFFSET_LENGTH = 20;

const objectsStore = useObjectsStore();
const { objects, selectedObjectId } = storeToRefs(objectsStore);

const selectedObject = computed(() => {
  return selectedObjectId.value ? objects.value[selectedObjectId.value] : null;
});

// Bounding box corners derived from shape geometry
const bbox = computed(() => {
  if (!selectedObject.value) {
    return null;
  }

  if (selectedObject.value.type === SHAPE_TYPES.circle) {
    return {
      x: selectedObject.value.cx - selectedObject.value.radius - OFFSET_LENGTH,
      y: selectedObject.value.cy - selectedObject.value.radius - OFFSET_LENGTH,
      size: selectedObject.value.radius * 2,
    };
  }

  return {
    x: 0,
    y: 0,
    size: 0,
  };
});

const anchors = computed(() => {
  if (!bbox.value) {
    return [];
  }
  const { x, y, size } = bbox.value;
  return [
    { id: "tl", cx: bbox.value.x, cy: bbox.value.y },
    { id: "tr", cx: bbox.value.x + bbox.value.size, cy: bbox.value.y },
    { id: "bl", cx: bbox.value.x, cy: bbox.value.y + bbox.value.size },
    {
      id: "br",
      cx: bbox.value.x + bbox.value.size,
      cy: bbox.value.y + bbox.value.size,
    },
  ];
});
</script>
<template>
  <template v-if="selectedObjectId && bbox">
    <rect
      class="selection-box"
      :x="bbox.x"
      :y="bbox.y"
      :width="bbox.size"
      :height="bbox.size"
      fill="none"
      stroke="black"
      stroke-width="1"
    />
    <circle
      v-for="anchor in anchors"
      :key="anchor.id"
      class="resize-anchor"
      :cx="anchor.cx"
      :cy="anchor.cy"
      r="5"
      fill="white"
      stroke="black"
      stroke-width="1"
    />
  </template>
</template>

<style scoped>
.resize-anchor {
  cursor: nwse-resize;
}
</style>
