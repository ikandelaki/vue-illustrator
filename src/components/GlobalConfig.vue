<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGlobalStore } from "../store/global";
import ColorInput from "./ColorInput.vue";

const globalStore = useGlobalStore();
const { size, color } = storeToRefs(globalStore);
const { setSize, setColor } = globalStore;

const handleSizeChange = (e: Event) => {
  const val = e.currentTarget?.value;

  if (!val) {
    return;
  }

  setSize(Number(val));
};

const handleColorChange = (val?: string) => {
  if (!val) {
    return;
  }

  setColor(val);
};
</script>

<template>
  <div class="global-config">
    <div class="size">
      <h4>size</h4>
      <input
        name="size"
        type="number"
        placeholder="size"
        min="1"
        max="1000"
        :value="size"
        @input="handleSizeChange"
      />
    </div>
    <div class="color">
      <ColorInput :value="color" @update:value="handleColorChange" />
    </div>
  </div>
</template>

<style lang="scss">
.global-config {
  margin-inline-start: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  .size {
    display: flex;
    align-items: center;
    gap: 8px;

    h4 {
      color: #ffffff;
      height: 100%;
    }

    input {
      background: none;
      border: none;
      outline: none;
      color: var(--mid-gray);
      max-width: 75px;
      padding: 4px 8px;
      border: 1px solid var(--secondary-info-color);

      &::placeholder {
        color: var(--light-gray);
        font-family: "Fredoka", sans-serif;
      }
    }
  }

  .context-menu {
    &_color {
      margin-block-start: 0;

      input {
        border: 1px solid #ffffff;
        cursor: pointer;

        &::-webkit-color-swatch-wrapper {
          padding: 0;
          border: none;
        }

        &::-webkit-color-swatch {
          border: none;
        }
      }
    }
  }
}
</style>
