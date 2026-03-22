import { computed, ref, ShallowRef } from "vue";
import { useDragElement } from "./mouse";
import { useBbox } from "./useBbox";
import { findAngleBetweenPoints, isPointInsideBbox } from "../utils/math";
import { useScreenToWorld } from "./useScreenToWorld";
import { useObjectsStore } from "../store/objects";
import { storeToRefs } from "pinia";

const ROTATION_ZONE = 200;

export const useShapeRotate = (
  elementRef: Readonly<
    ShallowRef<SVGRectElement | null, SVGRectElement | null>
  >,
) => {
  const objectsStore = useObjectsStore();
  const { selectedObject } = storeToRefs(objectsStore);
  const isRotationCursor = ref<boolean>(false);
  const mousePos = ref<{ x: number; y: number }>({ x: 0, y: 0 });

  const { bbox: shapeResizerBbox } = useBbox(10);
  const { bbox } = useBbox(ROTATION_ZONE);

  let lastAngle = 0;

  // Calculate if the point is inside the rotation zone:
  // Zone is a place around the element, not inside it
  // isPointInsideBbox calculates if current mouse position is inside the shape object,
  // -- If it is true, then we are NOT inside the rotation zone, if it is false - then we are
  const isInRotationZone = (x: number, y: number) => {
    return !isPointInsideBbox(x, y, shapeResizerBbox.value);
  };

  const handlePointerMove = (moveEvent: MouseEvent) => {
    const { x, y } = useScreenToWorld(moveEvent.clientX, moveEvent.clientY);

    mousePos.value = { x, y };

    isInRotationZone(x, y)
      ? (isRotationCursor.value = true)
      : (isRotationCursor.value = false);
  };

  /**
   * If the mouse enters inside the rotation zone we need to change the cursor into a rotation cursor
   *
   * @param event
   */
  const handleMouseEnter = (event: MouseEvent) => {
    if (
      isPointInsideBbox(event.clientX, event.clientY, shapeResizerBbox.value)
    ) {
      isRotationCursor.value = true;
      mousePos.value = {
        x: event.clientX,
        y: event.clientY,
      };
    }

    elementRef.value?.addEventListener("pointermove", handlePointerMove);
  };

  /**
   * No longer in the rotation zone, reset the cursor
   *
   * @param event
   */
  const handleMouseLeave = (event: MouseEvent) => {
    isRotationCursor.value = false;

    elementRef.value?.removeEventListener("pointermove", handlePointerMove);
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (!isRotationCursor.value) {
      return;
    }

    // ✅ seed lastAngle from the mousedown position, not stale module-level value
    const cx = shapeResizerBbox.value.x + shapeResizerBbox.value.width / 2;
    const cy = shapeResizerBbox.value.y + shapeResizerBbox.value.height / 2;
    const { x: startX, y: startY } = useScreenToWorld(
      event.clientX,
      event.clientY,
    );
    lastAngle = findAngleBetweenPoints(cx, cy, startX, startY);

    const rotate = (moveEvent: MouseEvent) => {
      const cx = shapeResizerBbox.value.x + shapeResizerBbox.value.width / 2;
      const cy = shapeResizerBbox.value.y + shapeResizerBbox.value.height / 2;

      const { x, y } = useScreenToWorld(moveEvent.clientX, moveEvent.clientY);

      const angle = findAngleBetweenPoints(cx, cy, x, y);
      let delta = angle - lastAngle;

      // Wrap delta to [-180, 180] to avoid jumps crossing ±180°
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      lastAngle = angle;

      selectedObject.value?.setTransform({
        rotate: (selectedObject.value?.transform.rotate || 0) + delta,
      });
    };

    useDragElement(rotate);
  };

  const angle = computed(() => {
    const cx = shapeResizerBbox.value.x + shapeResizerBbox.value.width / 2;
    const cy = shapeResizerBbox.value.y + shapeResizerBbox.value.height / 2;
    return (
      Math.atan2(mousePos.value.y - cy, mousePos.value.x - cx) * (180 / Math.PI)
    );
  });

  const cursorTransform = computed(
    () =>
      `translate(${mousePos.value.x}, ${mousePos.value.y}) rotate(${angle.value - 60})`,
  );

  return {
    isRotationCursor,
    bbox,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    cursorTransform,
  };
};
