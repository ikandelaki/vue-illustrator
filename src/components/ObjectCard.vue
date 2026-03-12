<script setup lang="ts">
import { storeToRefs } from "pinia";
import { objectMap, shapeComponents, ShapeObject } from "../store/objects";
import { useObjectsStore } from "../store/objects";
import { watch, ref } from "vue";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { CircleInterface } from "../model/Circle";
import { RectangleInterface } from "../model/Rectangle";
import { TriangleInterface } from "../model/Triangle";

const props = defineProps<{
  name: string;
  type: string;
  id: number;
  color: string;
}>();

const objectsStore = useObjectsStore();
const { objects } = storeToRefs(objectsStore);
const { setObjectName } = objectsStore;

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
  if (props.type === SHAPE_TYPES.triangle) {
    const tri = sidebarObject.value as TriangleInterface;

    tri.x1 = 25;
    tri.y1 = 75;
    tri.x2 = 25;
    tri.y2 = 25;
    tri.x3 = 75;
    tri.y3 = 25;
  }
};

transformObject();

// Watch for color change for the specific object
// If the color changes, we should also update the color for the sidebar object as well
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
      <div class="details_shape">
        <svg>
          <component :is="shapeComponents[type]" :object="sidebarObject" />
        </svg>
      </div>
      <div class="details_description">
        <input
          type="text"
          name="name"
          :id="String(id)"
          :value="name"
          @input="(event) => setObjectName(event, id)"
        />
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

      &_description {
        display: flex;
        flex-direction: column;

        input {
          background: none;
          border: none;
          color: #f1f3f5;
          font-family: Fredoka;
          font-size: 24px;
          font-weight: bold;
          max-width: 100%;
          padding: 8px 16px;
          border-bottom: 1px solid #fff;

          &:focus-visible {
            border-bottom: 1px solid #fff;
            outline: none;
          }
        }
      }
    }
  }
}
</style>
