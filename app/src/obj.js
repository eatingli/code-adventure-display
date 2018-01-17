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

    /**
     * 取得已格子為準的圖片縮放
     */
    gImgScale(img, scale) {
        if (img === undefined || scale === undefined) throw new Error('gImgScale() prams error');

        let w = this.gw * scale;
        let h = img.height * w / img.width;
        return new Rect(0, 0, w, h)
    }

    /**
     * 取得格子為準的Rect
     */
    gImgRect(img, c, r, scale, h, v) {
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

    /**
     * 取得格子的中心座標 (H:水平平移 V:垂直平移)
     */
    gCenter(c, r, h, v) {
        if (!h) h = 0.0;
        if (!v) v = 0.0;
        let gv = this.gVertex(c, r);
        let x = (gv[1].x + (gv[0].x + this.gw)) * 0.5 + this.gw * h; // 平均 + 平移
        let y = gv[0].y + this.gh * 0.5 + this.gh * v;
        return new Point(x, y);
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