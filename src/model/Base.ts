import { getObjectCenterPosition } from "../utils/math";

export const DEFAULT_MODEL_COLOR = "#EEEEEE";

type TransformType = {
  rotate?: number;
};

export interface BaseModelInterface {
  id: number;
  color: string;
  type: string;
  name: string;
  opacity: number;
  transform: TransformType;
  getName(): string;
  getType(): string;
  getColor(): string;
  getId(): number;
  setColor(color: string): BaseModelInterface;
  setTransform({ rotate }: TransformType): BaseModelInterface;
  getTransform(): string;
}

export default class BaseModel implements BaseModelInterface {
  id: number;
  color: string;
  type: string;
  name: string;
  opacity: number = 100;
  transform: TransformType = {};

  constructor({
    id,
    color,
    type,
    name,
  }: {
    id: number;
    color?: string;
    type: string;
    name: string;
  }) {
    this.id = id;
    this.color = color ?? DEFAULT_MODEL_COLOR;
    this.type = type ?? "";
    this.name = name ?? type ?? "";
  }

  getName(): string {
    return this.name;
  }

  getType(): string {
    return this.type;
  }

  getColor(): string {
    return this.color;
  }

  getId(): number {
    return this.id;
  }

  setColor(color: string): this {
    if (!color) {
      return this;
    }

    this.color = color;
    return this;
  }

  setTransform({ rotate }: TransformType): this {
    if (rotate) {
      this.transform.rotate = rotate;
    }

    return this;
  }

  getTransform(): string {
    if (!this.transform.rotate) {
      return "";
    }

    const { x, y } = getObjectCenterPosition(this);

    return `rotate(${this.transform.rotate}, ${x}, ${y})`;
  }
}
