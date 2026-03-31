<script setup lang="ts">
import { computed, ref } from "vue";
import { useTimeline } from "../composables/useTimeline";

const { currentTime, zoom, xToTime } = useTimeline();

const isDragging = ref(false);

const x = computed(() => currentTime.value * zoom.value);

const formatTime = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(2);
  return m > 0 ? `${m}:${String(s).padStart(5, "0")}` : `${s}s`;
};

const onMousedown = (e: MouseEvent) => {
  e.stopPropagation();
  isDragging.value = true;

  // We need the scroll container's left offset for accurate mapping
  const scrollEl = (e.currentTarget as HTMLElement).closest(
    ".timeline-tracks-scroll",
  ) as HTMLElement | null;

  const onMousemove = (e: MouseEvent) => {
    if (!isDragging.value || !scrollEl) return;
    const rect = scrollEl.getBoundingClientRect();
    const rawX = e.clientX - rect.left + scrollEl.scrollLeft;
    currentTime.value = xToTime(rawX);
  };

  const onMouseup = () => {
    isDragging.value = false;
    window.removeEventListener("mousemove", onMousemove);
    window.removeEventListener("mouseup", onMouseup);
  };

  window.addEventListener("mousemove", onMousemove);
  window.addEventListener("mouseup", onMouseup);
};
</script>

<template>
  <div
    class="pointer"
    :class="{ dragging: isDragging }"
    :style="{ transform: `translateX(${x}px)` }"
    @mousedown="onMousedown"
  >
    <!-- head (the draggable handle at the top) -->
    <div class="pointer-head">
      <span class="pointer-time">{{ formatTime(currentTime) }}</span>
      <svg width="12" height="8" viewBox="0 0 12 8" class="pointer-arrow">
        <polygon points="0,0 12,0 6,8" fill="currentColor" />
      </svg>
    </div>

    <!-- the needle line itself -->
    <div class="pointer-line" />
  </div>
</template>

<style scoped>
.pointer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 30;
  pointer-events: none;
  will-change: transform;
}

.pointer-head {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
  color: #e2e2ff;
  pointer-events: all;
  cursor: ew-resize;
  user-select: none;
  z-index: 1;
}

.pointer-time {
  background: #3730a3;
  color: #e0e7ff;
  font-size: 9px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  padding: 2px 5px;
  border-radius: 3px 3px 0 0;
  white-space: nowrap;
  line-height: 1.4;
}

.pointer-arrow {
  display: block;
  color: #3730a3;
  margin-top: -1px;
}

.pointer-line {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: #6366f1;
  pointer-events: all;
  cursor: ew-resize;
  box-shadow: 0 0 6px rgba(99, 102, 241, 0.6);
}

.pointer.dragging .pointer-line {
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.9);
}

.pointer.dragging .pointer-time {
  background: #4f46e5;
}
</style>
