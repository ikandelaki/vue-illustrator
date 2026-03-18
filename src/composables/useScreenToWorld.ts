import { useCanvasStore } from "../store/canvas";

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
  const y = (clientY - store.transform.y) / store.scale;

  return { x, y };
};
