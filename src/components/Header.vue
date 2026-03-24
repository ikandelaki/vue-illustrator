<script setup lang="ts">
import { ShapeType } from "../types/ShapeTypes";
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
    <ShapeSelector @select-shape="$emit('select-shape', $event)" />
    <GlobalConfig />
  </div>
</template>

<style lang="scss">
.header-container {
  position: absolute;
  z-index: 9;
  width: 100%;
  height: var(--header-total-height);
  background: #343a40;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  box-shadow: 0px 8px 10px -10px black;
}
</style>
