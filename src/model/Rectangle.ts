export const DEFAULT_RECT_WIDTH = 50;
export const DEFAULT_RECT_HEIGHT = 40;

export interface RectangleInterface {
    width: number,
    height: number,
    x?: number,
    y?: number,
    rx?: number,
    ry?: number,
    color?: string
}

export const DEFAULT_RECT_COLOR = '#fff';

/**
 * Factory to create a RectangleInterface with defaults applied.
 * Use this instead of trying to put defaults on the interface itself.
 */
export function createRectangle(overrides: Partial<RectangleInterface> = {}): RectangleInterface {
    return {
        width: overrides.width ?? DEFAULT_RECT_WIDTH,
        height: overrides.height ?? DEFAULT_RECT_HEIGHT,
        x: overrides.x,
        y: overrides.y,
        rx: overrides.rx,
        ry: overrides.ry,
        color: overrides.color ?? DEFAULT_RECT_COLOR,
    }
}