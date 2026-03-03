<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRectanglesStore } from "../store/rectangles";

const store = useRectanglesStore();
const { rectangles } = storeToRefs(store);
</script>

<template>
  <rect
    v-for="(rectangle, key) in rectangles"
    class="shape rectangle"
    :x="rectangle.x"
    :y="rectangle.y"
    :rx="rectangle.rx"
    :ry="rectangle.ry"
    :width="rectangle.width"
    :height="rectangle.height"
    :key="key"
    :style="{ fill: rectangle.color }"
  />
</template>
