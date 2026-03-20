<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { computed, ref } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";
import { calculateDistance, getObjectCenterPosition } from "../utils/math";
import { useDragElement } from "../composables/mouse";
import { RectangleInterface } from "../model/Rectangle";
import { TriangleInterface } from "../model/Triangle";
import { useScreenToWorld } from "../composables/useScreenToWorld";
import { useBbox } from "../composables/useBbox";

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
const { bbox } = useBbox();

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
  const { x, y } = useScreenToWorld(event.clientX, event.clientY);
  prevPointerX.value = x;
  prevPointerY.value = y;

  const onMouseMove = (moveEvent: MouseEvent) => resize(moveEvent, anchorId);
  const onMouseUp = () => (isResizing.value = false);

  useDragElement(onMouseMove, onMouseUp);
};

const resize = (event: MouseEvent, anchorId: string) => {
  const anchor = anchors.value.find((anchor) => anchor.id === anchorId);
  const { x: currentX, y: currentY } = useScreenToWorld(
    event.clientX,
    event.clientY,
  );

  if (!isResizing.value || !anchor || !selectedObject.value) {
    return;
  }

  const { x: centerX = 0, y: centerY = 0 } = getObjectCenterPosition(
    selectedObject.value,
  );

  const prevDistance = calculateDistance(
    prevPointerX.value,
    prevPointerY.value,
    centerX,
    centerY,
  );

  const currentDistance = calculateDistance(
    currentX,
    currentY,
    centerX,
    centerY,
  );

  if (selectedObject.value.type === SHAPE_TYPES.circle) {
    const circle = selectedObject.value as CircleInterface;

    if (prevDistance === 0) {
      return;
    }

    const newRadius = (currentDistance / prevDistance) * circle.radius;
    setSelectedObjectRadius(Math.max(1, newRadius));
  }

  if (selectedObject.value.type === SHAPE_TYPES.rectangle) {
    const rect = selectedObject.value as RectangleInterface;

    const widthToHeightRatio = rect.height / rect.width;
    const newWidth = (currentDistance / prevDistance) * rect.width;
    const newHeight = newWidth * widthToHeightRatio;

    rect.width = newWidth;
    rect.height = newHeight;
    rect.x = centerX - newWidth / 2;
    rect.y = centerY - newHeight / 2;
  }

  if (selectedObject.value.type === SHAPE_TYPES.triangle) {
    const triangle = selectedObject.value as TriangleInterface;

    // Determine the scale factor (prevent division by zero)
    const ratio = prevDistance !== 0 ? currentDistance / prevDistance : 1;

    // Scale each point relative to the center
    triangle.x1 = centerX + (triangle.x1 - centerX) * ratio;
    triangle.y1 = centerY + (triangle.y1 - centerY) * ratio;

    triangle.x2 = centerX + (triangle.x2 - centerX) * ratio;
    triangle.y2 = centerY + (triangle.y2 - centerY) * ratio;

    triangle.x3 = centerX + (triangle.x3 - centerX) * ratio;
    triangle.y3 = centerY + (triangle.y3 - centerY) * ratio;
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
