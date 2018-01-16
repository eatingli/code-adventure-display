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

// Audio
let soundPath = 'sound/';
let sounds = new Map();
sounds.set('metalClick.ogg', new Audio(soundPath + 'metalClick.ogg'))
sounds.set('footstep00.ogg', new Audio(soundPath + 'footstep00.ogg'))


/* -------------------------------------------- Sound -------------------------------------------- */

function playSound(sound) {
    sounds.get(sound).cloneNode().play(); // 在高速時能重疊撥放
}


//----------------------------------------------------------------------------

/* Image */
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


/**
 * ------------------------------------------------ Effect ------------------------------------------
 */


//----------------------------------------------------------------------------------------------------

let lastTime = Date.now();

async function init() {
    await loadImg();
    initDraw();
}

function update() {
    let nowTime = Date.now();
    let diffTime = nowTime - lastTime;
    lastTime = nowTime;
}

// Render
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    db_ctx.clearRect(0, 0, canvas.width, canvas.height);
    testDraw();
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