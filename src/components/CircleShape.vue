<script setup lang="ts">
import type { CircleInterface } from "../model/Circle";
import ShapeResizer from "./ShapeResizer.vue";
import { useObjectsStore } from "../store/objects";

const { object, selected } = defineProps<{
  object: CircleInterface;
  selected: boolean;
}>();

const { selectObject } = useObjectsStore();
</script>

<template>
  <circle
    class="shape circle"
    :cx="object.getCx()"
    :cy="object.getCy()"
    :r="object.getRadius()"
    :class="[{ selected: selected }, $attrs.class]"
    :style="{ fill: object.getColor() }"
    @contextmenu.prevent="selectObject($event, object.getId(), object.type)"
    @click="$emit('click')"
    @mousedown="$emit('mousedown', $event)"
  />
  <ShapeResizer />
</template>
