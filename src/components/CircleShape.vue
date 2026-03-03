<script setup lang="ts">
import type { CircleInterface } from "../model/Circle";

const { object, selected } = defineProps<{
  object: CircleInterface;
  selected: boolean;
}>();
</script>

<template>
  <circle
    class="shape circle"
    :cx="object.getCx()"
    :cy="object.getCy()"
    :r="object.getRadius()"
    :class="{ selected: selected }"
    :style="{ fill: object.getColor() }"
  />
</template>
