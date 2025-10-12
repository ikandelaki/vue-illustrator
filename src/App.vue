<script setup lang="ts">
import { ref, computed, provide, readonly } from 'vue'
import Circle, { CircleInterface } from './model/Circle'
import ContextMenu from './components/ContextMenu.vue'
import { ContextMenuLocation } from './types/ContextMenuLocation'
import { testRefKey } from './keys/keys'

const circles = ref<Record<number, CircleInterface>>({})
const selectedCircleId = ref<number | null>(null)
const isContextMenuOpened = ref<boolean>(false)
const contextMenuLocation = ref<ContextMenuLocation>({ x: 0, y: 0 })
const testRef = ref<number>(2)
const increaseTestRef = () => {
  testRef.value++
}
provide(testRefKey, { 
  testRef: readonly(testRef),
  increaseTestRef
});
const selectedCircleColor = computed({
  get: () => {
    if (!selectedCircleId.value) {
      return '#ffffff';
    }

    return circles.value[selectedCircleId.value].getColor()
  },
  set: (color: string) => {
    if (!selectedCircleId.value) {
      return;
    }

    circles.value[selectedCircleId.value].setColor(color)
  }
})

// computed style object for context menu
const contextMenuStyles = computed(() => ({
  top: `${contextMenuLocation.value.y}px`,
  left: `${contextMenuLocation.value.x}px`
}))

// computed with getter & setter properly typed
const selectedCircleRadius = computed<number>({
  get() {
    if (!selectedCircleId.value) {
      return 0
    }

    const circle = circles.value[selectedCircleId.value]
    return circle ? circle.getRadius() : 0
  },
  set(value: number) {
    if (!selectedCircleId.value) {
      return
    }

    const circle = circles.value[selectedCircleId.value]
    if (!circle) {
      return
    }

    const radius = Math.min(value, 1000)
    circle.setRadius(radius)
  }
})

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
  <ContextMenu 
      :isContextMenuOpened
      :style="contextMenuStyles"
      v-model:selectedCircleRadius="selectedCircleRadius"
      v-model:selectedCircleColor="selectedCircleColor"
      @select-circle="selectCircle"
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
