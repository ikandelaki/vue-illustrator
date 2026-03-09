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
    <div class="shape-selector_shapes">
      <button
        class="circle"
        @click="selectShape(SHAPE_TYPES.circle)"
        aria-label="Select a circle"
      >
        <span></span>
      </button>
      <button
        class="rectangle"
        @click="selectShape(SHAPE_TYPES.rectangle)"
        aria-label="Select a rectangle"
      >
        <span></span>
      </button>
      <button class="triangle" aria-label="Select a triangle">
        <span></span>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.shape-selector {
  display: flex;
  align-items: center;
  gap: 8px;

  &_shapes {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #495057;
    border-radius: 4px;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  .circle {
    height: 20px;
    width: 20px;
    background-color: #fff;
    border-radius: 50%;
    display: inline-block;
    border: 1px solid #000;
  }

  .rectangle {
    width: 25px;
    height: 20px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #000;
  }

  .triangle {
    width: 20px;
    height: 20px;
    background-color: #fff;
    clip-path: polygon(0 0, 0% 100%, 100% 100%);
    border: 1px solid #000;
  }
}
</style>
