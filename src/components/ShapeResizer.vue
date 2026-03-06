<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { computed, ref } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";
import { calculateDistance } from "../utils/math";

const OFFSET_LENGTH = 0;

defineEmits<{
  resize: [anchorId: string, event: MouseEvent];
}>();

const isResizing = ref<boolean>(false);
const prevPointerX = ref<number>(0);
const prevPointerY = ref<number>(0);
const objectsStore = useObjectsStore();
const { objects, selectedObjectId } = storeToRefs(objectsStore);

const selectedObject = computed(() => {
  return selectedObjectId.value ? objects.value[selectedObjectId.value] : null;
});

// Bounding box corners derived from shape geometry
const bbox = computed(() => {
  if (!selectedObject.value) {
    return {
      x: 0,
      y: 0,
      size: 0,
    };
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

const startResize = (event: MouseEvent, anchorId: string) => {
  isResizing.value = true;
  prevPointerX.value = event.clientX;
  prevPointerY.value = event.clientY;

  const onMouseMove = (moveEvent: MouseEvent) => resize(moveEvent, anchorId);

  const onMouseUp = () => {
    isResizing.value = false;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const resize = (event: MouseEvent, anchorId: string) => {
  const anchor = anchors.value.find((anchor) => anchor.id === anchorId);
  const currentX = event.clientX;
  const currentY = event.clientY;

  if (
    !isResizing.value ||
    !anchor ||
    (currentX === prevPointerX.value && currentY === prevPointerY.value)
  ) {
    return;
  }

  const prevDistance = calculateDistance(
    prevPointerX.value,
    prevPointerY.value,
    selectedObject.value.cx,
    selectedObject.value.cy,
  );

  const currentDistance = calculateDistance(
    currentX,
    currentY,
    selectedObject.value.cx,
    selectedObject.value.cy,
  );

  // Based on the similar triangle relativity formula
  const newRadius =
    (currentDistance / prevDistance) * selectedObject.value.radius;
  selectedObject.value.radius = Math.max(1, newRadius);
  prevPointerX.value = currentX;
  prevPointerY.value = currentY;
};
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
      @mousedown="startResize($event, anchor.id)"
    />
  </template>
</template>

<style scoped>
.resize-anchor {
  cursor: nwse-resize;
}
</style>
