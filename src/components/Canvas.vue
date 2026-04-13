<script setup lang="ts">
import {
  INITIAL_HEIGHT,
  INITIAL_WIDTH,
  useCanvasStore,
  ZOOM_SENSITIVITY,
} from "../store/canvas";
import { ShapeObject, useObjectsStore } from "../store/objects";
import Objects from "./Objects.vue";
import { useCanvasMove } from "../composables/useCanvasMove";
import { computed, onMounted, useTemplateRef } from "vue";
import Grid from "./Grid.vue";
import { useAnimation } from "../composables/useAnimation";
import { BrowserDatabase } from "../composables/useBrowserDatabase";
import { OBJECT_SHAPES } from "../browserDatabase/objects";
import { storeToRefs } from "pinia";
import Loader from "./Loader.vue";

const canvasStore = useCanvasStore();
const objectsStore = useObjectsStore();

const { handleCreateObject, setIsObjectsLoading, createObjectsFromBrowserDb } =
  objectsStore;
const { isObjectsLoading } = storeToRefs(objectsStore);

const { zoom, setTransform } = useCanvasStore();
const { isSpacePressed, startDrag } = useCanvasMove();

const canvasContainer = useTemplateRef("canvasContainer");
const transform = computed(() => {
  return `translate(${canvasStore.transform.x}px, ${canvasStore.transform.y}px) scale(${canvasStore.scale})`;
});

const setupStoreFromLocalDb = async () => {
  setIsObjectsLoading(true);
  const objects = await BrowserDatabase.getAll(OBJECT_SHAPES);
  createObjectsFromBrowserDb(objects as ShapeObject[]);
  setIsObjectsLoading(false);
};

const onWheel = (event: WheelEvent) => {
  if (!canvasContainer.value || (!event.ctrlKey && !event.metaKey)) return;

  event.preventDefault();

  const zoomFactor = -Math.sign(event.deltaY) * ZOOM_SENSITIVITY;

  const { left, top } = canvasContainer.value.getBoundingClientRect();

  const mouseX = event.clientX - left;
  const mouseY = event.clientY - top;

  // Zoom anchored to the cursor
  zoom(zoomFactor, mouseX, mouseY);
};

onMounted(() => {
  const { width, height } = canvasContainer.value!.getBoundingClientRect();
  const centerX = (width - INITIAL_WIDTH * canvasStore.scale) / 2;
  const centerY = (height - INITIAL_HEIGHT * canvasStore.scale) / 2;

  setTransform(centerX, centerY);
  setupStoreFromLocalDb();
});

useAnimation();
</script>

<template>
  <div
    id="screen"
    class="canvas-container"
    :class="{ 'cursor-grab': isSpacePressed, 'is-loading': isObjectsLoading }"
    @wheel.prevent="onWheel"
    ref="canvasContainer"
  >
    <div
      id="world"
      class="canvas"
      :style="{
        width: `${INITIAL_WIDTH}px`,
        height: `${INITIAL_HEIGHT}px`,
        transform: transform,
      }"
      @mousedown="startDrag"
    >
      <svg
        @click="handleCreateObject"
        :viewBox="`0 0 ${INITIAL_WIDTH} ${INITIAL_HEIGHT}`"
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
            Right-click on a shape to adjust its properties
          </p>
        </foreignObject>
        <Grid />
        <Objects />
      </svg>
    </div>
    <Loader :visible="isObjectsLoading" />
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
  position: absolute;
  left: 0;
  top: 0;
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
    height: calc(100vh - var(--header-total-height));
    position: relative;
    overflow: hidden;
    background-color: var(--mid-gray);
    margin-block-start: var(--header-total-height);

    &.cursor-grab {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    &.is-loading {
      pointer-events: none;
    }
  }
}
</style>
