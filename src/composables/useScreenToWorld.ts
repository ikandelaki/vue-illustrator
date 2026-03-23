import { useTemplateRef } from "vue";
import { useCanvasStore } from "../store/canvas";

const canvasRef = useTemplateRef("canvasContainer");
const { x: canvasX = 0, y: canvasY = 50 } =
  canvasRef.value?.getBoundingClientRect() || {};

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

  const x = (clientX - store.transform.x - canvasX) / store.scale;
  const y = (clientY - store.transform.y - canvasY) / store.scale;

  return { x, y };
};
