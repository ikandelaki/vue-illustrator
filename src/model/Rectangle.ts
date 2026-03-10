export const DEFAULT_RECT_WIDTH = 50;
export const DEFAULT_RECT_HEIGHT = 40;
export const DEFAULT_RECT_COLOR = "#ffffff";

import { ShapeType, RECTANGLE } from "../types/ShapeTypes";

export interface RectangleInterface {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  color: string;
  type: ShapeType;
  getX: () => number;
  setX: (x: number) => this;
  getY: () => number;
  setY: (y: number) => this;
  getWidth: () => number;
  setWidth: (width: number) => this;
  getHeight: () => number;
  setHeight: (height: number) => this;
  getId: () => number;
  getColor: () => string;
  setColor: (color: string) => this;
}

export class Rectangle implements RectangleInterface {
  id: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
  color: string;
  type: ShapeType; // assigned in constructor

  constructor(
    id: number,
    x: number,
    y: number,
    width: number = DEFAULT_RECT_WIDTH,
    height: number = DEFAULT_RECT_HEIGHT,
    rx: number = 0,
    ry: number = 0,
    color: string = DEFAULT_RECT_COLOR,
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rx = rx;
    this.ry = ry;
    this.color = color;
    this.type = RECTANGLE;

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

  getId() {
    return this.id;
  }

  getColor() {
    return this.color;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }
}

export default Rectangle;
