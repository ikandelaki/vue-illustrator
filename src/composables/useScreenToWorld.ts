import { useCanvasStore } from "../store/canvas";

export const CANVAS_OFFSET_TOP = 50;

/**
 * Transform screen X and Y coordinates (event.clientX and event.clientY) into svg world X and X coordinates
 *
 * @param clientX - event.clientX from a mouse event
 * @param clientY - event clientY from a mouse event
 *
 * @returns
 */
export const useScreenToWorld = (
  clientX: number,
  clientY: number,
): { x: number; y: number } => {
  const store = useCanvasStore();

  const x = (clientX - store.transform.x) / store.scale;
  const y = (clientY - store.transform.y - CANVAS_OFFSET_TOP) / store.scale;

  return { x, y };
};
