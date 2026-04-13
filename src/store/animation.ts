import { defineStore } from "pinia";
import { ref } from "vue";
import { TimelineTrack } from "../types/timeline";
import { ShapeObject } from "./objects";
import { SHAPE_TYPES } from "../types/ShapeTypes";
import { BrowserDatabase } from "../composables/useBrowserDatabase";
import { OBJECT_KEYFRAMES } from "../browserDatabase/objects";

export const useTracksStore = defineStore("tracks", () => {
  // Hashmap of object id => object keyframe data
  const keyframeObjects = ref<Record<number, TimelineTrack[]>>({});

  const setTracks = (type: string, keyframe: number) => {};

  /**
   *
   * @param name - Frontend name displayed in animation tracks playback
   * @param keyframes - Actual keyframes, containing timestamps and updated values
   * @param defaultValue - Initial value after creating an object
   * @param propName - Property to animate!! so for color the value will be 'fill', for opacity 'opacity', etc.
   * @returns
   */
  const getTrack = (
    name: string,
    keyframes: [] = [],
    propName: string,
    defaultValue?: string | number,
  ) => {
    // Initialize first keyframe with the default value
    if (!keyframes?.length) {
      return {
        name,
        propName,
        keyframes: [{ id: 1, time: 0, value: defaultValue }],
      };
    }

    return {
      name,
      keyframes,
      propName,
    };
  };

  const syncLocalDb = async () => {
    const data: any = [];
    for (const [objectId, tracks] of Object.entries(keyframeObjects.value)) {
      data.push({
        id: objectId,
        tracks: JSON.parse(JSON.stringify(tracks)),
      });
    }

    BrowserDatabase.deleteAndInsert(OBJECT_KEYFRAMES, data);
  };

  const initTracksForObject = (object: ShapeObject) => {
    const defaultTracks = [
      getTrack("Color", [], "color", object.color),
      getTrack("Opacity", [], "opacity", object.opacity),
    ];

    if (object.type === SHAPE_TYPES.circle) {
      defaultTracks.push(
        getTrack("Radius", [], "radius", (object as any).radius),
      );
      defaultTracks.push(getTrack("cx", [], "cx", (object as any).cx));
      defaultTracks.push(getTrack("cy", [], "cy", (object as any).cy));
    }

    if (object.type === SHAPE_TYPES.rectangle) {
      defaultTracks.push(getTrack("Width", [], "width", (object as any).width));
      defaultTracks.push(
        getTrack("Height", [], "height", (object as any).height),
      );
      defaultTracks.push(getTrack("X", [], "x", (object as any).x));
      defaultTracks.push(getTrack("Y", [], "y", (object as any).y));
    }

    if (object.type === SHAPE_TYPES.triangle) {
      defaultTracks.push(getTrack("X", [], "x", (object as any).x));
      defaultTracks.push(getTrack("Y", [], "y", (object as any).y));
    }

    keyframeObjects.value[object.id] = defaultTracks;
    syncLocalDb();
  };

  return {
    keyframeObjects,
    setTracks,
    initTracksForObject,
    syncLocalDb,
  };
});
