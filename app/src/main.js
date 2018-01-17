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