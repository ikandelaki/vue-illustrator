import { onMounted, onUnmounted } from "vue";
import { useSelectedShapeStore } from "../store/selectedShape";
import { SHAPE_TYPES } from "../types/ShapeTypes";

/**
 * Run specific functions during keyDown event.
 *
 * "KeyV": Set selected shape to cursor, which allows to move the object, resize, etc.
 * "KeyC": Set selected shape to a Circle.
 * "KeyR": Set selected shape to a Rectangle.
 * "KeyT": Set selected shape to a Triangle.
 */
export const useKeyDown = () => {
  const { setSelectedShape } = useSelectedShapeStore();
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyV":
        setSelectedShape(SHAPE_TYPES.cursor);
        return;
      case "KeyC":
        setSelectedShape(SHAPE_TYPES.circle);
        return;
      case "KeyR":
        setSelectedShape(SHAPE_TYPES.rectangle);
        return;
      case "KeyT":
        setSelectedShape(SHAPE_TYPES.triangle);
        return;
      default:
        return;
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
};
