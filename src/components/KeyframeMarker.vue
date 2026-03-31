<script setup lang="ts">
import { ref } from "vue";
import { useTimeline } from "../composables/useTimeline";
import type { Keyframe } from "../types/timeline";
import KeyframeIcon from "./KeyframeIcon.vue";

const props = defineProps<{
  keyframe: Keyframe;
  trackColor?: string;
  type: string;
}>();

const emit = defineEmits<{
  dragstart: [keyframeId: number];
  dragend: [keyframeId: number];
}>();

const { moveKeyframe, zoom, removeKeyframe, updateKeyframeValue } =
  useTimeline();

const isDragging = ref(false);
const isHovered = ref(false);
const dragStartX = ref(0);
const dragStartTime = ref(0);
const isEditing = ref(false);
const editValue = ref(String(props.keyframe.value ?? ""));

const onMousedown = (e: MouseEvent) => {
  if (e.button === 2) return; // right-click handled separately
  e.stopPropagation();
  isDragging.value = true;
  dragStartX.value = e.clientX;
  dragStartTime.value = props.keyframe.time;
  emit("dragstart", props.keyframe.id);

  const onMousemove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    const dx = e.clientX - dragStartX.value;
    const dtSecs = dx / zoom.value;
    const newTime = dragStartTime.value + dtSecs;
    moveKeyframe(props.keyframe.id, newTime, props.type);
  };

  const onMouseup = () => {
    isDragging.value = false;
    emit("dragend", props.keyframe.id);
    window.removeEventListener("mousemove", onMousemove);
    window.removeEventListener("mouseup", onMouseup);
  };

  window.addEventListener("mousemove", onMousemove);
  window.addEventListener("mouseup", onMouseup);
};

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  removeKeyframe(props.keyframe.id, props.type);
};

const onDoubleClick = () => {
  isEditing.value = true;
  editValue.value = String(props.keyframe.value ?? "");
};

const saveValue = () => {
  const parsedValue = isNaN(Number(editValue.value))
    ? editValue.value
    : Number(editValue.value);
  updateKeyframeValue(props.keyframe.id, props.type, parsedValue);
  isEditing.value = false;
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    saveValue();
  } else if (e.key === "Escape") {
    isEditing.value = false;
  }
};
</script>

<template>
  <div
    class="keyframe-marker"
    :class="{ dragging: isDragging, hovered: isHovered }"
    :style="{ '--track-color': trackColor }"
    @mousedown="onMousedown"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @contextmenu="onContextMenu"
    @dblclick="onDoubleClick"
    :title="`${keyframe.time.toFixed(2)}s — right-click to delete, double-click to edit`"
  >
    <KeyframeIcon />
  </div>
</template>

<style>
.keyframe-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 10;
  line-height: 0;
  transition: filter 0.12s ease;
}

.keyframe-marker.dragging {
  cursor: grabbing;
  filter: drop-shadow(0 0 5px var(--track-color));
  z-index: 20;
}

.edit-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1e1e2e;
  border: 2px solid #3730a3;
  border-radius: 6px;
  padding: 8px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.edit-input {
  background: #2a2a3e;
  border: 1px solid #3730a3;
  color: #e2e2ff;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 100px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
}

.edit-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
}
</style>
