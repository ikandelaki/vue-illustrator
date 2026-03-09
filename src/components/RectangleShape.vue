<script setup lang="ts">
import type { RectangleInterface } from "../model/Rectangle";
import ShapeResizer from "./ShapeResizer.vue";
import { useObjectsStore } from "../store/objects";

const { selectObject } = useObjectsStore();

const { object, selected } = defineProps<{
  object: RectangleInterface;
  selected: boolean;
}>();
</script>

<template>
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
</template>
