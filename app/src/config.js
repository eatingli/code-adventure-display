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
MonsterConfigs.set(1, new MonsterConfig('monster/snail.svg', 0.8, 0.02, -0.19, -0.16))
MonsterConfigs.set(2, new MonsterConfig('monster/drop.svg', 0.8, 0.05, -0.2, -0.16))
MonsterConfigs.set(3, new MonsterConfig('monster/bacteria.svg', 1.1, 0.03, -0.05, -0.14))
MonsterConfigs.set(4, new MonsterConfig('monster/alien.svg', 0.95, 0.12, -0.12, -0.19))
MonsterConfigs.set(5, new MonsterConfig('monster/flower.svg', 1.1, 0.05, -0.15, -0.18))
MonsterConfigs.set(6, new MonsterConfig('monster/ghost.svg', 1.0, 0.03, -0.02, -0.19))
MonsterConfigs.set(7, new MonsterConfig('monster/dinosaur.svg', 2.3, 0.17, 1.20, 0.85))
MonsterConfigs.set(8, new MonsterConfig('monster/mummy.svg', 1.2, 0.07, -0.23, -0.32))
MonsterConfigs.set(9, new MonsterConfig('monster/yeti.png', 2.6, 0.0, -0.1, -0.41))

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
ResourceConfigs.set(1, new ResourceConfig('resource/rock.svg', 0.9, 0.01, -0.19, 0.9))
ResourceConfigs.set(20, new ResourceConfig('resource/tree0.svg', 0.9, 0, -0.03, 0.9))
ResourceConfigs.set(21, new ResourceConfig('resource/tree1.svg', 1.0, 0, -0.17, 0.9))
ResourceConfigs.set(22, new ResourceConfig('resource/tree2.svg', 1.0, 0, -0.13, 0.9))
ResourceConfigs.set(3, new ResourceConfig('resource/melon.svg', 0.9, 0, -0.15, 0.9))
ResourceConfigs.set(4, new ResourceConfig('resource/sheep.svg', 1.0, 0, -0.03))
ResourceConfigs.set(5, new ResourceConfig('resource/cabbage.svg', 2.6, -0.14, -0.16))

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
BuildingConfigs.set(1, new BuildingConfig('building/house.svg', 2.5, 0, 0.1))
BuildingConfigs.set(2, new BuildingConfig('building/warehouse.svg', 2.5, 0, 1.0))
BuildingConfigs.set(3, new BuildingConfig('building/mine.svg', 2.5, 0.05, 0.75))
BuildingConfigs.set(4, new BuildingConfig('building/farm.svg', 2.7, 0.05, 1.2))
BuildingConfigs.set(5, new BuildingConfig('building/well.svg', 2.0, 0, 0.1))