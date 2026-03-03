<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";

const store = useObjectsStore();
const { circles, selectedObjectId } = storeToRefs(store);
const { selectObject } = store;
</script>
<template>
  <circle
    v-for="(circle, key) in circles"
    class="shape circle"
    :cx="circle.getCx()"
    :cy="circle.getCy()"
    :r="circle.getRadius()"
    :class="{ selected: selectedObjectId === circle.getId() }"
    @contextmenu.prevent="selectObject($event, circle.getId(), 'circle')"
    :key="key"
    :style="{ fill: circle.getColor() }"
  />
</template>
<style scoped></style>
