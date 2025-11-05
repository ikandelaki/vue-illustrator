export const CIRCLE: string = 'circle' as const;
export const RECTANGLE: string = 'rectangle' as const;

export const SHAPE_TYPES = {
    circle: CIRCLE,
    rectangle: RECTANGLE
} as const

export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES];