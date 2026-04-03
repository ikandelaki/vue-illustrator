import { useObjectsStore } from "./../store/objects";
import { useTracksStore } from "./../store/animation";
import { storeToRefs } from "pinia";
import { useTimelineStore } from "../store/timeline";
import gsap from "gsap";
import { watch } from "vue";

export const useAnimation = () => {
  const timelineStore = useTimelineStore();
  const tracksStore = useTracksStore();
  const { isPlaying, currentTime } = storeToRefs(timelineStore);
  const { tracks: objectKeyframes } = storeToRefs(tracksStore);
  const objectsStore = useObjectsStore();
  const { objects } = storeToRefs(objectsStore);

  watch(isPlaying, () => {
    if (!isPlaying || !objectKeyframes.value) {
      return;
    }

    Object.keys(objectKeyframes.value).map((objectId: string) => {
      const id = Number(objectId);
      const tracks = objectKeyframes.value[id];

      const currentObject = objects.value[id];
      tracks.map((track) => {
        track.keyframes.map((keyframe) => {
          gsap.to(currentObject, {
            [track.propName]: keyframe?.value,
            duration: keyframe.time,
          });
        });
      });
    });
  });

  const animateObjectAtCurrentTime = () => {};

  // Immediately calculate and set object styles at a currentTime value.
  // This is used whenever the user manually changes current time - like draggin the time pointer, or clicking on a timeline
  watch(currentTime, () => {
    if (isPlaying) {
      return;
    }

    Object.keys(objectKeyframes.value).map((objectId: string) => {
      const id = Number(objectId);
      const tracks = objectKeyframes.value[id];

      const currentObject = objects.value[id];
      tracks.map((track) => {
        track.keyframes.map((keyframe) => {
          gsap.set(currentObject, {
            [track.propName]: keyframe?.value,
          });
        });
      });
    });
  });
};
