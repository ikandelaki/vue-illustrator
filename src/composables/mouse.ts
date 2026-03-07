export const useDragElement = (
  onMove: (moveEvent: PointerEvent) => void,
  onEnd?: () => void,
) => {
  if (!onMove) {
    console.error("Please provide onMove method to useDragElement");
    return;
  }

  const onPointerMove = (moveEvent: PointerEvent) => {
    onMove(moveEvent);
  };

  const onPointerUp = () => {
    if (onEnd) {
      onEnd();
    }
    // 4. Cleanup global listeners
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
};
