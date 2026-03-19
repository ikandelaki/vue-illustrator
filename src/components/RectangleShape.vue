<script setup lang="ts">
import type { RectangleInterface } from "../model/Rectangle";

const { object, selected } = defineProps<{
  object: RectangleInterface;
  selected?: boolean;
}>();

object.setTransform({ rotate: 45 });
</script>

<template>
  <g>
    <rect
      class="shape rectangle"
      :x="object.getX()"
      :y="object.getY()"
      :rx="object.rx"
      :ry="object.ry"
      :width="object.getWidth()"
      :height="object.getHeight()"
      :class="{ selected: selected }"
      :style="{ fill: object.getColor() }"
    />
  </g>
</template>
