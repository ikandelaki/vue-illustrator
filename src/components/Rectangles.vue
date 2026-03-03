<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";

const store = useObjectsStore();
const { rectangles, selectedObjectId } = storeToRefs(store);
const { selectObject } = store;
</script>

<template>
  <rect
    v-for="(rectangle, key) in rectangles"
    class="shape rectangle"
    :x="rectangle.getX()"
    :y="rectangle.getY()"
    :rx="rectangle.rx"
    :ry="rectangle.ry"
    :width="rectangle.getWidth()"
    :height="rectangle.getHeight()"
    :key="key"
    :class="{ selected: selectedObjectId === rectangle.getId() }"
    @contextmenu.prevent="selectObject($event, rectangle.getId(), 'rectangle')"
    :style="{ fill: rectangle.getColor() }"
  />
</template>
