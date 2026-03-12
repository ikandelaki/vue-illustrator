<script setup lang="ts">
import { storeToRefs } from "pinia";
import { objectMap, shapeComponents, ShapeObject } from "../store/objects";
import { useObjectsStore } from "../store/objects";
import { watch, ref } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";
import { RectangleInterface } from "../model/Rectangle";

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

const transformObject = () => {
  if (props.type === SHAPE_TYPES.circle) {
    const circle = sidebarObject.value as CircleInterface;

    circle.setCx(circle.radius);
    circle.setCy(circle.radius);
  }

  if (props.type === SHAPE_TYPES.rectangle) {
    const rect = sidebarObject.value as RectangleInterface;

    rect.width = 50;
    rect.height = 50;
    rect.x = rect.width / 2;
    rect.y = rect.height / 2;
  }
};

transformObject();

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
