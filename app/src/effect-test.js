window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let canvas = document.createElement("canvas")
let ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

let body = document.getElementsByTagName('body')[0];
body.appendChild(canvas);

let img = new Image()
img.src = 'img/effect/explosion.svg';
img.onload = () => {
    console.log('onload')
}

// class EffectManager{
//     constructor(){
//     }
// }

class Linear {
    constructor(init, end) {
        this.init = init;
        this.end = end;
        this.value = init;
    }

    update(rate) {
        this.value = this.init + (this.end - this.init) * rate;
        return true;
    }
}

class Effect {
    constructor(img, time) {
        this.img = img;
        this.time = time;
        this.initTime = Date.now();
        this.x = new Linear(100, 100);
        this.y = new Linear(100, 60);
        this.scale = new Linear(0.1, 0.13);
        this.opacity = new Linear(1.0, 0.0);
    }

    update(now) {
        let diff = now - this.initTime;
        if (diff > this.time) return false;
        let rate = diff / this.time;

        this.x.update(rate)
        this.y.update(rate)
        this.scale.update(rate)
        this.opacity.update(rate)
        return true;
    }

    draw(ctx) {
        let width = this.img.width * this.scale.value;
        let height = this.img.height * this.scale.value;
        let x = this.x.value - width * 0.5;
        let y = this.y.value - height * 0.5;

        ctx.save();
        ctx.globalAlpha = this.opacity.value;
        ctx.drawImage(this.img, x, y, width, height)
        ctx.restore()
    }
}

let effects = [];

document.body.onkeydown = function (e) {
    switch (e.code) {
        case 'ArrowLeft':
            break;
        case 'ArrowUp':
            break;
        case 'ArrowRight':
            break;
        case 'ArrowDown':
            break;
        case 'KeyA':
            effects.push(new Effect(img, 1000));
            break;
        default:
            console.log(e.code);
    }
};

function init() {
    effects.push(new Effect(img, 1000));
    effects.push(new Effect(img, 2000));
    effects.push(new Effect(img, 3000));
}

function update() {
    let now = Date.now();
    for (let e of effects) {
        let valid = e.update(now);
        if (!valid) effects.splice(effects.indexOf(e), 1); // 逾時
    }
}

function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let e of effects) e.draw(ctx)
}

function animloop() {
    requestAnimFrame(animloop);
    update();
    render();
}


function main() {
    init();
    animloop();
}

window.onload = main;