import { useCanvasStore } from "../store/canvas";

export const useScreenToWorld = (clientX: number, clientY: number) => {
  const store = useCanvasStore();

  const x = (clientX - store.transform.x) / store.scale;
  const y = (clientY - store.transform.y) / store.scale;

  return { x, y };
};
