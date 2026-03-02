<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import Loader from "./components/Loader.vue";
import Header from "./components/Header.vue";
import { CIRCLE, RECTANGLE, SHAPE_TYPES, ShapeType } from "./types/ShapeTypes";
import { useCirclesStore } from "./store/circles";
import { storeToRefs } from "pinia";
import { useRectanglesStore } from "./store/rectangles";
import Circles from "./components/Circles.vue";

const ContextMenu = defineAsyncComponent({
  loader: () => import("./components/ContextMenu.vue"),
  loadingComponent: Loader,
  delay: 200,
});

const circlesStore = useCirclesStore();
const rectanglesStore = useRectanglesStore();

const { createCircle } = circlesStore;

const { rectangles } = storeToRefs(rectanglesStore);
const { createRectangle } = rectanglesStore;

const selectedShape = ref<ShapeType>(CIRCLE);

const createObject = (event: MouseEvent): void => {
  if (selectedShape.value === CIRCLE) {
    createCircle(event);
    return;
  }

  if (selectedShape.value === RECTANGLE) {
    createRectangle(event);
    return;
  }
};

const setSelectedShape = (value: ShapeType) => {
  if (!(value in SHAPE_TYPES)) {
    console.error(">> setSelectedShape: not a correct shape type");
    return;
  }

  if (value === selectedShape.value) {
    return;
  }

  selectedShape.value = value;
};
</script>

<template>
  <Header :selectedShape="selectedShape" @select-shape="setSelectedShape" />
  <svg @click="createObject">
    <foreignObject x="0" y="40%" width="100%" height="200">
      <p class="canvas-details">
        Click on the canvas to draw a circle. click on a circle to select it.
        <br />
        Right-click on a circle to adjust its radius
      </p>
    </foreignObject>
    <Circles />
    <rect
      v-for="(rectangle, key) in rectangles"
      class="shape rectangle"
      :x="rectangle.x"
      :y="rectangle.y"
      :rx="rectangle.rx"
      :ry="rectangle.ry"
      :width="rectangle.width"
      :height="rectangle.height"
      :key="key"
      :style="{ fill: rectangle.color }"
    />
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
