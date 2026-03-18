/**
 * Utility composable to execute a specific function during element drag.
 * -- Need to note that this function handles 'pointermove' and 'pointerup' events.
 * -- So, firstly pointerdown should be executed and then this function should be called.
 *
 * @param onMove - Function to execute DURING the movement
 * @param onEnd - Function to execute AFTER the movement
 * @returns
 */
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

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
};
