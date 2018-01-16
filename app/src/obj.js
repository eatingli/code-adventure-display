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

class View {
    constructor(width, height, col, row, theta, margin, space) {
        this.w = width;
        this.h = height;
        this.col = col;
        this.row = row;
        this.theta = theta;
        this.margin = margin = margin || [0, 0, 0, 0]; // 四邊形離外框距離：Top, Right, Bottom, Left
        this.space = space = space || [0, 0, 0, 0]; // 格子之間距離：Top, Right, Bottom, Left

        // 四邊形寬高
        this.qh = height - margin[0] - margin[2];
        this.offsetW = this.qh * Math.tan(theta);
        this.qw = width - margin[1] - margin[3] - this.offsetW;

        // 四邊形頂點：左上 左下
        let lt = new Point(margin[3] + this.offsetW, margin[0]);
        let lb = new Point(margin[3], margin[0] + this.qh);
        this.qVertex = [lt, lb]

        // 格子寬高 (未計算間距)
        this.gw = this.qw / col;
        this.gh = this.qh / row;

        // 格子寬高 (已計算間距)
        this.gws = this.qw / col - space[1] - space[3];
        this.ghs = this.qh / row - space[0] - space[2];

    }

    /**
     * 取得整個四邊形頂點 (左上, 右上, 左下, 右下)
     */
    // qVertex() {
    //     let p1 = new Point(this.margin[3] + )
    // }

    /**
     * 取得格子頂點(未計算間距) (左上, 左下)
     */
    gVertex(c, r) {
        let offsetGw = this.offsetW / this.col;

        let qv = this.qVertex[0];
        let ltx = qv.x + c * this.qw / this.col - offsetGw * r; // 起點 + 格數 - 位移 
        let lty = qv.y + r * this.qh / this.row; // 起點 + 格數
        let lt = new Point(ltx, lty);
        let lbx = ltx - offsetGw;
        let lby = lty + this.gh;
        let lb = new Point(lbx, lby);

        return [lt, lb];
    }

    /**
     * 取得格子頂點(已計算間距) (左上, 左下)
     */
    gVertexSpace(c, r) {
        let gv = this.gVertex(c, r);
        gv[0].x = gv[0].x + this.space[3]
        gv[0].y = gv[0].y + this.space[0]
        gv[1].x = gv[1].x + this.space[3]
        gv[1].y = gv[1].y - this.space[2]
        return gv
        // return {};
    }

    // /**
    //  * 垂直距離
    //  */
    // getV(scale) {
    //     return 
    // }

    /**
     * 取得格子為準的Rect
     * @param {Image} img 
     * @param {number} px 
     * @param {number} py 
     * @param {number} scale 
     * @param {number} h 
     * @param {number} v 
     */
    getImgRect(img, c, r, scale, h, v) {
        if (img === undefined || c === undefined || r === undefined) throw new Error('getRect() prams error');
        scale = scale || 1.0;
        h = h || 0.0;
        v = v || 0.0;

        let width = this.gw * scale;
        let height = img.height * width / img.width;

        let paddingX = this.gw * h;
        let paddingY = this.gh * v;

        let lb = this.gVertex(c, r)[1]; // 左下
        let x = lb.x - (width - this.gw) * 0.5 + paddingX;
        let y = lb.y - height + paddingY;
        return new Rect(x, y, width, height);
    }
}

class Layer {
    constructor(view) {
        this.view = view;
        this.canvas = document.createElement("canvas");
        this.ctx = db_ctx = db_canvas.getContext("2d");
    }

    clear() {
        this.ctx.clearRect(0, 0, this.view.w, this.view.h);
    }

    drawBackground(img) {
        let ctx = this.ctx;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.drawImage(img, -5, -5, img.width + 5, img.height + 5);
        ctx.fillRect(0, 0, this.view.w, this.view.h)
    }

    drawGrid() {
        let ctx = this.ctx;
        let view = this.view;
        let grid = this.view.grid;

        let padding = grid.w * 0.05;

        function aGrid(x, y) {
            let p1 = view.vertex(new Point(x, y - 1));
            let p2 = view.vertex(new Point(x, y));
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x + padding, p1.y + padding);
            ctx.lineTo(p1.x + grid.w - padding, p1.y + padding);
            ctx.lineTo(p2.x + grid.w - padding, p2.y - padding);
            ctx.lineTo(p2.x + padding, p2.y - padding);
            ctx.closePath();
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowColor = "#111111";
            ctx.shadowBlur = 3;
            ctx.fillStyle = "rgba(50, 50, 50, 0.25)";
            ctx.fill();
            ctx.restore()
        }

        for (let y = 0; y < view.row; y++) {
            for (let x = 0; x < view.col; x++) {
                aGrid(x, y);
            }
        }
    }

    drawImg(px, py, img, scale, offsetH, offsetV, alpha) {
        let ctx = this.ctx;
        let grid = this.view.grid;

        if (px === undefined || py === undefined || img === undefined) throw new Error('drawImg() prams error');

        scale = scale || 1.0;
        offsetH = offsetH || 0;
        offsetV = offsetV || 0;
        alpha = alpha || 1.0;

        let width = grid.w * scale;
        let height = img.height * width / img.width;

        let paddingX = grid.w * offsetH;
        let paddingY = grid.h * offsetV;

        let pixel = this.view.vertex(new Point(px, py));
        let x = pixel.x - (width - grid.w) * 0.5 + paddingX;
        let y = pixel.y - height + paddingY;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, x, y, width, height);
        ctx.restore()

        return new Rect(x, y, width, height);
    }

    drawRole(rect, color, bag) {
        let ctx = this.ctx;

        // Color Icon
        let colorX = bag ? rect.x + rect.w * 0.25 : rect.x + rect.w * 0.5;
        let colorY = rect.y - rect.h * 0.2;
        ctx.beginPath();
        ctx.arc(colorX, colorY, rect.w * 0.22, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.stroke();
        ctx.fill();
    }

    drawMonster(rect, vOffset, life) {
        let ctx = this.ctx;
        let grid = this.view.grid;

        // 血條
        let y = rect.y + grid.h * vOffset
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(rect.x, y, rect.w * life, 4);
        ctx.strokeRect(rect.x, y, rect.w, 4);
    }

    drawBuilding(scale, x, y, level, img, offsetH, offsetV, alpha) {
        let ctx = this.ctx;
        let grid = this.view.grid;

        let width = grid.w * scale;
        let height = img.height * width / img.width;

        let paddingX = grid.w * offsetH;
        let paddingY = grid.h * offsetV;

        let p = this.view.vertex(new Point(x, y));
        let rx = p.x - width * 0.5 + grid.w * 0.5 + paddingX;
        let ry = p.y - height + paddingY;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, rx, ry, width, height);
        ctx.restore()

        // level
        let MAX_LEVEL = 5;
        if (level > MAX_LEVEL) level = MAX_LEVEL;
        let lv = Math.floor(level);
        let exp = level - lv;

        ctx.fillStyle = "rgba(00, 180, 255, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";

        let space = 5;
        let w = (width - (MAX_LEVEL - 1) * space) / MAX_LEVEL;
        let h = 5;
        for (let i = 0; i < MAX_LEVEL; i++) {
            let x = rx + (w + space) * i;
            let y = ry;
            if (i < level - 1) ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }

        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";

        if (exp > 0) {
            let x = rx;
            let y = ry + 10;
            let w = width * exp;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, width, h);
        }
    }
}

class Drawer {
    constructor() {
        this.list = [];
    }

    append(x, y, z, callback) {
        this.list.push({
            x: x,
            y: y,
            z: z,
            callback: callback
        })
    }

    draw() {
        this.list
            .sort((a, b) => a.x - b.x)
            .sort((a, b) => a.y - b.y)
            .sort((a, b) => a.x == b.x && a.y == b.y ? a.z - b.z : 0)
            .forEach((obj) => {
                obj.callback();
            })
    }
}