import { useTracksStore } from "../store/animation";
import { computed, onUnmounted } from "vue";
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
  const { keyframeObjects } = storeToRefs(tracksStore);
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

    return keyframeObjects.value[selectedObjectId.value];
  });

  // Derived
  const totalWidth = computed(() => duration.value * zoom.value);

  const timeToX = (time: number): number => time * zoom.value;
  const xToTime = (x: number): number =>
    Math.max(0, Math.min(duration.value, x / zoom.value));

  const getSelectedObjectTrack = (type: string, objectId?: number) => {
    const id = objectId || selectedObjectId?.value;
    if (!id) {
      return null;
    }

    const track = keyframeObjects.value[id]?.find(
      (track) => track.name.toLowerCase() === type.toLowerCase(),
    );

    if (!track) {
      return null;
    }

    return track;
  };

  // Add a new keyframe on a specified time
  const addKeyframe = (
    time: number,
    type: string,
    value: string | number = "",
    objectId?: number,
  ) => {
    const objId = objectId ?? selectedObjectId.value;
    const track = getSelectedObjectTrack(type, objectId);

    if (!track || !objId) {
      return;
    }

    const lastKeyframeId = Math.max(...track.keyframes.map((kf) => kf.id));
    const id = lastKeyframeId ? lastKeyframeId + 1 : 1;
    const existingKeyframeIndex = track.keyframes.findIndex(
      (kf) => kf.id === id,
    );

    if (existingKeyframeIndex !== -1) {
      return;
    }

    track.keyframes.push({ id, time: parseFloat(time.toFixed(3)), value });
    track.keyframes.sort((a, b) => a.time - b.time);
  };

  // Remove a keyframe of a selected object based on keyframeId and type (color, opacity, etc.)
  const removeKeyframe = (keyframeId: number, type: string) => {
    const track = getSelectedObjectTrack(type);

    if (!track || !selectedObjectId.value) {
      return;
    }

    track.keyframes = track.keyframes.filter((k) => k.id !== keyframeId);
  };

  // Move a keyframe of a selected object to a new time
  const moveKeyframe = (keyframeId: number, newTime: number, type: string) => {
    const track = getSelectedObjectTrack(type);

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

  // Update a keyframe value of a selected object based on keyframe id and type
  const updateKeyframeValue = (
    keyframeId: number,
    type: string,
    value: string | number,
    objectId?: number,
  ) => {
    const objId = objectId ?? selectedObjectId.value;
    const track = getSelectedObjectTrack(type, objectId);

    if (!track || !objId) {
      return;
    }

    const kf = track.keyframes.find((k) => k.id === keyframeId);
    if (!kf) {
      return;
    }

    kf.value = value;
  };

  // Create or Update a current selected object keyframe based on value and type
  const setKeyframe = (
    value: string | number,
    type: string,
    objectId: number,
    time: number,
  ) => {
    const track = keyframeObjects.value[objectId]?.find(
      (track) => track.name.toLowerCase() === type.toLowerCase(),
    );

    if (!track) {
      return null;
    }

    const timestamp = parseFloat((time ?? currentTime.value ?? 0).toFixed(3));
    const currentTimeKeyframe = track.keyframes.find(
      (keyframe) => keyframe.time === timestamp,
    );

    if (currentTimeKeyframe) {
      updateKeyframeValue(currentTimeKeyframe.id, type, value, objectId);
      return;
    }

    addKeyframe(currentTime.value, type, value, objectId);
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
    keyframeObjects,
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
    updateKeyframeValue,
    setKeyframe,
    selectedObjectTracks,
  };
}
