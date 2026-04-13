import { useObjectsStore } from "./../store/objects";
import { useTracksStore } from "./../store/animation";
import { storeToRefs } from "pinia";
import { useTimelineStore } from "../store/timeline";
import gsap from "gsap";
import { Ref, watch } from "vue";
import { Keyframe } from "../types/timeline";
import {
  getClosestNextKeyframe,
  getClosestPrevKeyframe,
} from "../utils/keyframe";

export const useAnimation = () => {
  const timelineStore = useTimelineStore();
  const tracksStore = useTracksStore();
  const { isPlaying, currentTime } = storeToRefs(timelineStore);
  const { keyframeObjects } = storeToRefs(tracksStore);
  const objectsStore = useObjectsStore();
  const { objects } = storeToRefs(objectsStore);

  // Transform the color hex values into numbers for calculation
  const parseColor = (hex: string) => {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  };

  // Transform rgb object into hex
  const toHex = (n: number) => {
    return Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  };

  // Calculate what the current color value should be at the current time
  const interpolateColor = (
    from: string,
    to: string,
    ratio: number,
  ): string => {
    const a = parseColor(from);
    const b = parseColor(to);

    const r = a.r + (b.r - a.r) * ratio;
    const g = a.g + (b.g - a.g) * ratio;
    const b_ = a.b + (b.b - a.b) * ratio;

    return `#${toHex(r)}${toHex(g)}${toHex(b_)}`;
  };

  const calculateKeyframeValueAtCurrentTime = (
    keyframe: Keyframe,
    prevKeyframe: Keyframe,
    currentTime: Ref<number>,
  ) => {
    const ratio = Math.max(
      0.01,
      (currentTime.value - prevKeyframe.time) /
        (keyframe.time - prevKeyframe.time),
    );

    if (typeof keyframe.value === "number") {
      // Percentage of how far current time pointer is compared to prev key frame time and next keyframe time
      // TODO: something goes wrong here when prev values is much bigger than keyframe value.
      const delta = Number(keyframe.value) - Number(prevKeyframe.value);

      return Number(prevKeyframe.value) + delta * ratio;
    }

    if (typeof keyframe.value === "string" && keyframe.value.startsWith("#")) {
      return interpolateColor(
        prevKeyframe.value as string,
        keyframe.value,
        ratio,
      );
    }
  };

  // Immediately calculate and set object styles at a currentTime value.
  // This is used whenever the user manually changes current time - like draggin the time pointer, or clicking on a timeline
  watch(currentTime, () => {
    Object.keys(keyframeObjects.value).map((objectId: string) => {
      const id = Number(objectId);
      const tracks = keyframeObjects.value[id];

      const currentObject = objects.value[id];

      if (!currentObject) {
        return;
      }

      tracks.map((track) => {
        if (!track.keyframes?.length) {
          return;
        }

        const nextKeyframe = getClosestNextKeyframe(track, currentTime.value);
        if (!nextKeyframe?.value) {
          return;
        }

        const prevKeyframe = getClosestPrevKeyframe(track, currentTime.value);
        if (!prevKeyframe?.value) {
          return;
        }

        const lastKeyframeTime = track.keyframes.at(-1)?.time;

        // Exit if current time is already past the last keyframe, so no more animation
        if (!lastKeyframeTime || currentTime.value > lastKeyframeTime) {
          return;
        }

        const keyframeExists = track.keyframes.find(
          (kf) => kf.time === currentTime.value,
        );
        if (keyframeExists) {
          gsap.set(currentObject, {
            [track.propName]: keyframeExists.value,
          });

          return;
        }

        gsap.set(currentObject, {
          [track.propName]: calculateKeyframeValueAtCurrentTime(
            nextKeyframe,
            prevKeyframe,
            currentTime,
          ),
        });
      });
    });
  });
};
