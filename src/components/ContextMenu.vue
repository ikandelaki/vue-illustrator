<script setup lang="ts">
import { CircleMenuItemsInterface } from '../types/CircleMenuItems';

const selectedCircleColor = defineModel('selectedCircleColor')

defineProps<{
    menuItems?: Array<CircleMenuItemsInterface>,
    contextMenuStyles?: Record<string, string>,
    selectedCircleRadius?: number,
    selectedCircleColor?: string
}>()
</script>

<template>
  <div class="context-menu" :style="contextMenuStyles">
    <!-- <div class="context-menu_parent" v-if="!selectedMenuItemIndex">
      <p v-for="(menuItem) in menuItems" @click="selectedMenuItemIndex = menuItem">
        <span>{{ menuItem }}</span>
        <span>></span>
      </p>
    </div> -->
    <!-- <div v-if="selectedMenuItemIndex"> -->
      <div v-for="(menuItem, index) in menuItems" :key="index">
        <component
          :is="menuItem.child"
          v-bind="menuItem.props"
          :value="menuItem.modelValue"
          @update:value="menuItem.modelEmit"
          @closeMenu="menuItem.closeMenu"
        />
      </div>
      <div class="context-menu_color">
        <p>Choose the color:</p>
        <input id="color-picker" type="color" v-model="selectedCircleColor" />
      </div>
    <!-- </div> -->
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
  font-family: 'Fredoka';

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

    button {
      margin-top: 4px;
      background-color: transparent;
      padding: 2px 4px;
      height: max-content;
      cursor: pointer;
      border: 1px solid #212529;
      border-radius: 2px;
      transition: all 0.1s ease-out;

      &:hover {
        background-color:#087f5b;
        border: 1px solid #c3fae8;
        color: #c3fae8;
      }
    }
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
    font-family: 'Fredoka';

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
    gap: 8px
  }
}
</style>