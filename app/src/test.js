/**
 * View
 */
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// canvas
let db_canvas = document.createElement("canvas")
let db_ctx = db_canvas.getContext("2d");
let bg_canvas = document.createElement("canvas")
let bg_ctx = bg_canvas.getContext("2d");
let ef_canvas = document.createElement("canvas")
let ef_ctx = ef_canvas.getContext("2d");
let canvas = document.createElement("canvas")
let ctx = canvas.getContext("2d");

// resize
db_canvas.width = WIDTH;
db_canvas.height = HEIGHT;
bg_canvas.width = WIDTH;
bg_canvas.height = HEIGHT;
ef_canvas.width = WIDTH;
ef_canvas.height = HEIGHT;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Append
let body = document.getElementsByTagName('body')[0];
body.appendChild(bg_canvas);
body.appendChild(ef_canvas);
body.appendChild(canvas);
body.appendChild(db_canvas);


let view = new View(WIDTH, HEIGHT, 26, 18, 2 * 5 * Math.PI / 360, [145, 10, 10, 10], [3, 3, 3, 3]);

/*
 * -----------------------------------------------Test Data-----------------------------------------
 */

function randomPoint(rect) {
    let x = rect.x + Math.floor(Math.random() * rect.w);
    let y = rect.y + Math.floor(Math.random() * rect.h);
    return new Point(x, y);
}

// 取得範圍內不重複的隨機座標
let all = [];
for (let r = 0; r < view.row; r++)
    for (let c = 0; c < view.col; c++) all.push(new Point(c, r))

function randomPoints(area, num) {
    let rectPoints = all.filter((p) => {
        for (let rect of area.excludes)
            if (p.x >= rect.x && p.y >= rect.y && p.x < rect.x + rect.w && p.y < rect.y + rect.h) return false;
        for (let rect of area.includes)
            if (p.x >= rect.x && p.y >= rect.y && p.x < rect.x + rect.w && p.y < rect.y + rect.h) return true;
        return false;
    });
    if (num > rectPoints.length) throw Error('Not Enough Space')

    let result = [];
    for (let i = 0; i < num; i++) {
        let mask = Math.floor(Math.random() * rectPoints.length)
        let p = rectPoints[mask];
        result.push(p)
        rectPoints.splice(mask, 1);
        all.splice(all.indexOf(p), 1);
    }

    return result;
}

/* Role */
let colors = [
    '#660077', '#CC0000', '#0000AA', '#009FCC', '#FF44AA', '#FFFF33',
    '#FFAA33', '#33FF33', '#444444', '#FF5511', '#FFB3FF', '#008800'
];

let levels = [];
let equips = [];
let lifes = [];
let energys = [];
let exps = [];
let moneys = [];
let points = [];
let bags = [];

for (let i = 0; i < 12; i++) {
    levels.push(1 + Math.floor(Math.random() * 30));
    equips.push([0, 0, 0, 0, 0].map(() => Math.floor(Math.random() * 6)));
    lifes.push(Math.random());
    energys.push(Math.random());
    exps.push(Math.random());
    moneys.push(Math.floor(Math.random() * 1000));
    points.push(new Point(Math.floor(Math.random() * view.col), Math.floor(Math.random() * view.row)));
    bags.push(Math.random() > 0.5);
}

/* Area */
let a1 = new Area([new Rect(1, 0, 6, 5)], [new Rect(1, 1, 3, 2)]);
let a2 = new Area([new Rect(8, 0, 5, 5)], []);
let a3 = new Area([new Rect(14, 0, 5, 5)], []);
let a4 = new Area([new Rect(20, 0, 6, 5)], [new Rect(21, 1, 3, 3)]);
// let a5 = new Area([new Rect(20, 1, 3, 3)], []);
let a6 = new Area([new Rect(1, 6, 6, 4)], []);
let a7 = new Area([new Rect(8, 6, 5, 4)], [])
let a8 = new Area([new Rect(14, 6, 5, 5)], [])
let a9 = new Area([new Rect(20, 6, 6, 4)], [])
let a10 = new Area([new Rect(0, 11, 10, 7)], [])
let a11 = new Area([new Rect(10, 11, 5, 7)], [])
let a12 = new Area([new Rect(16, 12, 4, 5)], [])
let a13 = new Area([new Rect(21, 11, 5, 6)], [])

/* Resources */
let r1 = randomPoints(a4, 10)
let r2 = randomPoints(a13, 20)
let r3 = randomPoints(a1, 13)
let r4 = randomPoints(a11, 12)
let r5 = randomPoints(a8, 12)
for (let p of r2) p.t = Math.floor(Math.random() * 3)

/* Monster */
let m1 = randomPoints(a6, 10)
let m2 = randomPoints(a7, 9)
let m3 = randomPoints(a12, 8)
let m4 = randomPoints(a2, 8)
let m5 = randomPoints(a9, 8)
let m6 = randomPoints(a3, 8)
let m7 = new Point(2, 2)
let m8 = new Point(25, 17)
let m9 = new Point(22, 2)


/**
 * ------------------------------------------------ Test Interval ------------------------------------------
 */
let testX = 1;
let testY = 5;

setInterval(() => {
    // playSound('footstep00.ogg');
    // console.log(testX, testY)
    // console.log(r3)
}, 300);


document.body.onkeydown = function (e) {
    switch (e.code) {
        case 'ArrowLeft':
            testX -= 1;
            break;
        case 'ArrowUp':
            testY -= 1;
            break;
        case 'ArrowRight':
            testX += 1;
            break;
        case 'ArrowDown':
            testY += 1;
            break;
        case 'KeyA':
            break;
        default:
            console.log(e.code);
    }
};

/**
 * ------------------------------------------------ Test Draw ------------------------------------------
 */

function initDraw() {
    // Draw Background
    new DrawBackground(imgs.get('grass.jpg'), view.w, view.h).draw(bg_ctx)

    // Draw Grud
    for (let r = 0; r < view.row; r++) {
        for (let c = 0; c < view.col; c++) {
            let gv = view.gVertexSpace(c, r);
            new DrawGrid(gv[0], gv[1], view.gws).draw(bg_ctx)
        }
    }
}

function testDraw() {
    let drawer = new Drawer();

    let drawRole = (col, row, color, bag) => {
        drawer.append(col, row, 5, () => {

            // Role Img
            let img = imgs.get('role/caveman.svg');
            let r = view.getImgRect(img, col, row, 0.6, 0.07, -0.13);
            new DrawImg(img, r.x, r.y, r.w, r.h, 1.0).draw(ctx);

            // Role Color Icon
            let w = r.w * 0.44
            let h = r.w * 0.33;
            let x = r.x + (r.w - w) * 0.5;
            let y = r.y - r.h * 0.24;
            new DrawRoleColerIcon(new Rect(x, y, w, h), color).draw(ctx)

            // Bag
            if (bag) {
                let img = imgs.get('role/bag.svg');
                let rect = view.getImgRect(img, col, row, 0.3, 0.07, -1.83);
                rect.x = r.x - r.w * 0.3;
                rect.y = r.y + r.h * 0.65;
                new DrawImg(img, rect.x, rect.y, rect.w, rect.h, 0.9).draw(ctx);
            }

        })
    }

    // Role
    for (let i = 0; i < 12; i++) {
        drawRole(points[i].x, points[i].y, colors[i], bags[i]);
    }
    drawRole(testX, testY, colors[0], true)

    // Resource
    let drawResource = (x, y, rClass) => {
        let config = ResourceConfigs.get(rClass);
        let img = imgs.get(config.img);
        let rect = view.getImgRect(img, x, y, config.scale, config.h, config.v);

        let callback = () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, 0.9).draw(ctx);
        }
        drawer.append(x, y, 2, callback)
    }

    r1.forEach((p) => drawResource(p.x, p.y, 'r1'));
    r2.forEach((p) => drawResource(p.x, p.y, 'r2-' + p.t));
    r3.forEach((p) => drawResource(p.x, p.y, 'r3'));
    r4.forEach((p) => drawResource(p.x, p.y, 'r4'));
    r5.forEach((p) => drawResource(p.x, p.y, 'r5'));

    // Monster
    let drawMonster = (x, y, mClass) => {
        let mConfig = MonsterConfigs.get(mClass);
        let img = imgs.get(mConfig.img);
        let rect = view.getImgRect(img, x, y, mConfig.scale, mConfig.h, mConfig.v);
        let vOffset = rect.y + view.gh * mConfig.lifeOffset;

        let alpha = 1.0
        let life = 0.7

        let callback = () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha).draw(ctx);
            new DrawLife(rect.x, vOffset, rect.w, life).draw(ctx);
        }
        drawer.append(x, y, 2, callback)
    }

    m1.forEach((m) => drawMonster(m.x, m.y, 'm1'))
    m2.forEach((m) => drawMonster(m.x, m.y, 'm2'))
    m3.forEach((m) => drawMonster(m.x, m.y, 'm3'))
    m4.forEach((m) => drawMonster(m.x, m.y, 'm4'))
    m5.forEach((m) => drawMonster(m.x, m.y, 'm5'))
    m6.forEach((m) => drawMonster(m.x, m.y, 'm6'))
    drawMonster(m7.x, m7.y, 'm7')
    drawMonster(m8.x, m8.y, 'm8')
    drawMonster(m9.x, m9.y, 'm9')

    // Building
    function drawBuilding(c, r, bClass) {
        let level = 3.2;
        let alpha = 0.9;
        let config = BuildingConfigs.get(bClass);
        let img = imgs.get(config.img);
        let rect = view.getImgRect(img, c, r, config.scale, config.h, config.v);
        let drawImg = new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha)
        new DrawBuilding(drawImg, level).draw(ctx);
    }

    drawBuilding(1, 12, 'b1');
    drawBuilding(1, 16, 'b2');
    drawBuilding(5, 16, 'b3');
    drawBuilding(5, 12, 'b4');
    drawBuilding(8, 14, 'b5');

    drawer.draw();

    // Dashboard
    for (let i = 0; i < 12; i++) {
        let r = Math.floor(i / 6);
        let c = i % 6;

        let space = 5;
        let h = 65;
        let w = (view.w - space * 7) / 6;
        let x = space + (space + w) * c;
        let y = space + (space + h) * r;
        let rect = new Rect(x, y, w, h);
        new DrawRoleDashboard(rect, levels[i], colors[i], lifes[i], energys[i], exps[i], moneys[i], equips[i]).draw(db_ctx);
    }


    (() => {
        let rect = new Rect(5, 145, 105, 120);
        new DrawResourceDashboard(rect, 5, 7, 155,
            imgs.get('dashboard/iron.svg'), imgs.get('dashboard/wood.svg'), imgs.get('dashboard/bread.svg')).draw(db_ctx);
    })();

    (() => {
        let rect = new Rect(5, 270, 105, 95);
        let targetImg = imgs.get('monster/snail.svg');
        new DrawQuestDashboard(rect, targetImg).draw(db_ctx)
    })();

}