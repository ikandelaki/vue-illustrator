<script setup lang="ts">
import { useTimeline } from '../composables/useTimeline'
import KeyframeMarker from './KeyframeMarker.vue'
import type { TimelineTrack } from '../types/timeline'

const props = defineProps<{
  track: TimelineTrack
}>()

const { totalWidth, xToTime, timeToX, addKeyframe } = useTimeline()

const onTrackDblClick = (e: MouseEvent) => {
  const rect    = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x       = e.clientX - rect.left
  const time    = xToTime(x)
  addKeyframe(props.track.id, time)
}
</script>

<template>
  <div class="track" :style="{ width: totalWidth + 'px' }" @dblclick="onTrackDblClick">
    <!-- track background lanes -->
    <div class="track-lane" />

    <!-- keyframe markers -->
    <KeyframeMarker
      v-for="kf in track.keyframes"
      :key="kf.id"
      :keyframe="kf"
      :trackId="track.id"
      :trackColor="track.color"
      :style="{ left: timeToX(kf.time) + 'px' }"
    />
  </div>
</template>

<style scoped>
.track {
  position:   relative;
  height:     40px;
  flex-shrink: 0;
}

.track-lane {
  position:     absolute;
  inset:        4px 0;
  border-radius: 4px;
  background:   rgba(255, 255, 255, 0.03);
  border:       1px solid rgba(255, 255, 255, 0.06);
  transition:   background 0.15s;
}

.track:hover .track-lane {
  background: rgba(255, 255, 255, 0.055);
}
</style>
