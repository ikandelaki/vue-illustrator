import { SHAPE_TYPES } from "../types/ShapeTypes";
import BaseModel, { BaseModelInterface } from "./Base";

export const DEFAULT_TRIANGLE_WIDTH = 50;

export interface TriangleInterface extends BaseModelInterface {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  width: number;
}

export class Triangle extends BaseModel implements TriangleInterface {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  width: number;
  type: string = SHAPE_TYPES.triangle;

  constructor(
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    width?: number,
    color?: string,
  ) {
    super({
      id,
      color,
      type: SHAPE_TYPES.triangle,
      name: SHAPE_TYPES.triangle,
    });
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.width = width ?? DEFAULT_TRIANGLE_WIDTH;
  }
}

export default Triangle;
