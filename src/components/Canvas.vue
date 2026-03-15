<script setup lang="ts">
import { useCanvasStore } from "../store/canvas";
import { useObjectsStore } from "../store/objects";
import Objects from "./Objects.vue";
import { useCanvasMove } from "../composables/useCanvasMove";
const canvasStore = useCanvasStore();
const { handleCreateObject } = useObjectsStore();

const { isSpacePressed, startDrag } = useCanvasMove();
</script>

<template>
  <div class="canvas-container" :class="{ 'cursor-grab': isSpacePressed }">
    <div
      class="canvas"
      :style="{
        transform: `translate(${canvasStore.offset.x}px, ${canvasStore.offset.y}px) scale(${canvasStore.scale})`,
        transformOrigin: '0 0',
      }"
      @mousedown="startDrag"
    >
      <svg
        @click="handleCreateObject"
        :viewBox="`0 0 ${canvasStore.dimensions.width} ${canvasStore.dimensions.height}`"
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
  width: 100%;
  height: 100%;
  display: block;
}

.canvas {
  height: 100vh;
  position: absolute;
  transform-origin: 0 0;
  will-change: transform;

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
    overflow: auto;
    position: relative;
    height: calc(100vh - var(--header-total-height));
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--mid-gray);
    margin-block-start: var(--header-total-height);

    &.cursor-grab {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
  }
}
</style>
