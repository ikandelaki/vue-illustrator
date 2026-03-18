<script setup lang="ts">
import { computed } from "vue";
import { TriangleInterface } from "../model/Triangle";

const { object } = defineProps<{
  object: TriangleInterface;
}>();

const points = computed(() => {
  return `${object.x1},${object.y1} ${object.x2},${object.y2} ${object.x3},${object.y3}`;
});
</script>

<template>
  <g>
    <polygon :points="points" :fill="object.color" />
  </g>
</template>
