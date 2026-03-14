<script setup lang="ts">
import { useCanvasStore } from "../store/canvas";
import { useObjectsStore } from "../store/objects";
import Objects from "./Objects.vue";
const canvasStore = useCanvasStore();
const { handleCreateObject } = useObjectsStore();
</script>

<template>
  <div class="canvas-container">
    <div
      class="canvas"
      :style="{
        width: `${canvasStore.dimensions.width}px`,
        height: `${canvasStore.dimensions.height}px`,
      }"
    >
      <svg
        @click="handleCreateObject"
        :viewBox="
          '0 0 ' +
          canvasStore.dimensions.width / canvasStore.scale +
          ' ' +
          canvasStore.dimensions.height / canvasStore.scale
        "
      >
        <foreignObject
          x="0"
          y="50%"
          width="100%"
          height="200"
          class="canvas-details_container"
        >
          <p class="canvas-details">
            Click on the canvas to draw a shape. click on a shape to select it.
            <br />
            Left-click on a shape to adjust its properties
          </p>
        </foreignObject>
        <Objects />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
svg {
  background-color: #fff;
  border: 1px solid var(--main-black);
}

.canvas {
  height: 100vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  &-details {
    text-align: center;
    padding: 0 50px;
    color: var(--light-gray);

    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    cursor: default;

    &_container {
      pointer-events: none;
    }
  }

  &-container {
    width: calc(100% - var(--sidebar-expanded-width));
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--mid-gray);
  }
}
</style>
