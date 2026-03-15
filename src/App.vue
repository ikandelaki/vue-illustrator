<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted } from "vue";
import Loader from "./components/Loader.vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { useSelectedShapeStore } from "./store/selectedShape";
import { SCALE_STEP, useCanvasStore } from "./store/canvas";
import { storeToRefs } from "pinia";
import Canvas from "./components/Canvas.vue";

const ContextMenu = defineAsyncComponent({
  loader: () => import("./components/ContextMenu.vue"),
  loadingComponent: Loader,
  delay: 200,
});

const selectedShapeStore = useSelectedShapeStore();
const { setSelectedShape } = selectedShapeStore;

const { resize } = useCanvasStore();

const { selectedShape } = storeToRefs(selectedShapeStore);

const onWheel = (event: WheelEvent) => {
  const el = event.target as HTMLElement;

  // Only act inside our canvas-container
  const container = el.closest<HTMLElement>(".canvas-container");
  if (!container) return;

  // Only intercept pinch/ctrl+scroll
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();

  const delta = -Math.sign(event.deltaY) * SCALE_STEP;

  // All coordinates normalised to container-local space
  const rect = container.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const onCanvas = !!el.closest(".canvas");

  if (onCanvas) {
    // Zoom anchored to the cursor
    resize(delta, mouseX, mouseY);
  } else {
    // Zoom anchored to the visual center of the container
    resize(delta, rect.width / 2, rect.height / 2);
  }
};

onMounted(() => {
  document.addEventListener("wheel", onWheel, { passive: false });
});

onUnmounted(() => {
  document.removeEventListener("wheel", onWheel);
});
</script>

<template>
  <Header :selectedShape="selectedShape" @select-shape="setSelectedShape" />
  <div class="main">
    <Canvas />
    <Sidebar />
  </div>
  <ContextMenu />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.main {
  display: flex;
}

svg {
  background-color: #fff;
  border: 1px solid var(--main-black);
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
