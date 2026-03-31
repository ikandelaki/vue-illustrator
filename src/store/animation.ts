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
      defaultTracks.push(getTrack("Radius", [], object.radius));
    }

    tracks.value[object.id] = defaultTracks;
  };

  return {
    tracks,
    setTracks,
    initTracksForObject,
  };
});
