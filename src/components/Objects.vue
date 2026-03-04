<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import CircleShape from "./CircleShape.vue";
import RectangleShape from "./RectangleShape.vue";
import { CIRCLE, RECTANGLE } from "../types/ShapeTypes";

const objectsStore = useObjectsStore();
const { objects, selectedObjectId } = storeToRefs(objectsStore);

// registry that maps type string to component
const shapeRegistry: Record<string, any> = {
  [CIRCLE]: CircleShape,
  [RECTANGLE]: RectangleShape,
};

// generic list that will grow as we add new types
const shapeComponents = computed(() => shapeRegistry);
</script>

<template>
  <component
    v-for="object in objects"
    :is="shapeComponents[object.type] || null"
    :key="object.getId()"
    :object="object"
    :selected="selectedObjectId === object.getId()"
    class="shape"
  />
</template>

<style>
.shape {
  cursor: pointer;
}
</style>
