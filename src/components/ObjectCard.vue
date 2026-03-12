<script setup lang="ts">
import { storeToRefs } from "pinia";
import Circle, { DEFAULT_CIRCLE_RADIUS } from "../model/Circle";
import { objectMap, shapeComponents, ShapeObject } from "../store/objects";
import { useObjectsStore } from "../store/objects";
import { watch, ref } from "vue";

const props = defineProps<{
  name: string;
  type: string;
  id: number;
  color: string;
}>();

const objectsStore = useObjectsStore();
const { objects } = storeToRefs(objectsStore);

const object = new objectMap.value[props.type]();
const sidebarObject = ref<ShapeObject>(object);

watch(
  () => objects.value[props.id].color,
  (value?: string) => {
    if (!value) {
      return;
    }

    sidebarObject.value.color = value;
  },
);
</script>

<template>
  <div class="object-card">
    <div>
      {{ id }}
    </div>
    <div class="object-card_details">
      <svg class="details_shape">
        <component :is="shapeComponents[type]" :object="sidebarObject" />
      </svg>
      <div class="details_description">
        <h2>{{ name }}</h2>
        <span>{{ type }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.object-card {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #f1f3f5;

  &_details {
    display: flex;
    align-items: center;
    gap: 8px;

    .details {
      &_shape {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
