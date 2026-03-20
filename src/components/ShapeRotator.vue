<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { useBbox } from "../composables/useBbox";
import { computed, CSSProperties, ref, Teleport, useTemplateRef } from "vue";
import { useScreenToWorld } from "../composables/useScreenToWorld";
import {
  findAngleBetweenPoints,
  getObjectCenterPosition,
  isPointInsideBbox,
} from "../utils/math";
import { useDragElement } from "../composables/mouse";

const ROTATION_ZONE = 100;

const objectsStore = useObjectsStore();
const { selectedObjectId, selectedObject } = storeToRefs(objectsStore);
const rotationRef = useTemplateRef("rotationRef");

const isRotationCursor = ref<boolean>(false);
const mousePos = ref<{ x: number; y: number }>({ x: 0, y: 0 });

const { bbox: shapeResizerBbox } = useBbox();
const { bbox } = useBbox(ROTATION_ZONE);

let lastAngle = 0;

// Calculate if the point is inside the rotation zone:
// Zone is a place around the element, not inside it
// isPointInsideBbox calculates if current mouse position is inside the shape object,
// -- If it is true, then we are NOT inside the rotation zone, if it is false - then we are
const isInRotationZone = (x: number, y: number) => {
  return !isPointInsideBbox(x, y, shapeResizerBbox.value);
};

const handlePointerMove = (moveEvent: MouseEvent) => {
  const { x, y } = useScreenToWorld(moveEvent.clientX, moveEvent.clientY);

  mousePos.value = { x, y };

  isInRotationZone(x, y)
    ? (isRotationCursor.value = true)
    : (isRotationCursor.value = false);
};

/**
 * If the mouse enters inside the rotation zone we need to change the cursor into a rotation cursor
 *
 * @param event
 */
const handleMouseEnter = (event: MouseEvent) => {
  if (isPointInsideBbox(event.clientX, event.clientY, shapeResizerBbox.value)) {
    isRotationCursor.value = true;
    mousePos.value = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  rotationRef.value?.addEventListener("pointermove", handlePointerMove);
};

/**
 * No longer in the rotation zone, reset the cursor
 *
 * @param event
 */
const handleMouseLeave = (event: MouseEvent) => {
  isRotationCursor.value = false;

  rotationRef.value?.removeEventListener("pointermove", handlePointerMove);
};

const handleMouseDown = (event: MouseEvent) => {
  if (!isRotationCursor.value) {
    return;
  }

  // ✅ seed lastAngle from the mousedown position, not stale module-level value
  const cx = shapeResizerBbox.value.x + shapeResizerBbox.value.width / 2;
  const cy = shapeResizerBbox.value.y + shapeResizerBbox.value.height / 2;
  const { x: startX, y: startY } = useScreenToWorld(
    event.clientX,
    event.clientY,
  );
  lastAngle = findAngleBetweenPoints(cx, cy, startX, startY);

  const rotate = (moveEvent: MouseEvent) => {
    const cx = shapeResizerBbox.value.x + shapeResizerBbox.value.width / 2;
    const cy = shapeResizerBbox.value.y + shapeResizerBbox.value.height / 2;

    const { x, y } = useScreenToWorld(moveEvent.clientX, moveEvent.clientY);

    const angle = findAngleBetweenPoints(cx, cy, x, y);
    let delta = angle - lastAngle;

    // Wrap delta to [-180, 180] to avoid jumps crossing ±180°
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastAngle = angle;

    selectedObject.value?.setTransform({
      rotate: (selectedObject.value?.transform.rotate || 0) + delta,
    });
  };

  useDragElement(rotate);
};

const angle = computed(() => {
  const cx = shapeResizerBbox.value.x + shapeResizerBbox.value.width / 2;
  const cy = shapeResizerBbox.value.y + shapeResizerBbox.value.height / 2;
  return (
    Math.atan2(mousePos.value.y - cy, mousePos.value.x - cx) * (180 / Math.PI)
  );
});

const cursorTransform = computed(
  () =>
    `translate(${mousePos.value.x - 16}, ${mousePos.value.y - 16}) rotate(${angle.value - 60})`,
);
</script>
<template>
  <g v-if="selectedObjectId">
    <rect
      class="rotation-box"
      :class="{ 'is-rotation-cursor': isRotationCursor }"
      :x="bbox.x"
      :y="bbox.y"
      :width="bbox.width"
      :height="bbox.height"
      fill="none"
      stroke="black"
      stroke-width="1"
      stroke-dasharray="1, 2"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
      ref="rotationRef"
    />
  </g>
  <g
    v-if="selectedObjectId && isRotationCursor"
    :transform="cursorTransform"
    style="pointer-events: none"
  >
    <g
      fill="white"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M 16 4 A 12 12 0 1 1 4.18 13.91"
        fill="none"
        stroke-width="4.5"
      />
      <polygon points="7.34,14.52 5.43,9.88 1.74,12.54" />
    </g>
    <g
      fill="#111111"
      stroke="#111111"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M 16 4 A 12 12 0 1 1 4.18 13.91"
        fill="none"
        stroke-width="2.25"
      />
      <polygon points="7.34,14.52 5.43,9.88 1.74,12.54" />
    </g>
  </g>
</template>
<style scoped>
.rotation-box {
  /* Needed for mouseenter to work, without it it is only triggered when hovering over 1px border of the rect */
  fill: transparent;

  &.is-rotation-cursor {
    cursor: none;
  }
}
</style>
