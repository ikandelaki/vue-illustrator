import { useTracksStore } from "../store/animation";
import { computed, onUnmounted } from "vue";
import type { TimelineTrack } from "../types/timeline";
import { useObjectsStore } from "../store/objects";
import { useTimelineStore } from "../store/timeline";
import { storeToRefs } from "pinia";

// Export
export function useTimeline() {
  // Get stores
  const objectsStore = useObjectsStore();
  const tracksStore = useTracksStore();
  const timelineStore = useTimelineStore();

  // State from stores (now shared across all instances)
  const { selectedObjectId } = storeToRefs(objectsStore);
  const { tracks } = storeToRefs(tracksStore);
  const { currentTime, duration, zoom, isPlaying } = storeToRefs(timelineStore);
  const {
    play,
    pause,
    stop,
    togglePlay,
    zoomIn,
    zoomOut,
    handleWheelZoom,
    cleanup,
  } = timelineStore;

  const selectedObjectTracks = computed(() => {
    if (!selectedObjectId.value) {
      return null;
    }

    return tracks.value[selectedObjectId.value];
  });

  // Derived
  const totalWidth = computed(() => duration.value * zoom.value);

  const timeToX = (time: number): number => time * zoom.value;
  const xToTime = (x: number): number =>
    Math.max(0, Math.min(duration.value, x / zoom.value));

  // Keyframe manipulation
  const addKeyframe = (time: number, type: string) => {
    if (!selectedObjectId.value) {
      return;
    }

    const track = tracks.value[selectedObjectId.value]?.find(
      (track) => track.name === type,
    );
    if (!track) return;

    const id = Date.now();
    track.keyframes.push({ id, time: parseFloat(time.toFixed(3)) });
    track.keyframes.sort((a, b) => a.time - b.time);
  };

  const removeKeyframe = (keyframeId: number, type: string) => {
    if (!selectedObjectId.value) {
      return;
    }

    const track = tracks.value[selectedObjectId.value]?.find(
      (track) => track.name === type,
    );
    if (!track) {
      return;
    }

    track.keyframes = track.keyframes.filter((k) => k.id !== keyframeId);
  };

  const moveKeyframe = (keyframeId: number, newTime: number, type: string) => {
    if (!selectedObjectId.value) {
      return;
    }

    const track = tracks.value[selectedObjectId.value]?.find(
      (track) => track.name === type,
    );
    if (!track) {
      return;
    }

    const kf = track.keyframes.find((k) => k.id === keyframeId);
    if (!kf) {
      return;
    }

    kf.time = Math.max(
      0,
      Math.min(duration.value, parseFloat(newTime.toFixed(3))),
    );
    track.keyframes.sort((a, b) => a.time - b.time);
  };

  // Cleanup
  onUnmounted(() => {
    cleanup();
  });

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
    selectedObjectTracks,
  };
}
