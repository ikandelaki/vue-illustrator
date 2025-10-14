<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import Circle, { CircleInterface } from './model/Circle'
import { ContextMenuLocation } from './types/ContextMenuLocation'
import Loader from './components/Loader.vue'
import RangeInput from './components/RangeInput.vue'
import ColorInput from './components/ColorInput.vue'
import { CircleMenuItemsInterface } from './types/CircleMenuItems'

const ContextMenu = defineAsyncComponent({
  loader: () => import('./components/ContextMenu.vue'),
  loadingComponent: Loader,
  delay: 200
})

const circles = ref<Record<number, CircleInterface>>({})
const selectedCircleId = ref<number | null>(null)
const isContextMenuOpened = ref<boolean>(false)
const contextMenuLocation = ref<ContextMenuLocation>({ x: 0, y: 0 })

// computed style object for context menu
const contextMenuStyles = computed(() => ({
  top: `${contextMenuLocation.value.y}px`,
  left: `${contextMenuLocation.value.x}px`
}))

const selectedCircleRadius = computed(() => {
  if (!selectedCircleId.value) {
    return 0
  }

  const circle = circles.value[selectedCircleId.value]
  return circle ? circle.getRadius() : 0
})

const setSelectedCircleRadius = (value?: number) => {
  if (!selectedCircleId.value || !value) {
    return
  }

  const circle = circles.value[selectedCircleId.value]
  if (!circle) {
    return
  }

  const radius = Math.min(value, 1000)
  circle.setRadius(radius)
}

const selectedCircleColor = computed(() => {
    if (!selectedCircleId.value) {
      return '#ffffff';
    }

    return circles.value[selectedCircleId.value].getColor()
})

const setSelectedCircleColor = (value?: string) => {
  if (!selectedCircleId.value || !value) {
      return;
  }

  circles.value[selectedCircleId.value].setColor(value)
}

// typed event handler for SVG click
const createCircle = (event: MouseEvent): void => {
  selectCircle() // Deselect current selection

  const { clientX, clientY } = event
  const id = Object.keys(circles.value).length + 1
  const circle = new Circle(id, clientX, clientY)

  circles.value[id] = circle
}

/**
 * Opens up custom context menu to manage circle properties.
 * If called without arguments, deselects all circles.
 */
const selectCircle = (event?: MouseEvent, id?: number | null): void => {
  const { clientX = 0, clientY = 0 } = event ?? {}
  selectedCircleId.value = id ?? null

  if (!id) {
    isContextMenuOpened.value = false
    return
  }

  isContextMenuOpened.value = true
  contextMenuLocation.value = { x: clientX, y: clientY }
}

const circleMenuItems: CircleMenuItemsInterface<any>[] = [
  {
    name: 'Radius',
    child: RangeInput,
    props: {},
    value: selectedCircleRadius,
    setValue: setSelectedCircleRadius,
    closeMenu: selectCircle
  },
  {
    name: 'Color',
    child: ColorInput,
    props: {},
    value: selectedCircleColor,
    setValue: setSelectedCircleColor
  }
]
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
      :r="circle.getRadius()"
      :class="{ selected: selectedCircleId === circle.getId() }"
      @contextmenu.prevent="selectCircle($event, circle.getId())"
      :key="key"
      :style="{ fill: circle.getColor() }"
      />
  </svg>
  <ContextMenu v-if="isContextMenuOpened"
      :style="contextMenuStyles"
      v-model:selectedCircleColor="selectedCircleColor"
      @closeMenu="selectCircle"
      :menuItems="circleMenuItems"
    />
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
</style>
