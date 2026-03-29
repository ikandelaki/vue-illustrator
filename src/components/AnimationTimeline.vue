<script setup lang="ts">
import { ref, computed } from "vue";
import { useTimeline } from "../composables/useTimeline";
import TimelineRuler from "./TimelineRuler.vue";
import TimelineTrack from "./TimelineTrack.vue";
import TimelinePointer from "./TimelinePointer.vue";

const {
  tracks,
  currentTime,
  duration,
  zoom,
  isPlaying,
  totalWidth,
  togglePlay,
  stop,
  zoomIn,
  zoomOut,
  handleWheelZoom,
  xToTime,
} = useTimeline();

// Label column width
const LABEL_WIDTH = 160;

// Scrollable tracks area ref (passed to pointer for drag calc)
const scrollEl = ref<HTMLElement | null>(null);

// Click on ruler / track area to seek
const onScrollAreaClick = (e: MouseEvent) => {
  if (!scrollEl.value) return;
  // Only seek on direct clicks (not keyframe drags)
  const target = e.target as HTMLElement;
  if (
    target.closest(".keyframe-marker") ||
    target.closest(".pointer-head") ||
    target.closest(".pointer-line")
  )
    return;

  const rect = scrollEl.value.getBoundingClientRect();
  const x = e.clientX - rect.left + scrollEl.value.scrollLeft;
  currentTime.value = xToTime(x);
};

// Formatted total duration
const formatDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `${sec}s`;
};

const progressPercent = computed(
  () => (currentTime.value / duration.value) * 100,
);
</script>

<template>
  <div class="timeline" @wheel.passive="handleWheelZoom">
    <!-- Transport bar -->
    <div class="transport">
      <div class="transport-left">
        <!-- Stop -->
        <button class="t-btn" title="Stop" @click="stop">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <rect
              x="2"
              y="2"
              width="12"
              height="12"
              rx="1"
              fill="currentColor"
            />
          </svg>
        </button>

        <!-- Play / Pause -->
        <button
          class="t-btn t-btn--play"
          :class="{ active: isPlaying }"
          @click="togglePlay"
          title="Play / Pause"
        >
          <svg v-if="!isPlaying" viewBox="0 0 16 16" width="14" height="14">
            <polygon points="3,1 15,8 3,15" fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 16 16" width="14" height="14">
            <rect
              x="2"
              y="1"
              width="4"
              height="14"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="10"
              y="1"
              width="4"
              height="14"
              rx="1"
              fill="currentColor"
            />
          </svg>
        </button>

        <div class="transport-divider" />

        <!-- Zoom -->
        <button class="t-btn" title="Zoom out" @click="zoomOut">
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="7" cy="7" r="5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
            <line x1="4" y1="7" x2="10" y2="7" />
          </svg>
        </button>

        <div class="zoom-track">
          <input
            type="range"
            min="40"
            max="400"
            step="5"
            :value="zoom"
            @input="zoom = Number(($event.target as HTMLInputElement).value)"
            title="Zoom"
          />
        </div>

        <button class="t-btn" title="Zoom in" @click="zoomIn">
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="7" cy="7" r="5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
            <line x1="7" y1="4" x2="7" y2="10" />
            <line x1="4" y1="7" x2="10" y2="7" />
          </svg>
        </button>
      </div>

      <div class="transport-right">
        <span class="time-display">
          {{ currentTime.toFixed(2) }}s
          <span class="time-sep">/</span>
          {{ formatDuration(duration) }}
        </span>
      </div>
    </div>

    <!-- Main timeline area -->
    <div class="timeline-body">
      <!-- Label column (fixed) -->
      <div class="labels-col" :style="{ width: LABEL_WIDTH + 'px' }">
        <!-- ruler gutter -->
        <div class="label-ruler-gutter" />
        <!-- track labels -->
        <div v-for="track in tracks" :key="track.id" class="track-label">
          <span class="label-dot" :style="{ background: track.color }" />
          <span class="label-name">{{ track.name }}</span>
        </div>
      </div>

      <!-- Scrollable tracks + ruler -->
      <div
        ref="scrollEl"
        class="timeline-tracks-scroll"
        @click="onScrollAreaClick"
      >
        <!-- Inner: ruler + tracks stacked -->
        <div class="tracks-inner" :style="{ width: totalWidth + 'px' }">
          <!-- Ruler row -->
          <div class="ruler-row">
            <TimelineRuler />
          </div>

          <!-- Track rows -->
          <div class="tracks-rows">
            <div v-for="track in tracks" :key="track.id" class="track-row">
              <TimelineTrack :track="track" />
            </div>
          </div>

          <!-- Pointer (spans ruler + tracks) -->
          <TimelinePointer />
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
    </div>

    <p class="hint">
      Double-click a track to add a keyframe · Right-click a keyframe to delete
      · Ctrl+Scroll to zoom
    </p>
  </div>
</template>

<style scoped>
/* Root */
.timeline {
  display: flex;
  flex-direction: column;
  background: #12121e;
  border-radius: 8px;
  border: 1px solid #2a2a3e;
  overflow: hidden;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  color: #c4c4d4;
  user-select: none;
}

/* Transport */
.transport {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #0e0e1a;
  border-bottom: 1px solid #2a2a3e;
  gap: 8px;
}

.transport-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.transport-right {
  display: flex;
  align-items: center;
}

.transport-divider {
  width: 1px;
  height: 20px;
  background: #2a2a3e;
  margin: 0 4px;
}

.t-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  color: #9090b0;
  cursor: pointer;
  transition:
    background 0.12s,
    color 0.12s,
    border-color 0.12s;
}

.t-btn:hover {
  background: #1e1e30;
  color: #e0e0f0;
  border-color: #3a3a5a;
}

.t-btn--play.active {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border-color: #4f46e5;
}

.zoom-track {
  display: flex;
  align-items: center;
}

.zoom-track input[type="range"] {
  width: 80px;
  accent-color: #6366f1;
  cursor: pointer;
}

.time-display {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 13px;
  color: #9090b0;
  letter-spacing: 0.03em;
}

.time-sep {
  color: #4a4a6a;
  margin: 0 3px;
}

/* Body */
.timeline-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Labels column */
.labels-col {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid #2a2a3e;
  background: #0e0e1a;
  z-index: 20;
}

.label-ruler-gutter {
  height: 32px;
  border-bottom: 1px solid #2a2a3e;
  background: #0a0a14;
}

.track-label {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid #1e1e2e;
  font-size: 13px;
  font-weight: 500;
}

.label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.label-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #b0b0c8;
}

/* Scrollable track area */
.timeline-tracks-scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  cursor: crosshair;
  scrollbar-width: thin;
  scrollbar-color: #2a2a3e transparent;
}

.timeline-tracks-scroll::-webkit-scrollbar {
  height: 6px;
}
.timeline-tracks-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.timeline-tracks-scroll::-webkit-scrollbar-thumb {
  background: #2a2a3e;
  border-radius: 3px;
}

.tracks-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Ruler row */
.ruler-row {
  position: sticky;
  top: 0;
  z-index: 15;
  background: #0a0a14;
  border-bottom: 1px solid #2a2a3e;
  flex-shrink: 0;
}

/* Track rows */
.tracks-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.track-row {
  border-bottom: 1px solid #1e1e2e;
  height: 40px;
  position: relative;
}

/* Progress bar */
.progress-bar {
  height: 3px;
  background: #1e1e2e;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #818cf8);
  transition: width 0.05s linear;
}

/* Hint */
.hint {
  text-align: center;
  font-size: 10px;
  color: #3a3a5a;
  padding: 5px;
  margin: 0;
  border-top: 1px solid #1e1e2e;
  letter-spacing: 0.03em;
}
</style>
