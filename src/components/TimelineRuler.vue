<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

const { duration, zoom, totalWidth, xToTime, currentTime } = useTimeline()

// How many seconds between major ticks, depending on zoom
const tickInterval = computed<number>(() => {
  const pxPerSec = zoom.value
  if (pxPerSec >= 200) return 0.5
  if (pxPerSec >= 100) return 1
  if (pxPerSec >= 60)  return 2
  if (pxPerSec >= 40)  return 5
  return 10
})

const ticks = computed(() => {
  const interval = tickInterval.value
  const count    = Math.floor(duration.value / interval)
  return Array.from({ length: count + 1 }, (_, i) => {
    const time = i * interval
    return { time, x: time * zoom.value, isMajor: true }
  })
})

// Minor ticks between major ones (4 subdivisions)
const minorTicks = computed(() => {
  const interval = tickInterval.value
  const minor    = interval / 4
  const count    = Math.floor(duration.value / minor)
  return Array.from({ length: count + 1 }, (_, i) => {
    const time = i * minor
    // skip positions that coincide with a major tick
    if (Math.round(time / interval * 1000) % 1000 === 0) return null
    return { time, x: time * zoom.value }
  }).filter(Boolean) as { time: number; x: number }[]
})

const formatTime = (secs: number): string => {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0
    ? `${m}:${String(s.toFixed(s % 1 === 0 ? 0 : 1)).padStart(2, '0')}`
    : `${s % 1 === 0 ? s : s.toFixed(1)}s`
}

const emit = defineEmits<{ seek: [time: number] }>()

const onRulerClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x    = e.clientX - rect.left
  currentTime.value = xToTime(x)
  emit('seek', currentTime.value)
}
</script>

<template>
  <div
    class="ruler"
    :style="{ width: totalWidth + 'px' }"
    @click="onRulerClick"
  >
    <svg
      :width="totalWidth"
      height="32"
      class="ruler-svg"
    >
      <!-- background -->
      <rect width="100%" height="32" fill="transparent" />

      <!-- minor ticks -->
      <line
        v-for="tick in minorTicks"
        :key="'minor-' + tick.time"
        :x1="tick.x"
        :x2="tick.x"
        y1="22"
        y2="32"
        stroke="#3a3a4a"
        stroke-width="1"
      />

      <!-- major ticks + labels -->
      <g v-for="tick in ticks" :key="'major-' + tick.time">
        <line
          :x1="tick.x"
          :x2="tick.x"
          y1="16"
          y2="32"
          stroke="#5a5a6a"
          stroke-width="1"
        />
        <text
          :x="tick.x + 4"
          y="13"
          class="ruler-label"
        >
          {{ formatTime(tick.time) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.ruler {
  position:   relative;
  height:     32px;
  cursor:     pointer;
  flex-shrink: 0;
  user-select: none;
}

.ruler-svg {
  display: block;
  overflow: visible;
}

.ruler-label {
  fill:        #7a7a9a;
  font-size:   10px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
</style>
