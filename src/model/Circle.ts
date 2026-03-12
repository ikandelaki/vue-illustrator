import { SHAPE_TYPES } from "../types/ShapeTypes";
import BaseModel, { BaseModelInterface } from "./Base";

export const DEFAULT_CIRCLE_RADIUS: number = 50;
export const DEFAULT_CIRCLE_COLOR: string = "#ffffff";

export interface CircleInterface extends BaseModelInterface {
  cx: number;
  cy: number;
  radius: number;
  getCx: () => number;
  setCx: (cx: number) => this;
  getCy: () => number;
  setCy: (cy: number) => this;
  getRadius: () => number;
  setRadius: (radius: number) => this;
}

export class Circle extends BaseModel implements CircleInterface {
  id: number;
  cx: number;
  cy: number;
  radius: number;

  constructor(
    id: number,
    cx: number,
    cy: number,
    radius: number = DEFAULT_CIRCLE_RADIUS,
    color: string = DEFAULT_CIRCLE_COLOR,
  ) {
    super({ id, color, type: SHAPE_TYPES.circle, name: SHAPE_TYPES.circle });

    this.id = id;
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
  }

  /**
   * Get X coordinate of a circle's center
   */
  getCx() {
    return this.cx;
  }

  /**
   * Set X coordinate of a circle's center
   */
  setCx(cx: number) {
    this.cx = cx;
    return this;
  }

  /**
   * Get Y coordinate of a circle's center
   */
  getCy() {
    return this.cy;
  }

  /**
   * Set Y coordinate of a circle's center
   */
  setCy(cy: number) {
    this.cy = cy;
    return this;
  }

  /**
   * Get Radius of a circle
   */
  getRadius() {
    return this.radius;
  }

  /**
   * Set Radius of a circle
   */
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }
}

export default Circle;
