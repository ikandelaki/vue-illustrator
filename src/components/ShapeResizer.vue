<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { computed } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";

const OFFSET_LENGTH = 20;

defineEmits<{
  resize: [anchorId: string, event: MouseEvent];
}>();

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
    const circle = selectedObject.value as CircleInterface;
    return {
      x: circle.cx - circle.radius - OFFSET_LENGTH,
      y: circle.cy - circle.radius - OFFSET_LENGTH,
      size: (circle.radius + OFFSET_LENGTH) * 2,
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
    { id: "tl", cx: x, cy: y },
    { id: "tr", cx: x + size, cy: y },
    { id: "bl", cx: x, cy: y + size },
    { id: "br", cx: x + size, cy: y + size },
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
      stroke-dasharray="1, 2"
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
      @mousedown="$emit('resize', anchor.id, $event)"
    />
  </template>
</template>

<style scoped>
.resize-anchor {
  cursor: nwse-resize;
}
</style>
