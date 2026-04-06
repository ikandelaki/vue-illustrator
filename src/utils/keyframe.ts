import { TimelineTrack } from "../types/timeline";

export const getClosestNextKeyframe = (track: TimelineTrack, time: number) => {
  const candidateNextKeyframes = track.keyframes.filter((kf) => kf.time > time);
  const candidateNextKeyframeTimes = candidateNextKeyframes.map(
    (kf) => kf.time,
  );
  const nextKeyframeTime = Math.min(...candidateNextKeyframeTimes);
  return track.keyframes.find((kf) => kf.time === nextKeyframeTime);
};

export const getClosestPrevKeyframe = (track: TimelineTrack, time: number) => {
  const candidatePrevKeyframes = track.keyframes.filter((kf) => kf.time < time);
  const candidatePrevKeyframeTimes = candidatePrevKeyframes.map(
    (kf) => kf.time,
  );
  const prevKeyframeTime = Math.max(...candidatePrevKeyframeTimes);
  return track.keyframes.find((kf) => kf.time === prevKeyframeTime);
};
