// requestAnimFrame
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// ------------------------------------------------------

// Param
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// Audio
let soundPath = 'sound/';
let sounds = new Map();
sounds.set('metalClick.ogg', new Audio(soundPath + 'metalClick.ogg'))
sounds.set('footstep00.ogg', new Audio(soundPath + 'footstep00.ogg'))

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

// let scene = new Scene(canvas, 26, 18, 2 * 10 * Math.PI / 360);
let scene = new Scene(canvas, 26, 18, 2 * 5 * Math.PI / 360, [145, 10, 10, 10]);
let camera = new Camera(0, 0, 1.0);

/* -------------------------------------------- Sound -------------------------------------------- */

function playSound(sound) {
    sounds.get(sound).cloneNode().play(); // 在高速時能重疊撥放
}

/* -------------------------------------------- Draw -------------------------------------------- */
function dynamicFitTextOnCanvas(ctx, text, fontface, desiredWidth) {
    let startFontsize = 200;
    return measureTextBinary(ctx, text, 0, startFontsize, fontface, desiredWidth)
}

function measureTextBinary(ctx, text, min, max, fontface, desiredWidth) {
    if (max - min < 1) {
        return Math.floor(min)
    }
    var cur = min + (max - min) / 2
    ctx.font = `${cur}px ${fontface}`
    var measureWidth = ctx.measureText(text).width
    if (measureWidth > desiredWidth) {
        return measureTextBinary(ctx, text, min, cur, fontface, desiredWidth)
    } else {
        return measureTextBinary(ctx, text, cur, max, fontface, desiredWidth)
    }
}

//圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w > 2 * r) r = w / 2;
    if (h > 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    // this.arcTo(x+r, y);
    this.closePath();
    return this;
}


function drawBG(ctx, img) {
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.drawImage(img, -5, -5, img.width + 5, img.height + 5);
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawGrid(ctx) {
    let padding = scene.width * 0.05;

    function grid(x, y) {
        let p1 = camera.view(scene.lattice(new Point(x, y)));
        let p2 = camera.view(scene.lattice(new Point(x, y + 1)));
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x + padding, p1.y + padding);
        ctx.lineTo(p1.x + scene.width - padding, p1.y + padding);
        ctx.lineTo(p2.x + scene.width - padding, p2.y - padding);
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

    for (let y = 0; y < scene.row; y++) {
        for (let x = 0; x < scene.col; x++) {
            grid(x, y);
        }
    }
}

/**
 * To-Do: 回傳頂點
 */
function drawImg(ctx, px, py, svg, scale, offsetH, offsetV, alpha) {
    if (ctx === undefined || px === undefined || py === undefined || svg === undefined) throw new Error('drawImg() prams error');

    scale = scale || 1.0;
    offsetH = offsetH || 0;
    offsetV = offsetV || 0;
    alpha = alpha || 1.0;

    let width = scene.width * scale;
    let height = svg.height * width / svg.width;

    let paddingX = scene.width * offsetH;
    let paddingY = scene.height * offsetV;

    let pixel = camera.view(scene.lattice(new Point(px, py + 1))); // 用下邊來對準
    let x = pixel.x - (width - scene.width) * 0.5 + paddingX;
    let y = pixel.y - height + paddingY;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(svg, x, y, width, height);
    ctx.restore()

    return new Rect(x, y, width, height);
}

class GridImg {
    constructor(ctx, px, py, img) {
        this.ctx = ctx;
        this.px = px;
        this.py = py;
        this.img = img;
        this.scale = 1.0;
        this.offsetH = 0.0;
        this.offsetV = 0.0;
        this.alpha = 1.0;
    }

    setPoint(px, py) {
        this.px = px;
        this.py = py;
    }

    // scene camera 外部物件?
    draw() {
        let width = scene.width * this.scale;
        let height = this.img.height * width / this.img.width;

        let paddingX = scene.width * this.offsetH;
        let paddingY = scene.height * this.offsetV;

        let pixel = camera.view(scene.lattice(new Point(px, py + 1))); // 用下邊來對準，之後改用左下頂點...
        let x = pixel.x - (width - scene.width) * 0.5 + paddingX;
        let y = pixel.y - height + paddingY;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, x, y, width, height);
        ctx.restore()
    }
}

// drawRoleDashboard
function drawRoleDashboard(ctx, row, col, level, color, life, energy, exp, money, equips) {

    let space = 5;
    let width = (canvas.width - space * 7) / 6;
    let height = 65;

    let x = space + (space + width) * col;
    let y = space + (space + height) * row;

    // 外框
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(30, 60, 100, 1)";
    ctx.strokeRect(x, y, width, height);

    // 等級
    ctx.save();
    let levelTxt = `${level}`
    dynamicFitTextOnCanvas(ctx, '99', 'Comic Sans MS', width * 0.14);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(levelTxt, x + width * 0.08, y + height * 0.38);
    ctx.strokeText(levelTxt, x + width * 0.08, y + height * 0.38);
    ctx.restore();

    // 識別色
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(x + width * 0.03, y + height * 0.70, width * 0.09, height * 0.22);
    ctx.strokeRect(x + width * 0.03, y + height * 0.70, width * 0.09, height * 0.22);
    // ctx.roundRect(x + width * 0.03, y + height * 0.76, width * 0.09, height * 0.15, 1);
    // ctx.fill();

    // 生命、體力、經驗 條
    let xOffset = x + width * 0.17;
    let barWidth = width * 0.4;
    let barHeight = height * 0.2;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(xOffset, y + height * 0.1, barWidth * life, barHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(xOffset, y + height * 0.4, barWidth * energy, barHeight);
    ctx.fillStyle = "rgba(200, 255, 0, 0.5)";
    ctx.fillRect(xOffset, y + height * 0.7, barWidth * energy, barHeight);

    ctx.strokeStyle = "rgba(230, 230, 230, 0.8)";
    ctx.strokeRect(xOffset, y + height * 0.1, barWidth, barHeight);
    ctx.strokeRect(xOffset, y + height * 0.4, barWidth, barHeight);
    ctx.strokeRect(xOffset, y + height * 0.7, barWidth, barHeight);

    // Money
    let tmp = `     ${money}`;
    let moneyText = '$' + tmp.substr(tmp.length - 4);
    dynamicFitTextOnCanvas(ctx, 'E', 'Comic Sans MS', width * 0.055);
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    moneyText.split('').forEach((t, index) => {
        ctx.fillText(t, x + width * 0.6 + index * width * 0.08, y + height * 0.30);
        ctx.strokeText(t, x + width * 0.6 + index * width * 0.08, y + height * 0.30);
    });

    // Equip
    let levels = ['E', 'D', 'C', 'B', 'A', 'S'];
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    equips.map(e => levels[e]).forEach((eLevel, index) => {
        ctx.fillText(eLevel, x + width * 0.6 + index * width * 0.08, y + height * 0.77);
        ctx.strokeText(eLevel, x + width * 0.6 + index * width * 0.08, y + height * 0.77);

    });

}

// drawResourceDashboard
function drawResourceDashboard(ctx, iron, wood, food) {
    // let x = canvas.width * 0.01;
    // let y = canvas.height * 0.4;
    let x = 5;
    let y = 145;
    let width = 105;
    let height = 120;

    // 外框
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(30, 60, 100, 1)";
    ctx.strokeRect(x, y, width, height);

    // 圖示
    let imgWidth = 40;
    let imgHeight = 40;
    ctx.drawImage(imgs.get('dashboard/iron.svg'), x - 0, y + 8, 40, 34);
    ctx.drawImage(imgs.get('dashboard/wood.svg'), x - 1, y + 46, 40, 38);
    ctx.drawImage(imgs.get('dashboard/bread.svg'), x - 3, y + 83, 44, 42);

    // 數量
    let ironTxt = `${iron}`;
    let woodTxt = `${wood}`;
    let foodTxt = `${food}`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    dynamicFitTextOnCanvas(ctx, '5', 'Comic Sans MS', 20);
    ctx.fillText(ironTxt, x + 45 + (3 - ironTxt.length) * 16, y + 10);
    ctx.strokeText(ironTxt, x + 45 + (3 - ironTxt.length) * 16, y + 10);
    ctx.fillText(woodTxt, x + 45 + (3 - woodTxt.length) * 16, y + 49);
    ctx.strokeText(woodTxt, x + 45 + (3 - woodTxt.length) * 16, y + 49);
    ctx.fillText(foodTxt, x + 45 + (3 - foodTxt.length) * 16, y + 87);
    ctx.strokeText(foodTxt, x + 45 + (3 - foodTxt.length) * 16, y + 87);
}

// drawQuestDashboard
function drawQuestDashboard(ctx, targetImg) {

    let x = 5;
    let y = 270;
    let width = 105;
    let height = 95;

    // 外框
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(30, 60, 100, 1)";
    ctx.strokeRect(x, y, width, height);

    // Quest Text
    let questTxt = 'Quest';
    dynamicFitTextOnCanvas(ctx, questTxt, 'Comic Sans MS', width * 0.7);
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(questTxt, x + width * 0.15, y + 2);
    ctx.strokeText(questTxt, x + width * 0.15, y + 2);

    // Quest Target
    let imgWidth = 65;
    let imgHeight = targetImg.height * imgWidth / targetImg.width;
    ctx.drawImage(targetImg, x + (width - imgWidth) * 0.5, y + 45, imgWidth, imgHeight);
}

// drawRole
function drawRole(ctx, rect, color, bag) {

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

function drawMonster(ctx, rect, vOffset, life) {

    // 血條
    let y = rect.y + scene.height * vOffset
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(rect.x, y, rect.w * life, 6);
    ctx.strokeRect(rect.x, y, rect.w, 6);

}

// drawBuilding
function drawBuilding(ctx, scale, x, y, level, img, offsetH, offsetV, alpha) {
    let width = scene.width * scale;
    let height = img.height * width / img.width;

    let paddingX = scene.width * offsetH;
    let paddingY = scene.height * offsetV;

    let p = camera.view(scene.lattice(new Point(x, y + 1))); // 用下邊來對準
    let rx = p.x - width * 0.5 + scene.width * 0.5 + paddingX;
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


//----------------------------------------------------------------------------

/* Image */
let imgs = new Map();
let imgSrcs = [];
imgSrcs.push('grass.jpg')
imgSrcs.push('role/caveman.svg')
imgSrcs.push('role/bag.svg')

imgSrcs.push('dashboard/iron.svg')
imgSrcs.push('dashboard/wood.svg')
imgSrcs.push('dashboard/bread.svg')

imgSrcs.push('resource/tree0.svg')
imgSrcs.push('resource/tree1.svg')
imgSrcs.push('resource/tree2.svg')
imgSrcs.push('resource/sheep.svg')
imgSrcs.push('resource/melon.svg')
imgSrcs.push('resource/cabbage.svg')
imgSrcs.push('resource/carrot.svg')
imgSrcs.push('resource/wheat.svg')
imgSrcs.push('resource/rock.svg')

imgSrcs.push('building/house.svg')
imgSrcs.push('building/mine.svg')
imgSrcs.push('building/warehouse.svg')
imgSrcs.push('building/farm.svg')
imgSrcs.push('building/well.svg')

imgSrcs.push('monster/snail.svg')
imgSrcs.push('monster/drop.svg')
imgSrcs.push('monster/bacteria.svg')
imgSrcs.push('monster/alien.svg')
imgSrcs.push('monster/flower.svg')
imgSrcs.push('monster/ghost.svg')
imgSrcs.push('monster/dinosaur.svg')
imgSrcs.push('monster/mummy.svg')
imgSrcs.push('monster/yeti.png')

imgSrcs.push('effect/explosion.svg')


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
for (let y = 0; y < scene.height; y++)
    for (let x = 0; x < scene.width; x++) all.push(new Point(x, y))

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
    points.push(new Point(Math.floor(Math.random() * scene.col), Math.floor(Math.random() * scene.row)));
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
 * ------------------------------------------------ Effect ------------------------------------------
 */



/**
 * ------------------------------------------------ Test Interval ------------------------------------------
 */
let testX = 1;
let testY = 5;

setInterval(() => {
    // playSound('footstep00.ogg');
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

//----------------------------------------------------------------------------------------------------

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
            .sort((a, b) => a.y - b.y)
            .sort((a, b) => a.x == b.x && a.y == b.y ? a.z - b.z : 0)
            .forEach((obj) => {
                obj.callback();
            })
    }
}

// Update
let lastTime = Date.now();

function update() {
    let nowTime = Date.now();
    let diffTime = nowTime - lastTime;
    lastTime = nowTime;
}

// Render
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let drawer = new Drawer();

    // Resource
    // drawImg(ctx, 12, 8, img_resource_carrot, 0.65, 0.1, 0.0, 0.9)
    // drawImg(ctx, 12, 12, img_resource_wheat, 0.65, 0.15, -0.15, 0.9)

    r1.forEach((p) => drawer.append(p.x, p.y, 2, () => {
        drawImg(ctx, p.x, p.y, imgs.get('resource/rock.svg'), 0.9, 0.01, -0.19, 0.9)
    }));
    r3.forEach((p) => drawer.append(p.x, p.y, 2, () => {
        drawImg(ctx, p.x, p.y, imgs.get('resource/melon.svg'), 0.9, 0, -0.15, 0.9)
    }));
    r2.forEach((p) => {
        switch (p.t) {
            case 0:
                return drawer.append(p.x, p.y, 2, () => {
                    drawImg(ctx, p.x, p.y, imgs.get('resource/tree0.svg'), 0.9, 0, -0.03, 0.9)
                })
            case 1:
                return drawer.append(p.x, p.y, 2, () => {
                    drawImg(ctx, p.x, p.y, imgs.get('resource/tree1.svg'), 1.0, 0, -0.17, 0.9)
                })
            case 2:
                return drawer.append(p.x, p.y, 2, () => {
                    drawImg(ctx, p.x, p.y, imgs.get('resource/tree2.svg'), 1.0, 0, -0.13, 0.9)
                })
        }
    });
    r5.forEach((p) => drawer.append(p.x, p.y, 2, () => {
        drawImg(ctx, p.x, p.y, imgs.get('resource/cabbage.svg'), 2.6, -0.14, -0.16, 0.9)
    }));
    r4.forEach((p) => drawer.append(p.x, p.y, 2, () => {
        drawImg(ctx, p.x, p.y, imgs.get('resource/sheep.svg'), 1.0, 0, -0.03, 0.9)
    }));

    // Building
    let alpha = 0.9;
    drawBuilding(ctx, 2.5, 1, 12, 3.2, imgs.get('building/house.svg'), 0, 0.1, alpha);
    drawBuilding(ctx, 2.5, 1, 16, 3.2, imgs.get('building/warehouse.svg'), 0, 1.1, alpha);
    drawBuilding(ctx, 2.5, 5, 16, 3.2, imgs.get('building/mine.svg'), 0, 1.0, alpha);
    drawBuilding(ctx, 2.7, 5, 12, 3.2, imgs.get('building/farm.svg'), 0, 1.3, alpha);
    drawBuilding(ctx, 2.0, 8, 14, 3.2, imgs.get('building/well.svg'), 0, 0.1, alpha);

    // Monster
    function drawM(x, y, mClass) {
        let rect, callback;
        switch (mClass) {
            case 1:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/snail.svg'), 0.8, 0.02, -0.19);
                    drawMonster(ctx, rect, -0.16, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 2:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/drop.svg'), 0.8, 0.05, -0.2);
                    drawMonster(ctx, rect, -0.16, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 3:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/bacteria.svg'), 1.1, 0.03, -0.05);
                    drawMonster(ctx, rect, -0.14, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 4:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/alien.svg'), 0.95, 0.12, -0.12);
                    drawMonster(ctx, rect, -0.19, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 5:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/flower.svg'), 1.1, 0.05, -0.15);
                    drawMonster(ctx, rect, -0.18, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 6:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/ghost.svg'), 1.0, 0.03, -0.02);
                    drawMonster(ctx, rect, -0.19, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 7:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/dinosaur.svg'), 2.3, 0.17, 0.97);
                    drawMonster(ctx, rect, 0.65, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 8:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/mummy.svg'), 1.2, 0.07, -0.23);
                    drawMonster(ctx, rect, -0.31, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
            case 9:
                callback = () => {
                    rect = drawImg(ctx, x, y, imgs.get('monster/yeti.png'), 2.6, 0.0, -0.1);
                    drawMonster(ctx, rect, -0.41, 0.7);
                }
                drawer.append(x, y, 2, callback)
                break;
        }
    }
    m1.forEach((m) => drawM(m.x, m.y, 1))
    m2.forEach((m) => drawM(m.x, m.y, 2))
    m3.forEach((m) => drawM(m.x, m.y, 3))
    m4.forEach((m) => drawM(m.x, m.y, 4))
    m5.forEach((m) => drawM(m.x, m.y, 5))
    m6.forEach((m) => drawM(m.x, m.y, 6))
    drawM(m7.x, m7.y, 7)
    drawM(m8.x, m8.y, 8)
    drawM(m9.x, m9.y, 9)


    // Role
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {}
    }
    for (let i = 0; i < 12; i++) {
        drawer.append(points[i].x, points[i].y, 4, () => {
            let roleRect = drawImg(ctx, points[i].x, points[i].y, imgs.get('role/caveman.svg'), 0.6, 0.07, -0.15, 1.0)
            drawRole(ctx, roleRect, colors[i], bags[i]);
            if (bags[i]) drawImg(ctx, points[i].x, points[i].y, imgs.get('role/bag.svg'), 0.3, 0.2, -2.05, 1.0)
        })
    }

    drawer.append(testX, testY, 4, () => {
        let roleRect = drawImg(ctx, testX, testY, imgs.get('role/caveman.svg'), 0.6, 0.07, -0.15, 1.0)
        drawImg(ctx, testX, testY, imgs.get('role/bag.svg'), 0.3, 0.2, -2.05, 1.0)
        drawRole(ctx, roleRect, colors[0], true);
    })

    drawer.draw();

    // Dashboard
    for (let i = 0; i < 12; i++) {
        drawRoleDashboard(ctx, Math.floor(i / 6), i % 6,
            levels[i], colors[i], lifes[i], energys[i], exps[i], moneys[i], equips[i]);
    }
    drawResourceDashboard(ctx, 5, 75, 155);
    drawQuestDashboard(ctx, imgs.get('monster/snail.svg'));

}

Image.prototype.load = function (src) {
    return new Promise((resolve, reject) => {
        this.src = src;
        this.onload = resolve;
    })
}

async function init() {

    // Progress
    let progress = document.createElement('Progress');
    progress.value = 0;
    progress.max = 100;
    document.getElementsByTagName('body')[0].appendChild(progress);

    // Load Image
    let count = 0;
    for (let src of imgSrcs) {
        let img = new Image();
        await img.load('img/' + src);
        imgs.set(src, img);

        progress.value = ++count * 100 / imgSrcs.length;
        console.log('Load Success: ' + src);
    }

    // Remove Progress
    progress.remove();

    // Draw BG
    drawBG(bg_ctx, imgs.get('grass.jpg'));
    drawGrid(bg_ctx);

}

function animloop() {
    requestAnimFrame(animloop);
    update();
    render();
}

async function main() {
    await init();
    animloop();
}

window.onload = main;