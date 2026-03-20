import { CircleInterface } from "../model/Circle";
import { RectangleInterface } from "../model/Rectangle";
import { TriangleInterface } from "../model/Triangle";
import { ShapeObject } from "../store/objects";
import { SHAPE_TYPES } from "../types/ShapeTypes";

type BboxType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

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

/**
 * Calculate if the point is inside a specific rectangle
 *
 * @param x
 * @param y
 * @param bbox
 * @returns
 */
export const isPointInsideBbox = (x: number, y: number, bbox: BboxType) => {
  return (
    x > bbox.x &&
    x < bbox.width + bbox.x &&
    y > bbox.y &&
    y < bbox.y + bbox.height
  );
};

/**
 * Find the angle between three points, centered around B point
 *
 * @param a
 * @param b
 * @param c
 * @param convertToDegrees
 */
export const findAngleBetweenPoints = (
  a: Point,
  b: Point,
  c: Point,
  convertToDegrees = false,
) => {
  // Calculate the vectors BA and BC
  var ba = { x: a.x - b.x, y: a.y - b.y };
  var bc = { x: c.x - b.x, y: c.y - b.y };

  // Use Math.atan2() to find the angle of each vector relative to the x-axis
  var angleBa = Math.atan2(ba.y, ba.x);
  var angleBc = Math.atan2(bc.y, bc.x);

  // Calculate the difference between the angles
  var angleDiff = angleBc - angleBa;

  // Normalize the angle difference to the range (-PI, PI]
  while (angleDiff <= -Math.PI) angleDiff += 2 * Math.PI;
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;

  if (convertToDegrees) {
    return angleDiff * (180 / Math.PI);
  }

  return angleDiff; // Angle in radians
};
