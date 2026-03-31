import { defineStore } from "pinia";
import { ref } from "vue";
import { TimelineTrack } from "../types/timeline";
import { ShapeObject } from "./objects";
import { SHAPE_TYPES } from "../types/ShapeTypes";

export const useTracksStore = defineStore("tracks", () => {
  // Hashmap of object id => object keyframe data
  const tracks = ref<Record<number, TimelineTrack[]>>({});

  const setTracks = (type: string, keyframe: number) => {};

  const getTrack = (
    name: string,
    keyframes: [] = [],
    defaultValue?: string | number,
  ) => {
    // Initialize first keyframe with the default value
    if (!keyframes?.length) {
      return {
        name,
        keyframes: [{ id: 1, time: 0, value: defaultValue }],
      };
    }
    return {
      name,
      keyframes,
    };
  };

  const initTracksForObject = (object: ShapeObject) => {
    const defaultTracks = [
      getTrack("Color", [], object.color),
      getTrack("Opacity", [], object.opacity),
    ];

    if (object.type === SHAPE_TYPES.circle) {
      defaultTracks.push(getTrack("Radius", [], (object as any).getRadius?.()));
    }

    if (object.type === SHAPE_TYPES.rectangle) {
      defaultTracks.push(getTrack("Width", [], (object as any).getWidth?.()));
      defaultTracks.push(getTrack("Height", [], (object as any).getHeight?.()));
      defaultTracks.push(getTrack("X", [], (object as any).getX?.()));
      defaultTracks.push(getTrack("Y", [], (object as any).getY?.()));
    }

    if (object.type === SHAPE_TYPES.triangle) {
      defaultTracks.push(getTrack("X", [], (object as any).getX?.()));
      defaultTracks.push(getTrack("Y", [], (object as any).getY?.()));
    }

    tracks.value[object.id] = defaultTracks;
  };

  return {
    tracks,
    setTracks,
    initTracksForObject,
  };
});
