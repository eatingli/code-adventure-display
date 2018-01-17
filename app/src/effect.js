class Const {
    constructor(init) {
        this.value = init;
    }

    update(rate) {
        return;
    }
}

class Linear {
    constructor(init, end) {
        this.init = init;
        this.end = end;
        this.value = init;
    }

    update(rate) {
        this.value = this.init + (this.end - this.init) * rate;
    }
}

class DrawEffect {
    constructor(img, time, x, y, w, h, alpha) {
        this.img = img;
        this.time = time;
        this.initTime = Date.now();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        // this.scale = scale;
        this.alpha = alpha;
    }

    // 判斷逾時
    isValid(now) {
        let diff = now - this.initTime;
        return diff <= this.time
    }

    update(now) {
        let diff = now - this.initTime;
        let rate = diff / this.time;

        this.x.update(rate)
        this.y.update(rate)
        this.w.update(rate)
        this.h.update(rate)
        // this.scale.update(rate)
        this.alpha.update(rate)
    }

    draw(ctx) {
        let w = this.w.value;
        let h = this.h.value;
        let x = this.x.value - w * 0.5;
        let y = this.y.value - h * 0.5;

        ctx.save();
        ctx.globalAlpha = this.alpha.value;
        ctx.drawImage(this.img, x, y, w, h)
        ctx.restore()
    }
}

class EffectManager {
    constructor() {
        this.effects = [];
    }

    add(effect) {
        this.effects.push(effect)
    }

    remove(effect) {
        let index = this.effects.indexOf(effect)
        this.effects.splice(index, 1);
    }

    update(now) {
        // 有效
        for (let e of this.effects) {
            let valid = e.isValid(now);
            if (!valid) this.remove(e);
        }
        // 更新
        for (let e of this.effects) {
            e.update(now);
        }
    }

    draw(ctx) {
        for (let e of this.effects) {
            e.draw(ctx)
        }
    }
}