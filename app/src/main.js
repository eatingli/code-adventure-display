/**
 * ----------------------------------------- requestAnimFrame ---------------------------------------
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * ------------------------------------------------ Const ------------------------------------------
 */
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const COL = 26;
const ROW = 18;
const COLORS = [
    '#660077', '#CC0000', '#0000AA', '#009FCC', '#FF44AA', '#FFFF33',
    '#FFAA33', '#33FF33', '#444444', '#FF5511', '#FFB3FF', '#008800'
];

/**
 * ------------------------------------------------ Canvas ------------------------------------------
 */
function newCanvas() {
    // Create
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d");
    // Resize
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    // Append
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    return ctx;
}

let bg_ctx = newCanvas();
let obj_ctx = newCanvas();
let ef_ctx = newCanvas();
let db_ctx = newCanvas();


/**
 * ------------------------------------------------ Data ------------------------------------------
 */
let testView = new View(WIDTH, HEIGHT, COL, ROW, 2 * 5 * Math.PI / 360, [145, 10, 10, 10], [3, 3, 3, 3]);
let testData = new TestDate(COL, ROW);
testData.init();

/**
 * ------------------------------------------------ Sound ------------------------------------------
 */
function playSound(sound) {
    sound.cloneNode().play(); // 在高速時能重疊撥放
}


/**
 * ------------------------------------------------ Draw ------------------------------------------
 */

function drawBG(view) {
    // Draw Background
    new DrawBackground(imgs.get('grass.jpg'), view.w, view.h).draw(bg_ctx)

    // Draw Grid
    for (let r = 0; r < view.row; r++) {
        for (let c = 0; c < view.col; c++) {
            let gv = view.gVertexSpace(c, r);
            new DrawGrid(gv[0], gv[1], view.gws).draw(bg_ctx)
        }
    }
}

function drawObj(ctx, view, data) {

    // Drawer 根據座標來排序物件
    let drawer = new Drawer();

    for (let i = 0; i < 12; i++) {
        let role = data.roles[i];
        let col = role.x;
        let row = role.y;
        let color = COLORS[i];
        let bag = role.bag;

        drawer.append(col, row, 5, () => {

            // Role Img
            let img = imgs.get('role/caveman.svg');
            let r = view.gImgRect(img, col, row, 0.6, 0.07, -0.13);
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
                let rect = view.gImgRect(img, col, row, 0.3, 0.07, -1.83);
                rect.x = r.x - r.w * 0.3;
                rect.y = r.y + r.h * 0.65;
                new DrawImg(img, rect.x, rect.y, rect.w, rect.h, 0.9).draw(ctx);
            }
        })
    }

    // Res
    for (let res of data.resources) {
        let col = res.x;
        let row = res.y;
        let c = res.c;

        let config = ResourceConfigs.get(c);
        let img = imgs.get(config.img);
        let rect = view.gImgRect(img, col, row, config.scale, config.h, config.v);

        drawer.append(col, row, 2, () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, 0.9).draw(ctx);
        })
    }

    // Monster
    for (let m of data.monsters) {
        let col = m.x;
        let row = m.y;
        let c = m.c;
        let life = m.life / m.maxLife;

        let mConfig = MonsterConfigs.get(c);
        let img = imgs.get(mConfig.img);
        let rect = view.gImgRect(img, col, row, mConfig.scale, mConfig.h, mConfig.v);
        let vOffset = rect.y + view.gh * mConfig.lifeOffset;

        let alpha = 1.0
        let callback = () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha).draw(ctx);
            new DrawLife(rect.x, vOffset, rect.w, life).draw(ctx);
        }
        drawer.append(col, row, 2, callback)
    }

    // Building
    for (let b of data.buildings) {
        let col = b.x;
        let row = b.y;
        let c = b.c;
        let level = b.level + b.exp / b.maxExp;

        let alpha = 0.9;
        let config = BuildingConfigs.get(c);
        let img = imgs.get(config.img);
        let rect = view.gImgRect(img, col, row, config.scale, config.h, config.v);
        let drawImg = new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha)
        new DrawBuilding(drawImg, level).draw(ctx);
    }

    drawer.draw();
}

function drawDB(ctx, view, data) {

    // Role
    for (let i = 0; i < 12; i++) {
        let row = Math.floor(i / 6);
        let col = i % 6;

        let space = 5;
        let h = 65;
        let w = (view.w - space * 7) / 6;
        let x = space + (space + w) * col;
        let y = space + (space + h) * row;
        let rect = new Rect(x, y, w, h);

        let role = data.roles[i];
        let life = role.life / role.maxLife;
        let energy = role.energy / role.maxEnergy;
        let exp = role.exp / role.maxExp;
        new DrawRoleDashboard(rect, role.level, COLORS[i], life, energy, exp, role.money, role.equip).draw(ctx);
    }

    // Storage
    (() => {
        let storage = data.storage
        let rect = new Rect(5, 145, 105, 120);
        new DrawResourceDashboard(rect, storage.iron, storage.wood, storage.food,
            imgs.get('dashboard/iron.svg'), imgs.get('dashboard/wood.svg'), imgs.get('dashboard/bread.svg')).draw(ctx);
    })();

    // Quest
    (() => {
        let target = data.quest.tartget;
        let rect = new Rect(5, 270, 105, 95);
        let targetImg = imgs.get('monster/snail.svg');
        new DrawQuestDashboard(rect, targetImg).draw(ctx)
    })();
}

/**
 * ------------------------------------------------ Effect ------------------------------------------
 */

let efm = new EffectManager();

let ef = {
    explosion: (view, col, row) => {
        let p1 = view.gCenter(col, row);
        let p2 = view.gCenter(col, row, 0.0, -0.5);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 600;

        let img = imgs.get('effect/explosion.svg');
        let rect1 = view.gImgScale(img, 1.4); // Scale
        let rect2 = view.gImgScale(img, 1.9);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.0);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    pace: (view, col, row) => {
        let p1 = view.gCenter(col, row);
        let p2 = view.gCenter(col, row, 0.0, -0.1);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 300;

        let img = imgs.get('effect/pace.svg');
        let rect1 = view.gImgScale(img, 0.9); // Scale
        let rect2 = view.gImgScale(img, 1.2);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.2);
        return new DrawEffect(img, time, x, y, w, h, alpha);

    },
    collect: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.0, -0.4);
        let p2 = view.gCenter(col, row, 0.0, -1.3);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 500;

        let img = imgs.get('effect/leaf.svg');
        let rect1 = view.gImgScale(img, 0.9); // Scale
        let rect2 = view.gImgScale(img, 1.2);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.2);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    build: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.0, -0.2);
        let p2 = view.gCenter(col, row, 0.0, -0.4);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 800;

        let img = imgs.get('effect/hammer.svg');
        let rect1 = view.gImgScale(img, 1.0); // Scale
        let rect2 = view.gImgScale(img, 1.3);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.1);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    forbid: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.0, -0.4);
        let p2 = view.gCenter(col, row, 0.0, -0.4);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 400;

        let img = imgs.get('effect/forbid.svg');
        let rect1 = view.gImgScale(img, 0.9); // Scale
        let rect2 = view.gImgScale(img, 1.0);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.4);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    carry: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.0, -1.5);
        let p2 = view.gCenter(col, row, 0.0, -2.0);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 600;

        let img = imgs.get('effect/bag.svg');
        let rect1 = view.gImgScale(img, 0.4); // Scale
        let rect2 = view.gImgScale(img, 0.55);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.2);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    sleep: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.6, -1.1);
        let p2 = view.gCenter(col, row, 0.6, -1.3);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 2000;

        let img = imgs.get('effect/zzz.svg');
        let rect1 = view.gImgScale(img, 0.9); // Scale
        let rect2 = view.gImgScale(img, 1.2);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.4);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    upgrade: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.0, -1.6);
        let p2 = view.gCenter(col, row, 0.0, -1.9);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 1000;

        let img = imgs.get('effect/blacksmith.svg');
        let rect1 = view.gImgScale(img, 1.0); // Scale
        let rect2 = view.gImgScale(img, 1.3);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.4);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    trade: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.1, -1.6);
        let p2 = view.gCenter(col, row, 0.1, -2.4);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 300;

        let img = imgs.get('effect/money.svg');
        let rect1 = view.gImgScale(img, 1.0); // Scale
        let rect2 = view.gImgScale(img, 1.1);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.4);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    hello: (view, col, row) => {
        let p1 = view.gCenter(col, row, 0.0, -1.6);
        let p2 = view.gCenter(col, row, 0.0, -1.7);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);
        let time = 1000;

        let img = imgs.get('effect/hello.svg');
        let rect1 = view.gImgScale(img, 1.8); // Scale
        let rect2 = view.gImgScale(img, 1.95);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.2);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
    delay: (view, col, row, time) => {
        let p1 = view.gCenter(col, row, 0.4, -1.6);
        let p2 = view.gCenter(col, row, 0.4, -1.7);
        let x = new Const(p1.x);
        let y = new Linear(p1.y, p2.y);

        let img = imgs.get('effect/hourglass.svg');
        let rect1 = view.gImgScale(img, 0.35); // Scale
        let rect2 = view.gImgScale(img, 0.45);
        let w = new Linear(rect1.w, rect2.w);
        let h = new Linear(rect1.h, rect2.h);
        let alpha = new Linear(0.9, 0.2);
        return new DrawEffect(img, time, x, y, w, h, alpha);
    },
}

/**
 * ------------------------------------------------ Animation ------------------------------------------
 */

let obj_flag = true;
let db_flag = true;

function update() {
    let now = Date.now();

    // Effect
    efm.update(now);
}

function render() {

    if (obj_flag) {
        obj_ctx.clearRect(0, 0, WIDTH, HEIGHT);
        drawObj(obj_ctx, testView, testData);
        obj_flag = false;
    }


    if (db_flag) {
        db_ctx.clearRect(0, 0, WIDTH, HEIGHT);
        drawDB(db_ctx, testView, testData);
        db_flag = false;
    }

    // Effect
    ef_ctx.clearRect(0, 0, WIDTH, HEIGHT);
    efm.draw(ef_ctx);

}

function animloop() {
    requestAnimFrame(animloop);
    update();
    render();
}

/**
 * ------------------------------------------------ Main ------------------------------------------
 */

async function main() {
    await loadSound();
    await loadImg();
    drawBG(testView);
    animloop();
}

window.onload = main;


/**
 * ------------------------------------------------ Test ------------------------------------------
 */
document.body.onkeydown = function (e) {
    let role = testData.roles[0]
    switch (e.code) {
        case 'ArrowLeft':
            efm.add(ef.pace(testView, role.x, role.y))
            playSound(sounds.get('footstep.ogg'))
            role.x -= 1;
            obj_flag = true;
            break;
        case 'ArrowUp':
            efm.add(ef.pace(testView, role.x, role.y));
            playSound(sounds.get('footstep.ogg'))
            role.y -= 1;
            obj_flag = true;
            break;
        case 'ArrowRight':
            efm.add(ef.pace(testView, role.x, role.y));
            playSound(sounds.get('footstep.ogg'))
            role.x += 1;
            obj_flag = true;
            break;
        case 'ArrowDown':
            efm.add(ef.pace(testView, role.x, role.y));
            playSound(sounds.get('footstep.ogg'))
            role.y += 1;
            obj_flag = true;
            break;
        case 'KeyA':
            efm.add(ef.explosion(testView, role.x, role.y));
            playSound(sounds.get('hit.wav'))
            obj_flag = true;
            db_flag = true;
            break;
        case 'KeyB':
            efm.add(ef.build(testView, role.x, role.y));
            playSound(sounds.get('hammer.wav'))
            obj_flag = true;
            break;
        case 'KeyC':
            efm.add(ef.collect(testView, role.x, role.y));
            playSound(sounds.get('metalClick.ogg'))
            obj_flag = true;
            db_flag = true;
            break;
        case 'KeyD':
            efm.add(ef.upgrade(testView, role.x, role.y));
            db_flag = true;
            break;
        case 'KeyE':
            efm.add(ef.delay(testView, role.x, role.y, 3000));          
            break;
        case 'KeyH':
            efm.add(ef.hello(testView, role.x, role.y));
            break;
        case 'KeyT':
            efm.add(ef.trade(testView, role.x, role.y));
            db_flag = true;
            break;
        case 'KeyS':
            efm.add(ef.sleep(testView, role.x, role.y));
            db_flag = true;
            break;
        case 'KeyW':
            efm.add(ef.carry(testView, role.x, role.y));
            obj_flag = true;
            break;
        case 'KeyZ':
            efm.add(ef.forbid(testView, role.x, role.y));
            break;
        default:
            console.log(e.code);
    }
};