/**
 * 
 */
class MonsterConfig {
    constructor(img, scale, h, v, lifeOffset) {
        this.img = img;
        this.scale = scale;
        this.h = h;
        this.v = v;
        this.lifeOffset = lifeOffset;
    }
}

let MonsterConfigs = new Map();
MonsterConfigs.set('m1', new MonsterConfig('monster/snail.svg', 0.8, 0.02, -0.19, -0.16))
MonsterConfigs.set('m2', new MonsterConfig('monster/drop.svg', 0.8, 0.05, -0.2, -0.16))
MonsterConfigs.set('m3', new MonsterConfig('monster/bacteria.svg', 1.1, 0.03, -0.05, -0.14))
MonsterConfigs.set('m4', new MonsterConfig('monster/alien.svg', 0.95, 0.12, -0.12, -0.19))
MonsterConfigs.set('m5', new MonsterConfig('monster/flower.svg', 1.1, 0.05, -0.15, -0.18))
MonsterConfigs.set('m6', new MonsterConfig('monster/ghost.svg', 1.0, 0.03, -0.02, -0.19))
MonsterConfigs.set('m7', new MonsterConfig('monster/dinosaur.svg', 2.3, 0.17, 1.20, 0.85))
MonsterConfigs.set('m8', new MonsterConfig('monster/mummy.svg', 1.2, 0.07, -0.23, -0.32))
MonsterConfigs.set('m9', new MonsterConfig('monster/yeti.png', 2.6, 0.0, -0.1, -0.41))

/**
 * 
 */
class ResourceConfig {
    constructor(img, scale, h, v) {
        this.img = img;
        this.scale = scale;
        this.h = h;
        this.v = v;
    }
}

let ResourceConfigs = new Map();
ResourceConfigs.set('r1', new ResourceConfig('resource/rock.svg', 0.9, 0.01, -0.19, 0.9))
ResourceConfigs.set('r2-0', new ResourceConfig('resource/tree0.svg', 0.9, 0, -0.03, 0.9))
ResourceConfigs.set('r2-1', new ResourceConfig('resource/tree1.svg', 1.0, 0, -0.17, 0.9))
ResourceConfigs.set('r2-2', new ResourceConfig('resource/tree2.svg', 1.0, 0, -0.13, 0.9))
ResourceConfigs.set('r3', new ResourceConfig('resource/melon.svg', 0.9, 0, -0.15, 0.9))
ResourceConfigs.set('r4', new ResourceConfig('resource/sheep.svg', 1.0, 0, -0.03))
ResourceConfigs.set('r5', new ResourceConfig('resource/cabbage.svg', 2.6, -0.14, -0.16))

/**
 * 
 */
class BuildingConfig {
    constructor(img, scale, h, v) {
        this.img = img;
        this.scale = scale;
        this.h = h;
        this.v = v;
    }
}

let BuildingConfigs = new Map();
BuildingConfigs.set('b1', new BuildingConfig('building/house.svg', 2.5, 0, 0.1))
BuildingConfigs.set('b2', new BuildingConfig('building/warehouse.svg', 2.5, 0, 1.0))
BuildingConfigs.set('b3', new BuildingConfig('building/mine.svg', 2.5, 0.05, 0.75))
BuildingConfigs.set('b4', new BuildingConfig('building/farm.svg', 2.7, 0.05, 1.2))
BuildingConfigs.set('b5', new BuildingConfig('building/well.svg', 2.0, 0, 0.1))


/**
 * Effect
 */
let ef = {
    explosion: (col, row) => {
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
    pace: (col, row) => {
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
    collect: (col, row) => {
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
    build: (col, row) => {
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
    forbid: (col, row) => {
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
    carry: (col, row) => {
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
    sleep: (col, row) => {
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
    upgrade: (col, row) => {
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
    trade: (col, row) => {
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
    hello: (col, row) => {
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
    delay: (col, row, time) => {
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