<script setup lang="ts">
import { useCanvasStore } from "../store/canvas";
import { computed } from "vue";

const canvasStore = useCanvasStore();

const gridSize = computed(() => 40 * canvasStore.scale);

const gridOffsetX = computed(() => {
  return canvasStore.transform.x % gridSize.value;
});

const gridOffsetY = computed(() => {
  return canvasStore.transform.y % gridSize.value;
});
</script>

<template>
  <defs>
    <pattern
      id="grid"
      :width="gridSize"
      :height="gridSize"
      patternUnits="userSpaceOnUse"
    >
      <path
        :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
        fill="none"
        stroke="#e5e5e5"
        stroke-width="1"
      />
    </pattern>
  </defs>
  <rect
    :x="-100000 + gridOffsetX"
    :y="-100000 + gridOffsetY"
    width="200000"
    height="200000"
    fill="url(#grid)"
  />
</template>
