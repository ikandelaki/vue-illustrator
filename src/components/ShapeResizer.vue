<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { computed, ref } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";
import { calculateDistance } from "../utils/math";
import { useDragElement } from "../composables/mouse";
import { RectangleInterface } from "../model/Rectangle";

const OFFSET_LENGTH = 0;

defineEmits<{
  resize: [anchorId: string, event: MouseEvent];
}>();

const isResizing = ref<boolean>(false);
const prevPointerX = ref<number>(0);
const prevPointerY = ref<number>(0);
const objectsStore = useObjectsStore();
const { selectedObjectId, selectedObject } = storeToRefs(objectsStore);
const { setSelectedObjectRadius } = objectsStore;

// Bounding box corners derived from shape geometry
const bbox = computed(() => {
  console.log(">> selectedObject.value", selectedObject.value);
  if (!selectedObject.value) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  if (selectedObject.value.type === SHAPE_TYPES.circle) {
    const circle = selectedObject.value as CircleInterface;

    return {
      x: circle.cx - circle.radius - OFFSET_LENGTH,
      y: circle.cy - circle.radius - OFFSET_LENGTH,
      width: (circle.radius + OFFSET_LENGTH) * 2,
      height: (circle.radius + OFFSET_LENGTH) * 2,
    };
  }

  if (selectedObject.value.type === SHAPE_TYPES.rectangle) {
    const rectangle = selectedObject.value as RectangleInterface;

    console.log(">> returning bbox");
    return {
      x: rectangle.x - OFFSET_LENGTH,
      y: rectangle.y - OFFSET_LENGTH,
      width: rectangle.width,
      height: rectangle.height,
    };
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
});

const anchors = computed(() => {
  if (!bbox.value) {
    return [];
  }
  const { x, y, width, height } = bbox.value;
  return [
    { id: "tl", cx: x, cy: y },
    { id: "tr", cx: x + width, cy: y },
    { id: "bl", cx: x, cy: y + height },
    { id: "br", cx: x + width, cy: y + height },
  ];
});

const startResize = (event: MouseEvent, anchorId: string) => {
  isResizing.value = true;
  prevPointerX.value = event.clientX;
  prevPointerY.value = event.clientY;

  const onMouseMove = (moveEvent: MouseEvent) => resize(moveEvent, anchorId);
  const onMouseUp = () => (isResizing.value = false);

  useDragElement(onMouseMove, onMouseUp);
};

const resize = (event: MouseEvent, anchorId: string) => {
  const anchor = anchors.value.find((anchor) => anchor.id === anchorId);
  const currentX = event.clientX;
  const currentY = event.clientY;

  if (!isResizing.value || !anchor || !selectedObject.value) {
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

  if (selectedObject.value.type === SHAPE_TYPES.circle) {
    const newRadius =
      (currentDistance / prevDistance) * selectedObject.value.radius;
    setSelectedObjectRadius(Math.max(1, newRadius));
  }

  if (selectedObject.value.type === SHAPE_TYPES.rectangle) {
    const rect = selectedObject.value as RectangleInterface;
    const widthToHeightRatio = rect.height / rect.width;
    const newWidth = (currentDistance / prevDistance) * rect.width;
    const newHeight = newWidth * widthToHeightRatio;
    rect.width = newWidth;
    rect.height = newHeight;
  }
  // Based on the similar triangle relativity formula
  prevPointerX.value = currentX;
  prevPointerY.value = currentY;
};
</script>
<template>
  <template v-if="selectedObjectId && bbox.width">
    <rect
      class="selection-box"
      :x="bbox.x"
      :y="bbox.y"
      :width="bbox.width"
      :height="bbox.height"
      fill="none"
      stroke="black"
      stroke-width="1"
      stroke-dasharray="1, 2"
    />
    <circle
      v-for="anchor in anchors"
      :key="anchor.id"
      class="resize-anchor"
      :class="{ [anchor.id]: anchor.id }"
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
  position: relative;
  z-index: 1111;

  &.tl,
  &.br {
    cursor: nwse-resize;
  }

  &.tr,
  &.bl {
    cursor: nesw-resize;
  }
}
</style>
