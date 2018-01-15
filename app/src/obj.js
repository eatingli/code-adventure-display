class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class Area {
    constructor(includes, excludes) {
        this.includes = includes;
        this.excludes = excludes;
    }
}

class Camera {
    constructor(x, y, zoom) {
        this.x = x || 0;
        this.y = y || 0;
        this.zoom = zoom || 1.0;
    }

    view(p) {
        return new Point(p.x - this.x, p.y - this.y);
    }
}

class Scene {
    constructor(canvas, col, row, theta, margin) {
        this.canvas = canvas;
        this.col = col;
        this.row = row;
        this.theta = theta;
        this.margin = margin || [20, 0, 0, 0]; // Top, Right, Bottom, Left

        let tanWidth = canvas.width - canvas.height * Math.tan(theta); // 傾斜
        this.width = (tanWidth - this.margin[1] - this.margin[3]) / this.col;
        this.height = (canvas.height - this.margin[0] - this.margin[2]) / this.row;
    }

    /**
     * To-Do: 取得頂點 (目前是左上角)
     */
    lattice(p) {
        let offsetH = Math.tan(this.theta) * this.canvas.height * (this.row - p.y) / this.row;
        let px = this.margin[1] + offsetH + this.width * p.x;
        let py = this.margin[0] + this.height * p.y;
        return new Point(px, py);
    }
}