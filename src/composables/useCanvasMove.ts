import { onMounted, onUnmounted, ref } from "vue";
import { useCanvasStore } from "../store/canvas";
import { useSelectedShapeStore } from "../store/selectedShape";
import { SHAPE_TYPES } from "../types/ShapeTypes";

export const useCanvasMove = () => {
  const canvasStore = useCanvasStore();
  const { setSelectedShape } = useSelectedShapeStore();
  const { setOffset } = canvasStore;

  const isSpacePressed = ref<boolean>(false);
  const isDragging = ref<boolean>(false);
  const startMousePos = { x: 0, y: 0 };
  const startOffset = { x: 0, y: 0 };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      isSpacePressed.value = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      isSpacePressed.value = false;
    }
  };

  const onDrag = (event: MouseEvent) => {
    if (!isDragging.value) {
      return;
    }

    const deltaX = event.clientX - startMousePos.x;
    const deltaY = event.clientY - startMousePos.y;

    setOffset(startOffset.x + deltaX, startOffset.y + deltaY);
  };

  const stopDrag = () => {
    isDragging.value = false;
  };

  const startDrag = (event: MouseEvent) => {
    if (!isSpacePressed.value) {
      return;
    }

    setSelectedShape(SHAPE_TYPES.cursor);

    isDragging.value = true;
    startMousePos.x = event.clientX;
    startMousePos.y = event.clientY;
    startOffset.x = canvasStore.offset.x;
    startOffset.y = canvasStore.offset.y;
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  });

  return { isSpacePressed, startDrag };
};
