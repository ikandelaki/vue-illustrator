import { ref, computed, onUnmounted } from "vue";
import type { TimelineTrack } from "../types/timeline";

const MIN_ZOOM = 40; // px/sec
const MAX_ZOOM = 400; // px/sec

// Shared singleton state
const currentTime = ref(0);
const duration = ref(30);
const zoom = ref(80); // pixels per second
const isPlaying = ref(false);

const tracks = ref<TimelineTrack[]>([
  {
    id: 1,
    name: "Circle",
    color: "#f0b429",
    keyframes: [
      { id: 1, time: 0 },
      { id: 2, time: 2.5 },
      { id: 3, time: 6 },
    ],
  },
  {
    id: 2,
    name: "Rectangle",
    color: "#38bdf8",
    keyframes: [
      { id: 4, time: 1 },
      { id: 5, time: 4 },
      { id: 6, time: 9 },
    ],
  },
  {
    id: 3,
    name: "Triangle",
    color: "#a78bfa",
    keyframes: [
      { id: 7, time: 0.5 },
      { id: 8, time: 3 },
    ],
  },
]);

// Derived
const totalWidth = computed(() => duration.value * zoom.value);

const timeToX = (time: number): number => time * zoom.value;
const xToTime = (x: number): number =>
  Math.max(0, Math.min(duration.value, x / zoom.value));

// Playback
let rafId: number | null = null;
let lastTimestamp: number | null = null;

const tick = (timestamp: number) => {
  if (lastTimestamp !== null) {
    const delta = (timestamp - lastTimestamp) / 1000;
    currentTime.value = Math.min(currentTime.value + delta, duration.value);
    if (currentTime.value >= duration.value) {
      isPlaying.value = false;
      lastTimestamp = null;
      return;
    }
  }
  lastTimestamp = timestamp;
  rafId = requestAnimationFrame(tick);
};

const play = () => {
  if (isPlaying.value) return;
  if (currentTime.value >= duration.value) currentTime.value = 0;
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

// Keyframe manipulation
const addKeyframe = (trackId: number, time: number) => {
  const track = tracks.value.find((t) => t.id === trackId);
  if (!track) return;
  const id = Date.now();
  track.keyframes.push({ id, time: parseFloat(time.toFixed(3)) });
  track.keyframes.sort((a, b) => a.time - b.time);
};

const removeKeyframe = (trackId: number, keyframeId: number) => {
  const track = tracks.value.find((t) => t.id === trackId);
  if (!track) return;
  track.keyframes = track.keyframes.filter((k) => k.id !== keyframeId);
};

const moveKeyframe = (trackId: number, keyframeId: number, newTime: number) => {
  const track = tracks.value.find((t) => t.id === trackId);
  if (!track) return;
  const kf = track.keyframes.find((k) => k.id === keyframeId);
  if (!kf) return;
  kf.time = Math.max(
    0,
    Math.min(duration.value, parseFloat(newTime.toFixed(3))),
  );
  track.keyframes.sort((a, b) => a.time - b.time);
};

// Cleanup
onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
});

// Export
export function useTimeline() {
  return {
    // state
    currentTime,
    duration,
    zoom,
    isPlaying,
    tracks,
    totalWidth,
    // converters
    timeToX,
    xToTime,
    // playback
    play,
    pause,
    stop,
    togglePlay,
    // zoom
    zoomIn,
    zoomOut,
    handleWheelZoom,
    // keyframes
    addKeyframe,
    removeKeyframe,
    moveKeyframe,
  };
}
