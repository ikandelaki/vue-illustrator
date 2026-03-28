<script setup lang="ts">
import { computed, ref } from "vue";
import { MenuItemsInterface } from "../types/CircleMenuItems";
import { useObjectsStore } from "../store/objects";
import { storeToRefs } from "pinia";
import RangeInput from "./RangeInput.vue";
import ColorInput from "./ColorInput.vue";
import { useContextMenuStore } from "../store/contextMenu";

const contextMenuStore = useContextMenuStore();
const objectsStore = useObjectsStore();
const {
  selectedObjectRadius,
  selectedObjectColor,
  selectedObjectType,
  selectedObjectId,
} = storeToRefs(objectsStore);
const {
  setSelectedObjectRadius,
  setSelectedObjectColor,
  selectObject,
  deleteObject,
} = objectsStore;
const { isContextMenuOpened, contextMenuLocation, selectedMenuItemIndex } =
  storeToRefs(contextMenuStore);
const { setSelectedMenuItemIndex } = contextMenuStore;

// computed style object for context menu
const contextMenuStyles = computed(() => ({
  top: `${contextMenuLocation.value.y}px`,
  left: `${contextMenuLocation.value.x}px`,
}));

// Individual control elements in the context menu
// Build menu items based on selected object type
const menuItems = computed(() => {
  const items: MenuItemsInterface<any>[] = [
    {
      name: "Color",
      child: ColorInput,
      props: {
        title: "Choose the color:",
      },
      value: selectedObjectColor.value,
      setValue: setSelectedObjectColor,
    },
  ];

  // Only show radius for circles
  if (selectedObjectType.value === "circle") {
    items.push({
      name: "Radius",
      child: RangeInput,
      props: {},
      value: selectedObjectRadius.value,
      setValue: setSelectedObjectRadius,
    });
  }

  return items;
});

defineProps<{
  style?: Record<string, string>;
}>();
</script>

<template>
  <div
    class="context-menu"
    :style="contextMenuStyles"
    v-if="isContextMenuOpened"
  >
    <div class="context-menu_parent" v-if="selectedMenuItemIndex === null">
      <div class="context-menu_navigate">
        <span>Adjust...</span>
        <button @click="selectObject">X</button>
      </div>
      <p
        v-for="(item, index) in menuItems"
        @click="selectedMenuItemIndex = index"
        :key="index"
      >
        <span>{{ item.name }}</span>
        <span>></span>
      </p>
      <button
        class="context-menu_delete"
        @click="deleteObject(selectedObjectId)"
      >
        Delete
      </button>
    </div>
    <div v-if="selectedMenuItemIndex !== null">
      <div class="context-menu_navigate">
        <button @click="() => setSelectedMenuItemIndex(0)">Back</button>
        <button @click="selectObject">X</button>
      </div>
      <div class="context-menu_component">
        <component
          :is="menuItems[selectedMenuItemIndex].child"
          v-bind="menuItems[selectedMenuItemIndex].props"
          :value="menuItems[selectedMenuItemIndex].value"
          @update:value="menuItems[selectedMenuItemIndex].setValue"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.context-menu {
  position: absolute;
  max-width: 300px;
  padding: 16px 16px;
  border-radius: 8px;
  border: 1px solid #212529;
  text-align: center;
  background-color: #0ca678;
  font-family: "Fredoka";

  &.active {
    display: block;
  }

  &_parent {
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      gap: 8px;

      span {
        &:first-child {
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  &_header {
    display: flex;
  }

  &_range {
    input[type="range"] {
      -webkit-appearance: none; /* Remove default styling (Chrome, Safari, Edge) */
      appearance: none;
      width: 100%;
      height: 6px;
      background: #ddd;
      border-radius: 5px;
      outline: none;
    }

    /* --- TRACK --- */
    input[type="range"]::-webkit-slider-runnable-track {
      background: #087f5b; /* 🟢 your custom color */
      height: 6px;
      border-radius: 5px;
    }

    input[type="range"]::-moz-range-track {
      background: #087f5b;
      height: 6px;
      border-radius: 5px;
    }

    input[type="range"]::-ms-track {
      background: #087f5b;
      height: 6px;
      border-radius: 5px;
      border-color: transparent;
      color: transparent;
    }

    /* --- THUMB --- */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      background: #212529;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      cursor: pointer;
      margin-top: -6px; /* centers the thumb */
    }

    input[type="range"]::-moz-range-thumb {
      background: #212529;
      border: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      cursor: pointer;
    }

    input[type="range"]::-ms-thumb {
      background: #212529;
      border: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      cursor: pointer;
    }

    .range-input {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
    }

    .selected-value {
      font-size: 12px;
      display: block;
    }
  }

  input {
    background: transparent;
    border: none;
    text-decoration: underline;
    color: #212529;
    font-family: "Fredoka";

    &:focus,
    &:focus-visible {
      border: none;
      outline: none;

      color: #444;
    }
  }

  &_color {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  button {
    background-color: transparent;
    padding: 2px 4px;
    height: max-content;
    cursor: pointer;
    border: 1px solid #212529;
    border-radius: 2px;
    transition: all 0.1s ease-out;

    &:hover {
      background-color: #087f5b;
      border: 1px solid #c3fae8;
      color: #c3fae8;
    }

    &.context-menu_delete {
      background-color: #f03e3e;

      &:hover {
        color: #000;
        border: 1px solid #000;
        background-color: #ff6b6b;
      }
    }
  }

  &_navigate {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  &_component {
    margin-top: 8px;
  }
}
</style>
