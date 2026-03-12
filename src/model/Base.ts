export const DEFAULT_MODEL_COLOR = "#ffffff";

export interface BaseModelInterface {
  id: number;
  color: string;
  type: string;
  name: string;
  getName(): string;
  getType(): string;
  getColor(): string;
  getId(): number;
  setColor(color: string): BaseModelInterface;
}

export default class BaseModel implements BaseModelInterface {
  id: number;
  color: string;
  type: string;
  name: string;

  constructor({
    id,
    color,
    type,
    name,
  }: {
    id: number;
    color: string;
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
}
