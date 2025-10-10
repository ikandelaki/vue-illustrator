<script setup lang="ts">
import { ref, computed } from 'vue'
import Circle from './model/Circle'

const circles = ref({})
const selectedCircleId = ref(null)
const isContextMenuOpened = ref(false)
const contextMenuLocation = ref({})
const contextMenuStyles = computed(() => ({
  top: contextMenuLocation.value.y + 'px',
  left: contextMenuLocation.value.x + 'px'
}))

const selectedCircleRadius = computed({
  get() {
    if (!selectedCircleId.value) {
      return 0
    }

    return circles.value[selectedCircleId.value].getR()
  },
  set(value) {
    if (!selectedCircleId.value) {
      return
    }

    circles.value[selectedCircleId.value].setR(value)
  }
});

const createCircle = ({ clientX, clientY }) => {
  selectCircle();
  const id = Object.keys(circles.value).length + 1;
  const circle = new Circle(id, clientX, clientY);

  circles.value[id] = circle;
}

/**
 * Method to open up custom context menu to manage element's properties
 * - If selectCircle is called without arguments it will just deselect all circles
 * 
 * @param event click event to get clientX and clientY
 * @param id circle id
 */
const selectCircle = (event, id) => {
  const { clientX, clientY } = event || {};
  selectedCircleId.value = id;

  // If no id is provided or it is null we will just deselect all circles and close context menu if opened
  if (!id) {
    isContextMenuOpened.value = false;

    return;
  }

  // TODO: open context menu on top of a selected circle
  isContextMenuOpened.value = true;
  contextMenuLocation.value = {
    y: clientY,
    x: clientX,
  }
}
</script>
<template>
  <svg @click="createCircle">
    <foreignObject x="0" y="40%" width="100%" height="200">
      <p class="canvas-details">
        Click on the canvas to draw a  circle. click on a circle to select it. <br />
      Right-click on a circle to adjust its radius
      </p>
    </foreignObject>
    <circle v-for="(circle, key) in circles"
      class="circle"
      :cx="circle.getCx()"
      :cy="circle.getCy()"
      :r="circle.getR()"
      :class="{ selected: selectedCircleId === circle.getId() }"
      @contextmenu.prevent="selectCircle($event, circle.getId())"
      :key="key" />
  </svg>
  <div v-if="isContextMenuOpened"
    class="context-menu"
    :class="{ active: isContextMenuOpened }"
    :style="contextMenuStyles"
    >
    <div class="context-menu_header">
      <p>Adjust the radius of a selected circle</p>
      <button @click="selectCircle">X</button>
    </div>
    <div class="context-menu_range">
      <div class="range-input">
        <span>1</span>
        <input type="range" min="1" max="1000" step="1" v-model="selectedCircleRadius" />
        <span>1000</span>
      </div>
      <span class="selected-value">Current: {{ selectedCircleRadius }}</span>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
svg {
  width: 100vw;
  height: 100vh;
  background-color: #eee;
}

.canvas-details {
  text-align: center;
  padding: 0 50px;
  color: #bbb;
}

.circle {
  fill: #fff;
  stroke: #212529;
  stroke-width: 1;

  &.selected {
    fill: #868e96;
  }
}

.context-menu {
  position: absolute;
  width: 300px;
  padding: 16px 16px;
  border-radius: 8px;
  border: 1px solid #212529;
  text-align: center;
  background-color: #0ca678;
  font-family: 'Fredoka';

  &.active {
    display: block;
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
}
</style>
