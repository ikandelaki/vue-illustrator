import { ref, onMounted, onUnmounted } from "vue";

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const SCALE_STEP = 0.1;

export function useCanvasZoom() {
  const scale = ref(1);
  const offset = ref({ x: 0, y: 0 });

  /**
   * Zoom toward/away from a point (in container-local coordinates).
   * The canvas point under (mouseX, mouseY) stays visually fixed.
   */
  const zoomToPoint = (delta: number, mouseX: number, mouseY: number) => {
    const oldScale = scale.value;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale + delta));

    if (newScale === oldScale) return;

    // Which canvas-space point is currently under the mouse?
    //   mouseX = canvasX * oldScale + offset.x  →  solve for canvasX
    const canvasX = (mouseX - offset.value.x) / oldScale;
    const canvasY = (mouseY - offset.value.y) / oldScale;

    scale.value = newScale;

    // Recompute offset so that same canvas point lands back under the mouse:
    //   mouseX = canvasX * newScale + newOffset.x  →  solve for newOffset.x
    offset.value = {
      x: mouseX - canvasX * newScale,
      y: mouseY - canvasY * newScale,
    };
  };

  const onWheel = (event: WheelEvent) => {
    const el = event.target as HTMLElement;

    // Only act inside our canvas-container
    const container = el.closest<HTMLElement>(".canvas-container");
    if (!container) return;

    // Only intercept pinch/ctrl+scroll
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();

    const delta = -Math.sign(event.deltaY) * SCALE_STEP;

    // All coordinates normalised to container-local space
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const onCanvas = !!el.closest(".canvas");

    if (onCanvas) {
      // Zoom anchored to the cursor
      zoomToPoint(delta, mouseX, mouseY);
    } else {
      // Zoom anchored to the visual center of the container
      zoomToPoint(delta, rect.width / 2, rect.height / 2);
    }
  };

  onMounted(() =>
    window.addEventListener("wheel", onWheel, { passive: false }),
  );
  onUnmounted(() => window.removeEventListener("wheel", onWheel));

  return { scale, offset, zoomToPoint };
}
