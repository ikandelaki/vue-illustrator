<script setup lang="ts">
import { ShapeType } from "../types/ShapeTypes";
import AnimationTimeline from "./AnimationTimeline.vue";
import GlobalConfig from "./GlobalConfig.vue";
import ShapeSelector from "./ShapeSelector.vue";

defineEmits<{
  (e: "select-shape", value: ShapeType): void;
}>();

defineProps<{
  selectedShape: string;
}>();
</script>

<template>
  <div class="header-container">
    <div class="size">
      <ShapeSelector @select-shape="$emit('select-shape', $event)" />
      <GlobalConfig />
    </div>
    <AnimationTimeline />
  </div>
</template>

<style lang="scss">
.header-container {
  position: absolute;
  z-index: 9;
  width: 100%;
  background: #343a40;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 8px 16px;
  box-shadow: 0px 8px 10px -10px black;
  flex-wrap: wrap;
  gap: 8px;

  .size {
    display: flex;
    gap: 8px;
  }
}
</style>
