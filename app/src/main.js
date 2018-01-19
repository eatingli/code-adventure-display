// requestAnimFrame
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Canvas
 */
// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

// Create
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
body.appendChild(canvas);
body.appendChild(ef_canvas);
body.appendChild(db_canvas);

/**
 * ------------------------------------------------ Effect ------------------------------------------
 */

let efm = new EffectManager();

//----------------------------------------------------------------------------------------------------

let lastTime = Date.now();

async function init() {
    await loadSound();
    await loadImg();
    initDraw();
}

function update() {
    let now = Date.now();
    let diffTime = now - lastTime;
    lastTime = now;

    // Effect
    efm.update(now);
}

// Render
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    db_ctx.clearRect(0, 0, canvas.width, canvas.height);
    ef_ctx.clearRect(0, 0, canvas.width, canvas.height);
    testDraw();

    // Effect
    efm.draw(ef_ctx);

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