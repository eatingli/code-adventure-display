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

// let scene = new Scene(canvas, 26, 18, 2 * 10 * Math.PI / 360);
let scene = new Scene(canvas, 26, 18, 2 * 5 * Math.PI / 360, [145, 10, 10, 10]);
let camera = new Camera(0, 0, 1.0);

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
for (let y = 0; y < view.gh; y++)
    for (let x = 0; x < view.gw; x++) all.push(new Point(x, y))

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
            // camera.x -= 2;
            testX -= 1;
            break;
        case 'ArrowUp':
            // camera.y -= 2;
            testY -= 1;
            break;
        case 'ArrowRight':
            // camera.x += 2;
            testX += 1;
            break;
        case 'ArrowDown':
            // camera.y += 2;
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

let flag = 0;

function testDraw() {
    let drawer = new Drawer();

    function drawRole1(x, y, color, bag) {
        drawer.append(x, y, 5, () => {
            let img1 = imgs.get('role/caveman.svg');
            let rect1 = view.getImgRect(img1, x, y, 0.6, 0.07, -0.15);
            new DrawImg(img1, rect1.x, rect1.y, rect1.w, rect1.h, 1.0).draw(ctx);

            let img2 = imgs.get('role/bag.svg');
            let rect2 = view.getImgRect(img1, x, y, 0.3, 0.2, -2.05);
            if (bag)
                new DrawImg(img2, rect2.x, rect1.y - rect2.h, rect2.w, rect2.h, 1.0).draw(ctx);
            drawRoleColorIcon(ctx, rect1, color, bag);
        })
    }

    // Role
    for (let i = 0; i < 12; i++) {
        drawRole1(points[i].x, points[i].y, colors[i], bags[i]);
    }
    drawRole1(testX, testY, colors[0], true)

    // Resource
    function drawR(x, y, rClass) {
        let config = ResourceConfigs.get(rClass);
        let img = imgs.get(config.img);
        let rect = view.getImgRect(img, x, y, config.scale, config.h, config.v);

        let callback = () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, 0.9).draw(ctx);
        }
        drawer.append(x, y, 2, callback)
    }

    r1.forEach((p) => drawR(p.x, p.y, 'r1'));
    r2.forEach((p) => drawR(p.x, p.y, 'r2-' + p.t));
    r3.forEach((p) => drawR(p.x, p.y, 'r3'));
    r4.forEach((p) => drawR(p.x, p.y, 'r4'));
    r5.forEach((p) => drawR(p.x, p.y, 'r5'));

    // Monster
    function drawM(x, y, mClass) {
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

    m1.forEach((m) => drawM(m.x, m.y, 'm1'))
    m2.forEach((m) => drawM(m.x, m.y, 'm2'))
    m3.forEach((m) => drawM(m.x, m.y, 'm3'))
    m4.forEach((m) => drawM(m.x, m.y, 'm4'))
    m5.forEach((m) => drawM(m.x, m.y, 'm5'))
    m6.forEach((m) => drawM(m.x, m.y, 'm6'))
    drawM(m7.x, m7.y, 'm7')
    drawM(m8.x, m8.y, 'm8')
    drawM(m9.x, m9.y, 'm9')

    // Building
    function drawB(c, r, bClass) {
        let level = 3.2;
        let alpha = 0.9;
        let config = BuildingConfigs.get(bClass);
        let img = imgs.get(config.img);
        let rect = view.getImgRect(img, c, r, config.scale, config.h, config.v);
        let drawImg = new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha)
        new DrawBuilding(drawImg, level).draw(ctx);
    }

    drawB(1, 12, 'b1');
    drawB(1, 16, 'b2');
    drawB(5, 16, 'b3');
    drawB(5, 12, 'b4');
    drawB(8, 14, 'b5');


    drawer.draw();

    // Dashboard
    for (let i = 0; i < 12; i++) {
        drawRoleDashboard(ctx, Math.floor(i / 6), i % 6,
            levels[i], colors[i], lifes[i], energys[i], exps[i], moneys[i], equips[i]);
    }
    drawResourceDashboard(ctx, 5, 75, 155);
    drawQuestDashboard(ctx, imgs.get('monster/snail.svg'));
}