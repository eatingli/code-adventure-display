/**
 * View
 */
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const COL = 26;
const ROW = 18;

// Test Data
let view = new View(WIDTH, HEIGHT, COL, ROW, 2 * 5 * Math.PI / 360, [145, 10, 10, 10], [3, 3, 3, 3]);
let data = new TestDate(COL, ROW);
data.init();

/* Role */
let colors = [
    '#660077', '#CC0000', '#0000AA', '#009FCC', '#FF44AA', '#FFFF33',
    '#FFAA33', '#33FF33', '#444444', '#FF5511', '#FFB3FF', '#008800'
];


/**
 * Test Sound
 */
function playSound(sound) {
    sound.cloneNode().play(); // 在高速時能重疊撥放
}

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
            efm.add(ef.pace(testX, testY))
            playSound(sounds.get('footstep.ogg'))
            testX -= 1;
            break;
        case 'ArrowUp':
            efm.add(ef.pace(testX, testY));
            playSound(sounds.get('footstep.ogg'))
            testY -= 1;
            break;
        case 'ArrowRight':
            efm.add(ef.pace(testX, testY));
            playSound(sounds.get('footstep.ogg'))
            testX += 1;
            break;
        case 'ArrowDown':
            efm.add(ef.pace(testX, testY));
            playSound(sounds.get('footstep.ogg'))
            testY += 1;
            break;
        case 'KeyA':
            efm.add(ef.explosion(testX, testY));
            playSound(sounds.get('hit.wav'))
            break;
        case 'KeyB':
            efm.add(ef.build(testX, testY));
            playSound(sounds.get('hammer.wav'))
            break;
        case 'KeyC':
            efm.add(ef.collect(testX, testY));
            playSound(sounds.get('metalClick.ogg'))
            break;
        case 'KeyD':
            efm.add(ef.upgrade(testX, testY));
            break;
        case 'KeyE':
            efm.add(ef.delay(testX, testY, 3000));
            break;
        case 'KeyH':
            efm.add(ef.hello(testX, testY));
            break;
        case 'KeyT':
            efm.add(ef.trade(testX, testY));
            break;
        case 'KeyS':
            efm.add(ef.sleep(testX, testY));
            break;
        case 'KeyW':
            efm.add(ef.carry(testX, testY));
            break;
        case 'KeyZ':
            efm.add(ef.forbid(testX, testY));
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

    // Drawer 根據座標來排序物件
    let drawer = new Drawer();

    let drawRole = (col, row, color, bag) => {
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

    // Role
    for (let i = 0; i < 12; i++) {
        let role = data.roles[i]
        drawRole(role.x, role.y, colors[i], role.bag);
    }
    drawRole(testX, testY, colors[0], true)

    // Resource
    let drawResource = (x, y, c) => {
        let config = ResourceConfigs.get(c);
        let img = imgs.get(config.img);
        let rect = view.gImgRect(img, x, y, config.scale, config.h, config.v);

        let callback = () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, 0.9).draw(ctx);
        }
        drawer.append(x, y, 2, callback)
    }

    for (let r of data.resources) {
        drawResource(r.x, r.y, r.c)
    }

    // Monster
    let drawMonster = (x, y, c, life) => {
        let mConfig = MonsterConfigs.get(c);
        let img = imgs.get(mConfig.img);
        let rect = view.gImgRect(img, x, y, mConfig.scale, mConfig.h, mConfig.v);
        let vOffset = rect.y + view.gh * mConfig.lifeOffset;

        let alpha = 1.0
        let callback = () => {
            new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha).draw(ctx);
            new DrawLife(rect.x, vOffset, rect.w, life).draw(ctx);
        }
        drawer.append(x, y, 2, callback)
    }

    for (let m of data.monsters) {
        drawMonster(m.x, m.y, m.c, m.life / m.maxLife)
    }

    // Building
    function drawBuilding(col, row, c, level) {
        let alpha = 0.9;
        let config = BuildingConfigs.get(c);
        let img = imgs.get(config.img);
        let rect = view.gImgRect(img, col, row, config.scale, config.h, config.v);
        let drawImg = new DrawImg(img, rect.x, rect.y, rect.w, rect.h, alpha)
        new DrawBuilding(drawImg, level).draw(ctx);
    }

    for (let b of data.buildings) {
        let level = b.level + b.exp / b.maxExp;
        drawBuilding(b.x, b.y, b.c, level);
    }

    drawer.draw();

    // Dashboard
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
        new DrawRoleDashboard(rect, role.level, colors[i], life, energy, exp, role.money, role.equip).draw(db_ctx);
    }

    (() => {
        let storage = data.storage
        let rect = new Rect(5, 145, 105, 120);
        new DrawResourceDashboard(rect, storage.iron, storage.wood, storage.food,
            imgs.get('dashboard/iron.svg'), imgs.get('dashboard/wood.svg'), imgs.get('dashboard/bread.svg')).draw(db_ctx);
    })();

    (() => {
        let target = data.quest.tartget;
        let rect = new Rect(5, 270, 105, 95);
        let targetImg = imgs.get('monster/snail.svg');
        new DrawQuestDashboard(rect, targetImg).draw(db_ctx)
    })();

}