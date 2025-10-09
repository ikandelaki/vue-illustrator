export const DEFAULT_CIRCLE_RADIUS = 50;

export class Circle {
    constructor(id, cx, cy, r = DEFAULT_CIRCLE_RADIUS) {
        this.id = id;
        this.cx = cx;
        this.cy = cy;
        this.r = r;
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
    getR() {
        return this.r;
    }

    /**
     * Set Radius of a circle
     */
    setR(r) {
        this.r = r;
        return this;
    }

    /**
     * Get Circle id
     */
    getId() {
        return this.id;
    }
}

export default Circle;