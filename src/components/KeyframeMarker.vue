<script setup lang="ts">
import { ref } from 'vue'
import { useTimeline } from '../composables/useTimeline'
import type { Keyframe } from '../types/timeline'

const props = defineProps<{
  keyframe: Keyframe
  trackId: number
  trackColor: string
}>()

const emit = defineEmits<{
  dragstart: [keyframeId: number]
  dragend:   [keyframeId: number]
}>()

const { moveKeyframe, xToTime, zoom, removeKeyframe } = useTimeline()

const isDragging  = ref(false)
const isHovered   = ref(false)
const dragStartX  = ref(0)
const dragStartTime = ref(0)

const onMousedown = (e: MouseEvent) => {
  if (e.button === 2) return // right-click handled separately
  e.stopPropagation()
  isDragging.value    = true
  dragStartX.value    = e.clientX
  dragStartTime.value = props.keyframe.time
  emit('dragstart', props.keyframe.id)

  const onMousemove = (e: MouseEvent) => {
    if (!isDragging.value) return
    const dx      = e.clientX - dragStartX.value
    const dtSecs  = dx / zoom.value
    const newTime = dragStartTime.value + dtSecs
    moveKeyframe(props.trackId, props.keyframe.id, newTime)
  }

  const onMouseup = () => {
    isDragging.value = false
    emit('dragend', props.keyframe.id)
    window.removeEventListener('mousemove', onMousemove)
    window.removeEventListener('mouseup', onMouseup)
  }

  window.addEventListener('mousemove', onMousemove)
  window.addEventListener('mouseup', onMouseup)
}

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  removeKeyframe(props.trackId, props.keyframe.id)
}
</script>

<template>
  <div
    class="keyframe-marker"
    :class="{ dragging: isDragging, hovered: isHovered }"
    :style="{ '--track-color': trackColor }"
    @mousedown="onMousedown"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @contextmenu="onContextMenu"
    :title="`${keyframe.time.toFixed(2)}s — right-click to delete`"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" overflow="visible">
      <!-- drop shadow -->
      <polygon
        points="7,1 13,7 7,13 1,7"
        fill="rgba(0,0,0,0.4)"
        transform="translate(1,1.5)"
      />
      <!-- outer diamond -->
      <polygon
        class="diamond-outer"
        points="7,1 13,7 7,13 1,7"
      />
      <!-- inner highlight -->
      <polygon
        class="diamond-inner"
        points="7,3.5 10.5,7 7,10.5 3.5,7"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="1"
      />
    </svg>
  </div>
</template>

<style scoped>
.keyframe-marker {
  position:   absolute;
  top:        50%;
  transform:  translate(-50%, -50%);
  cursor:     grab;
  z-index:    10;
  line-height: 0;
  transition: filter 0.12s ease;
}

.keyframe-marker:hover .diamond-outer,
.keyframe-marker.hovered .diamond-outer {
  filter: brightness(1.35);
}

.keyframe-marker.dragging {
  cursor: grabbing;
  filter: drop-shadow(0 0 5px var(--track-color));
  z-index: 20;
}

.diamond-outer {
  fill:   var(--track-color, #f0b429);
  stroke: color-mix(in srgb, var(--track-color, #f0b429) 40%, #000);
  stroke-width: 1px;
  transition: fill 0.12s ease;
}

.keyframe-marker:hover .diamond-outer {
  fill: color-mix(in srgb, var(--track-color, #f0b429) 80%, #fff);
}
</style>
