export interface Keyframe {
  id: number;
  time: number; // in seconds
  value?: string | number; // value for this keyframe (color, opacity, radius, etc.)
}

export interface TimelineTrack {
  name: string;
  propName: string;
  keyframes: Keyframe[];
}

export interface TimelineState {
  currentTime: number; // seconds
  duration: number; // seconds
  zoom: number; // pixels per second
  isPlaying: boolean;
}
