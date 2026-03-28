export const DEFAULT_RECT_WIDTH = 50;
export const DEFAULT_RECT_HEIGHT = 40;
export const DEFAULT_RECT_COLOR = "#ffffff";

import { ShapeType, RECTANGLE, SHAPE_TYPES } from "../types/ShapeTypes";
import BaseModel, { BaseModelInterface } from "./Base";

export interface RectangleInterface extends BaseModelInterface {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  getX: () => number;
  setX: (x: number) => this;
  getY: () => number;
  setY: (y: number) => this;
  getWidth: () => number;
  setWidth: (width: number) => this;
  getHeight: () => number;
  setHeight: (height: number) => this;
}

export class Rectangle extends BaseModel implements RectangleInterface {
  id: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
  rx: number;
  ry: number;

  constructor(
    id: number,
    x: number,
    y: number,
    width: number = DEFAULT_RECT_WIDTH,
    height: number = DEFAULT_RECT_HEIGHT,
    color: string,
    rx: number = 0,
    ry: number = 0,
  ) {
    super({
      id,
      type: SHAPE_TYPES.rectangle,
      name: SHAPE_TYPES.rectangle,
      color,
    });
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rx = rx;
    this.ry = ry;

    this.cx = x + width / 2;
    this.cy = y + height / 2;
  }

  getX() {
    return this.x;
  }

  setX(x: number) {
    this.x = x;
    return this;
  }

  getY() {
    return this.y;
  }

  setY(y: number) {
    this.y = y;
    return this;
  }

  getWidth() {
    return this.width;
  }

  setWidth(width: number) {
    this.width = width;
    return this;
  }

  getHeight() {
    return this.height;
  }

  setHeight(height: number) {
    this.height = height;
    return this;
  }
}

export default Rectangle;
