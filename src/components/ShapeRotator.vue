<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import { useShapeRotate } from "../composables/useShapeRotate";
import { useTemplateRef } from "vue";

const objectsStore = useObjectsStore();
const { selectedObjectId } = storeToRefs(objectsStore);
const rotationRef = useTemplateRef("rotationRef");

const {
  isRotationCursor,
  bbox,
  handleMouseEnter,
  handleMouseLeave,
  handleMouseDown,
  cursorTransform,
} = useShapeRotate(rotationRef);
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
