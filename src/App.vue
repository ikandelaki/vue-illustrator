<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted } from "vue";
import Loader from "./components/Loader.vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { useSelectedShapeStore } from "./store/selectedShape";
import { useCanvasStore } from "./store/canvas";
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

const setupGlobalListeners = (event: WheelEvent) => {
  const el = event.target as HTMLElement;
  const container = el.closest(".canvas-container");
  if (!container) {
    return;
  }

  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  event.preventDefault();
  const deltaY = event.deltaY;
  const direction = Math.sign(deltaY);
  const scale = 0.1;

  const isInsideCanvas = el.closest(".canvas");
  if (isInsideCanvas) {
    resize(-direction * scale, event.offsetX, event.offsetY);
    return;
  }

  const { left, width, top, height } = container.getBoundingClientRect();
  const centerX = width / 2;
  const centerY = height / 2;

  resize(-direction * scale, centerX, centerY);
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
