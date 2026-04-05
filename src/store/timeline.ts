import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useTracksStore } from "./animation";
import { TimelineTrack } from "../types/timeline";

const MIN_ZOOM = 40; // px/sec
const MAX_ZOOM = 400; // px/sec

export const useTimelineStore = defineStore("timeline", () => {
  const currentTime = ref(0);
  const duration = ref(30);
  const zoom = ref(80); // pixels per second
  const isPlaying = ref(false);
  const { keyframeObjects } = storeToRefs(useTracksStore());

  const lastKeyframeTime = computed(() => {
    let lastKf = 0;

    Object.values(keyframeObjects.value).forEach((object) =>
      object.forEach((track: TimelineTrack) =>
        track.keyframes.forEach((keyframe) => {
          if (keyframe.time > lastKf) {
            lastKf = keyframe.time;
          }
        }),
      ),
    );

    return lastKf;
  });

  // Playback
  let rafId: number | null = null;
  let lastTimestamp: number | null = null;

  const tick = (timestamp: number) => {
    if (lastTimestamp !== null) {
      const delta = (timestamp - lastTimestamp) / 1000;
      currentTime.value = Math.min(currentTime.value + delta, duration.value);

      if (
        currentTime.value >= duration.value ||
        currentTime.value >= lastKeyframeTime.value
      ) {
        isPlaying.value = false;
        lastTimestamp = null;
        return;
      }
    }
    lastTimestamp = timestamp;
    rafId = requestAnimationFrame(tick);
  };

  const play = () => {
    if (isPlaying.value) {
      return;
    }

    if (currentTime.value >= duration.value) {
      currentTime.value = 0;
    }

    isPlaying.value = true;
    lastTimestamp = null;
    rafId = requestAnimationFrame(tick);
  };

  const pause = () => {
    isPlaying.value = false;
    lastTimestamp = null;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const stop = () => {
    pause();
    currentTime.value = 0;
  };

  const togglePlay = () => (isPlaying.value ? pause() : play());

  // Zoom
  const zoomIn = () => {
    zoom.value = Math.min(MAX_ZOOM, zoom.value * 1.25);
  };

  const zoomOut = () => {
    zoom.value = Math.max(MIN_ZOOM, zoom.value / 1.25);
  };

  const handleWheelZoom = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    e.deltaY < 0 ? zoomIn() : zoomOut();
  };

  const cleanup = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
  };

  return {
    // state
    currentTime,
    duration,
    zoom,
    isPlaying,
    // playback
    play,
    pause,
    stop,
    togglePlay,
    // zoom
    zoomIn,
    zoomOut,
    handleWheelZoom,
    // cleanup
    cleanup,
  };
});
