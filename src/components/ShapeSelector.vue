<script setup lang="ts">
import { ShapeType, SHAPE_TYPES } from "../types/ShapeTypes";
import CursorIcon from "./CursorIcon.vue";

const emit = defineEmits<{
  (e: "select-shape", value: ShapeType): void;
}>();

const selectShape = (shape: ShapeType) => {
  emit("select-shape", shape);
};
</script>

<template>
  <div class="shape-selector">
    <button @click="selectShape(SHAPE_TYPES.cursor)">
      <CursorIcon />
    </button>
    <button
      class="circle"
      @click="selectShape(SHAPE_TYPES.circle)"
      aria-label="Select circle"
    >
      <span></span>
    </button>
    <button
      class="rectangle"
      @click="selectShape(SHAPE_TYPES.rectangle)"
      aria-label="Select rectangle"
    >
      <span></span>
    </button>
  </div>
</template>

<style lang="scss">
.shape-selector {
  display: flex;
  gap: 8px;

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  .circle {
    height: 25px;
    width: 25px;
    background-color: #fff;
    border-radius: 50%;
    display: inline-block;
    border: 1px solid #000;
  }

  .rectangle {
    width: 35px;
    height: 25px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #000;
  }
}
</style>
