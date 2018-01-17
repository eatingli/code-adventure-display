/**
 * 載入所需資源，提供 Map進行存取
 * To-Do: 回傳map物件，而不是全域變數
 */

/**
 * Image src
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

imgSrcs.push('effect/explosion.svg');
imgSrcs.push('effect/pace.svg');
imgSrcs.push('effect/leaf.svg');
imgSrcs.push('effect/hammer.svg');
imgSrcs.push('effect/forbid.svg');
imgSrcs.push('effect/blacksmith.svg');
imgSrcs.push('effect/zzz.svg');
imgSrcs.push('effect/money.svg');
imgSrcs.push('effect/bag.svg');
imgSrcs.push('effect/hourglass.svg');
imgSrcs.push('effect/hello.svg');



/**
 * Audio Src
 */
let audioSrcs = [];
audioSrcs.push('metalClick.ogg')
audioSrcs.push('footstep.ogg')
audioSrcs.push('hammer.wav')
audioSrcs.push('hit.wav')

/* -------------------------------------------- Sound Load -------------------------------------------- */
let sounds = new Map();
let soundPath = 'sound/';

async function loadSound() {
    for (let src of audioSrcs) sounds.set(src, new Audio(soundPath + src))
}

/* -------------------------------------------- Image Load -------------------------------------------- */

// To-Do：不再使用全域變數
let imgs = new Map();

Image.prototype.load = function (src) {
    return new Promise((resolve, reject) => {
        this.src = src;
        this.onload = resolve;
    })
}

async function loadImg() {
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
}