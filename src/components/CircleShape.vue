<script setup lang="ts">
import type { CircleInterface } from "../model/Circle";

const { object, selected } = defineProps<{
  object: CircleInterface;
  selected?: boolean;
}>();
</script>

<template>
  <g>
    <circle
      class="shape circle"
      :cx="object.cx"
      :cy="object.cy"
      :r="object.radius"
      :transform="object.getTransform()"
      :class="[{ selected: selected }, $attrs.class]"
      :style="{ fill: object.color, opacity: object.opacity }"
    />
  </g>
</template>
