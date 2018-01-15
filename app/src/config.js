/**
 * 
 */
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
MonsterConfigs.set('m7', new MonsterConfig('monster/dinosaur.svg', 2.3, 0.17, 0.97, 0.65))
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
BuildingConfigs.set('b4', new BuildingConfig('building/farm.svg', 2.7, 0, 0.9))
BuildingConfigs.set('b5', new BuildingConfig('building/well.svg', 2.0, 0, 0.1))