<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import Loader from "./components/Loader.vue";
import Header from "./components/Header.vue";
import { CIRCLE, RECTANGLE, SHAPE_TYPES, ShapeType } from "./types/ShapeTypes";
import { useObjectsStore } from "./store/objects";
import Objects from "./components/Objects.vue";
import { useSelectedShapeStore } from "./store/selectedShape";
import { storeToRefs } from "pinia";

const ContextMenu = defineAsyncComponent({
  loader: () => import("./components/ContextMenu.vue"),
  loadingComponent: Loader,
  delay: 200,
});

const { createObject } = useObjectsStore();
const selectedShapeStore = useSelectedShapeStore();
const { setSelectedShape } = selectedShapeStore;
const { selectedShape } = storeToRefs(selectedShapeStore);

const handleCreateObject = (event: MouseEvent): void => {
  if (selectedShape.value === CIRCLE) {
    createObject(CIRCLE, event);
    return;
  }

  if (selectedShape.value === RECTANGLE) {
    createObject(RECTANGLE, event);
    return;
  }
};
</script>

<template>
  <Header :selectedShape="selectedShape" @select-shape="setSelectedShape" />
  <svg @click="handleCreateObject">
    <foreignObject x="0" y="40%" width="100%" height="200">
      <p class="canvas-details">
        Click on the canvas to draw a circle. click on a circle to select it.
        <br />
        Right-click on a circle to adjust its radius
      </p>
    </foreignObject>
    <Objects />
  </svg>
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
svg {
  width: 100vw;
  height: 100vh;
  background-color: #eee;
}

.canvas-details {
  text-align: center;
  padding: 0 50px;
  color: #bbb;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
  cursor: default;
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
