<script setup lang="ts">
import { ShapeType } from "../types/ShapeTypes";
import AnimationTimeline from "./AnimationTimeline.vue";
import ChevronIcon from "./ChevronIcon.vue";
import GlobalConfig from "./GlobalConfig.vue";
import ShapeSelector from "./ShapeSelector.vue";
import { ref } from "vue";

const isExpanded = ref<boolean>(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

defineEmits<{
  (e: "select-shape", value: ShapeType): void;
}>();

defineProps<{
  selectedShape: string;
}>();
</script>

<template>
  <div class="header-container" :class="{ isExpanded }">
    <div class="size">
      <ShapeSelector @select-shape="$emit('select-shape', $event)" />
      <GlobalConfig />
    </div>
    <Transition>
      <AnimationTimeline v-show="isExpanded" />
    </Transition>
    <button class="header-expand-button" @click="toggleExpand">
      <ChevronIcon />
    </button>
  </div>
</template>

<style lang="scss">
.header {
  &-container {
    position: absolute;
    z-index: 9;
    width: 100%;
    background: #343a40;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 8px 16px 16px;
    box-shadow: 0px 8px 10px -10px black;
    flex-wrap: wrap;
    gap: 8px;

    .size {
      display: flex;
      gap: 8px;
      background-color: var(--dark-gray);
      z-index: 1;
    }

    &.isExpanded {
      .header-expand-button {
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }

  &-expand-button {
    position: absolute;
    inset-block-end: -18px;
    width: 36px;
    height: 36px;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;

    svg {
      transition: transform 0.3s;
    }

    path {
      transition: all 0.3s;

      fill: var(--mid-gray);
      stroke: var(--dark-gray);
    }

    &:hover {
      path {
        fill: var(--light-gray);
      }
    }
  }
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: max-height 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  max-height: 0;
}

.v-enter-from,
.v-leave-to {
  max-height: 500px;
}
</style>
