<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useObjectsStore } from "../store/objects";
import ObjectCard from "./ObjectCard.vue";

const objectsStore = useObjectsStore();
const { objects } = storeToRefs(objectsStore);
const { setSelectedObject } = objectsStore;
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
            :key="object.id + object.type"
            @click="setSelectedObject(object.id)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  width: 400px;
  height: 100vh;
  overflow: auto;
  background-color: var(--main-black);
  display: none;

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
