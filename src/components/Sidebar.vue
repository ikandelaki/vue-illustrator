<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import ObjectCard from "./ObjectCard.vue";

const objectsStore = useObjectsStore();
const { objects } = storeToRefs(objectsStore);
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-container">
      <ul>
        <li v-for="object in objects">
          <ObjectCard
            :name="object.name"
            :type="object.type"
            :id="object.id"
            :color="object.color"
            :key="object.id + object.name"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  position: absolute;
  right: 0;
  top: 0;
  width: 400px;
  height: 100%;
  background-color: #212529;

  &-container {
    margin-block-start: var(--header-total-height);
    padding: 8px 16px;

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
