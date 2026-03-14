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
  event.preventDefault();

  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  const deltaY = event.deltaY;
  const direction = Math.sign(deltaY);
  const scale = 0.1;

  resize(direction * scale);

  console.log(">> sign", direction);
};

onMounted(() => {
  canvasRef.value!.addEventListener("wheel", setupGlobalListeners);
});

onUnmounted(() => {
  canvasRef.value!.removeEventListener("wheel", setupGlobalListeners);
});
</script>

<template>
  <Header :selectedShape="selectedShape" @select-shape="setSelectedShape" />
  <div class="canvas" ref="canvas">
    <svg
      @click="handleCreateObject"
      :width="canvasStore.dimensions.width"
      :height="canvasStore.dimensions.height"
    >
      <foreignObject x="0" y="40%" width="100%" height="200">
        <p class="canvas-details">
          Click on the canvas to draw a shape. click on a shape to select it.
          <br />
          Left-click on a shape to adjust its properties
        </p>
      </foreignObject>
      <Objects />
    </svg>
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
  background-color: #eee;
}

.canvas {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &-details {
    text-align: center;
    padding: 0 50px;
    color: #bbb;

    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    cursor: default;
  }
}

.shape {
  fill: #fff;
  stroke: #212529;
  stroke-width: 1;

  &.selected {
    fill: #868e96;
  }
}
</style>
