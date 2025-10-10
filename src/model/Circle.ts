export const DEFAULT_CIRCLE_RADIUS: number = 50;
export const DEFAULT_CIRCLE_COLOR: string = '#ffffff';

export interface CircleInterface {
	id: number;
	cx: number;
	cy: number;
	radius: number;
	getCx: () => number;
	setCx: (cx: number) => this;
	getCy: () => number;
	setCy: (cy: number) => this;
	getRadius: () => number;
	setRadius: (radius: number) => this;
	getId: () => number;
    getColor: () => string;
    setColor: (color: string) => this;
}

export class Circle implements CircleInterface {
	id: number;
	cx: number;
	cy: number;
	radius: number;
    color: string;

    constructor(
        id: number,
        cx: number,
        cy: number,
        radius: number = DEFAULT_CIRCLE_RADIUS,
        color: string = DEFAULT_CIRCLE_COLOR
    ) {
        this.id = id;
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.color = color;
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
    setCx(cx) {
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
    setCy(cy) {
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

    /**
     * Get Circle id
     */
    getId() {
        return this.id;
    }

    /**
     * Get color of a circle
     * 
     * @returns 
     */
    getColor() {
        return this.color;
    }

    /**
     * Set color of a circle
     * 
     * @param color
     * @returns 
     */
    setColor(color) {
        this.color = color;

        return this;
    }
}

export default Circle;
