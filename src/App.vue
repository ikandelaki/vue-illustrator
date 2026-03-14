<script setup lang="ts">
import {
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  useTemplateRef,
} from "vue";
import Loader from "./components/Loader.vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { CIRCLE, RECTANGLE, SHAPE_TYPES, TRIANGLE } from "./types/ShapeTypes";
import Objects from "./components/Objects.vue";
import { useObjectsStore } from "./store/objects";
import { useSelectedShapeStore } from "./store/selectedShape";
import { useCanvasStore } from "./store/canvas";
import { storeToRefs } from "pinia";

const ContextMenu = defineAsyncComponent({
  loader: () => import("./components/ContextMenu.vue"),
  loadingComponent: Loader,
  delay: 200,
});

const canvasRef = useTemplateRef("canvas");

const objectsStore = useObjectsStore();
const { createObject } = objectsStore;

const selectedShapeStore = useSelectedShapeStore();
const { setSelectedShape } = selectedShapeStore;

const canvasStore = useCanvasStore();
const { resize } = canvasStore;

const { selectedShape } = storeToRefs(selectedShapeStore);
const { scale } = storeToRefs(canvasStore);

const handleCreateObject = (event: MouseEvent): void => {
  if (selectedShape.value === SHAPE_TYPES.circle) {
    createObject(CIRCLE, event);
    return;
  }

  if (selectedShape.value === SHAPE_TYPES.rectangle) {
    createObject(RECTANGLE, event);
    return;
  }

  if (selectedShape.value === SHAPE_TYPES.triangle) {
    createObject(TRIANGLE, event);
    return;
  }
};

// If the element clicked is not a shape it means we clicked outside, so we should de-select the selected shape
// TODO: this logic messes with context menu property changes, need to think of a proper way to do this.
// const handleOutsideClick = (event: MouseEvent) => {
//   if (selectedShape.value !== SHAPE_TYPES.cursor) {
//     return;
//   }

//   const target = event.target as HTMLElement;

//   if (
//     !target.classList?.length ||
//     (target.classList?.length && !target?.classList.contains("shape"))
//   ) {
//     deSelectObject();
//     return;
//   }
// };

const setupGlobalListeners = (event: WheelEvent) => {
  if (!event.target?.closest(".canvas-container")) {
    return;
  }

  console.log(
    '>> event.target?.closest("canvas-container"))',
    event.target?.closest("canvas-container"),
  );
  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  event.preventDefault();
  const deltaY = event.deltaY;
  const direction = Math.sign(deltaY);
  const scale = 0.1;

  resize(-direction * scale);
};

onMounted(() => {
  document.addEventListener("wheel", setupGlobalListeners, { passive: false });
});

onUnmounted(() => {
  document.removeEventListener("wheel", setupGlobalListeners);
});
</script>

<template>
  <Header :selectedShape="selectedShape" @select-shape="setSelectedShape" />
  <div class="canvas-container">
    <div
      class="canvas"
      ref="canvas"
      :style="{
        width: `${canvasStore.dimensions.width}px`,
        height: `${canvasStore.dimensions.height}px`,
      }"
    >
      <svg
        @click="handleCreateObject"
        :viewBox="
          '0 0 ' +
          canvasStore.dimensions.width / scale +
          ' ' +
          canvasStore.dimensions.height / scale
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
  <ContextMenu />
  <Sidebar />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
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

.shape {
  fill: #fff;
  stroke: var(--main-black);
  stroke-width: 1;

  &.selected {
    fill: #868e96;
  }
}
</style>
