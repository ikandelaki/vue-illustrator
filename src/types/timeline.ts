export interface Keyframe {
  id: number;
  time: number; // in seconds
  color?: string;
}

export interface TimelineTrack {
  name: string;
  keyframes: Keyframe[];
}

export interface TimelineState {
  currentTime: number; // seconds
  duration: number; // seconds
  zoom: number; // pixels per second
  isPlaying: boolean;
}
