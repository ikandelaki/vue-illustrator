import { SHAPE_TYPES } from "../types/ShapeTypes";

export const DEFAULT_TRIANGLE_WIDTH = 50;

export interface TriangleInterface {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  color: string;
  type: string;
  width: number;
  getColor: () => string;
  setColor: (color: string) => this;
  getId: () => number;
}

export default class Triangle implements TriangleInterface {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  color: string;
  width: number;
  id: number;
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
    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.color = color ?? "#fff";
    this.width = width ?? DEFAULT_TRIANGLE_WIDTH;
  }

  getColor(): string {
    return this.color;
  }

  setColor(color: string): this {
    if (!color) {
      return this;
    }

    this.color = color;
    return this;
  }

  getId(): number {
    return this.id;
  }
}
