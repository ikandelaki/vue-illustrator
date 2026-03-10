import { CircleInterface } from "../model/Circle";
import { RectangleInterface } from "../model/Rectangle";
import { TriangleInterface } from "../model/Triangle";
import { ShapeObject } from "../store/objects";
import { SHAPE_TYPES } from "../types/ShapeTypes";

export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export const getObjectCenterPosition = (object: ShapeObject) => {
  if (!object) {
    return {};
  }

  if (object.type === SHAPE_TYPES.circle) {
    const circle = object as CircleInterface;
    return { x: circle.cx, y: circle.cy };
  }

  if (object.type === SHAPE_TYPES.rectangle) {
    const rectangle = object as RectangleInterface;
    return {
      x: rectangle.x + rectangle.width / 2,
      y: rectangle.y + rectangle.height / 2,
    };
  }

  if (object.type === SHAPE_TYPES.triangle) {
    const triangle = object as TriangleInterface;
    return {
      x: (triangle.x1 + triangle.x2 + triangle.x3) / 3,
      y: (triangle.y1 + triangle.y2 + triangle.y3) / 3,
    };
  }

  return {};
};
