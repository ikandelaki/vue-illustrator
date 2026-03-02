<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCirclesStore } from "../store/circles";

const store = useCirclesStore();
const { circles, selectedCircleId } = storeToRefs(store);
const { selectCircle } = store;
</script>
<template>
  <circle
    v-for="(circle, key) in circles"
    class="shape circle"
    :cx="circle.getCx()"
    :cy="circle.getCy()"
    :r="circle.getRadius()"
    :class="{ selected: selectedCircleId === circle.getId() }"
    @contextmenu.prevent="selectCircle($event, circle.getId())"
    :key="key"
    :style="{ fill: circle.getColor() }"
  />
</template>
<style scoped></style>
