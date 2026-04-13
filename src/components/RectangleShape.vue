<script setup lang="ts">
import type { RectangleInterface } from "../model/Rectangle";

const { object, selected } = defineProps<{
  object: RectangleInterface;
  selected?: boolean;
}>();
</script>

<template>
  <g>
    <rect
      class="shape rectangle"
      :x="object.x"
      :y="object.y"
      :rx="object.rx"
      :ry="object.ry"
      :width="object.width"
      :height="object.height"
      :class="{ selected: selected }"
      :transform="object.getTransform()"
      :style="{ fill: object.color, opacity: object.opacity }"
    />
  </g>
</template>
