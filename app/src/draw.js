/**
 * Text Tool
 */
function dynamicFitTextOnCanvas(ctx, text, fontface, desiredWidth) {
    let startFontsize = 200;
    return measureTextBinary(ctx, text, 0, startFontsize, fontface, desiredWidth)
}

function measureTextBinary(ctx, text, min, max, fontface, desiredWidth) {
    if (max - min < 1) {
        return Math.floor(min)
    }
    var cur = min + (max - min) / 2
    ctx.font = `${cur}px ${fontface}`
    var measureWidth = ctx.measureText(text).width
    if (measureWidth > desiredWidth) {
        return measureTextBinary(ctx, text, min, cur, fontface, desiredWidth)
    } else {
        return measureTextBinary(ctx, text, cur, max, fontface, desiredWidth)
    }
}

//圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w > 2 * r) r = w / 2;
    if (h > 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    // this.arcTo(x+r, y);
    this.closePath();
    return this;
}

class DrawBackground {
    constructor(img, width, height) {
        this.img = img;
        this.width = width;
        this.height = height;
    }

    update(diff) {}

    draw(ctx) {
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.drawImage(this.img, -5, -5, this.img.width + 5, this.img.height + 5);
        ctx.fillRect(0, 0, this.width, this.height)
    }
}

class DrawGrid {
    constructor(lt, lb, gw) {
        this.lt = lt;
        this.lb = lb;
        this.gw = gw;
    }

    update(diff) {

    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.lt.x + this.gw, this.lt.y);
        ctx.lineTo(this.lt.x, this.lt.y);
        ctx.lineTo(this.lb.x, this.lb.y);
        ctx.lineTo(this.lb.x + this.gw, this.lb.y);
        ctx.closePath();
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "#111111";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgba(50, 50, 50, 0.25)";
        ctx.fill();
        ctx.restore()
    }
}

class DrawImg {
    constructor(img, x, y, w, h, a) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w || img.width;
        this.h = h || img.height;
        this.a = a;
    }

    update(diff) {

    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.a;
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        ctx.restore()
    }
}

class DrawLife {
    constructor(x, y, w, life) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.life = life
    }

    update(diff) {

    }

    draw(ctx) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(this.x, this.y, this.w * this.life, 4);
        ctx.strokeRect(this.x, this.y, this.w, 4);
    }
}

class DrawRole {
    // 調用 Draw img
}

class DrawBuilding {

    constructor(drawImg, level) {

        this.maxLevel = 5;
        this.drawImg = drawImg;

        if (level > this.maxLevel) level = this.maxLevel;
        this.lv = Math.floor(level);
        this.exp = level - this.lv;
    }

    update() {}

    draw(ctx) {

        // img
        this.drawImg.draw(ctx);

        let space = 5;
        let h = 5;
        let width = this.drawImg.w;
        let rx = this.drawImg.x;
        let ry = this.drawImg.y;

        // lv
        ctx.fillStyle = "rgba(0, 180, 255, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";

        let w = (width - (this.maxLevel - 1) * space) / this.maxLevel;
        for (let i = 0; i < this.maxLevel; i++) {
            let x = rx + (w + space) * i;
            let y = ry;
            if (i < this.lv) ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }

        // exp
        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        if (true) {
            let x = rx;
            let y = ry + 10;
            let w = width * this.exp;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, width, h);
        }
    }
}

class DrawRoleColerIcon {
    constructor(rect, color) {
        this.rect = rect;
        this.color = color;
    }

    update(diff) {}

    draw(ctx) {
        let rect = this.rect;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
}

class DrawRoleDashboard {
    constructor(rect, lv, color, life, energy, exp, money, equips) {
        this.rect = rect;

        this.lv = lv;
        this.color = color;
        this.life = life;
        this.energy = energy;
        this.exp = exp;
        this.money = money;
        this.equips = equips;
    }

    update() {}

    draw(ctx) {
        let x = this.rect.x;
        let y = this.rect.y;
        let w = this.rect.w;
        let h = this.rect.h;

        // 外框
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "rgba(30, 60, 100, 1)";
        ctx.strokeRect(x, y, w, h);

        // 等級
        ctx.save();
        let levelTxt = `${this.lv}`
        dynamicFitTextOnCanvas(ctx, '99', 'Comic Sans MS', w * 0.14);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillText(levelTxt, x + w * 0.08, y + h * 0.38);
        ctx.strokeText(levelTxt, x + w * 0.08, y + h * 0.38);
        ctx.restore();

        // 識別色
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(x + w * 0.035, y + h * 0.70, w * 0.09, h * 0.22);
        ctx.strokeRect(x + w * 0.035, y + h * 0.70, w * 0.09, h * 0.22);

        // 生命、體力、經驗 條
        let xOffset = x + w * 0.18;
        let barWidth = w * 0.39;
        let barHeight = h * 0.2;
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(xOffset, y + h * 0.1, barWidth * this.life, barHeight);
        ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
        ctx.fillRect(xOffset, y + h * 0.4, barWidth * this.energy, barHeight);
        ctx.fillStyle = "rgba(200, 255, 0, 0.3)";
        ctx.fillRect(xOffset, y + h * 0.7, barWidth * this.energy, barHeight);

        ctx.strokeStyle = "rgba(230, 230, 230, 0.8)";
        ctx.strokeRect(xOffset, y + h * 0.1, barWidth, barHeight);
        ctx.strokeRect(xOffset, y + h * 0.4, barWidth, barHeight);
        ctx.strokeRect(xOffset, y + h * 0.7, barWidth, barHeight);

        // Money
        let tmp = `     ${this.money}`;
        let moneyText = '$' + tmp.substr(tmp.length - 4);
        dynamicFitTextOnCanvas(ctx, 'E', 'Comic Sans MS', w * 0.055);
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        moneyText.split('').forEach((t, index) => {
            ctx.fillText(t, x + w * 0.6 + index * w * 0.08, y + h * 0.30);
            ctx.strokeText(t, x + w * 0.6 + index * w * 0.08, y + h * 0.30);
        });

        // Equip
        let levels = ['E', 'D', 'C', 'B', 'A', 'S'];
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        this.equips.map(e => levels[e]).forEach((eLevel, index) => {
            ctx.fillText(eLevel, x + w * 0.6 + index * w * 0.08, y + h * 0.77);
            ctx.strokeText(eLevel, x + w * 0.6 + index * w * 0.08, y + h * 0.77);

        });
    }
}

class DrawResourceDashboard {
    constructor(rect, iron, wood, food, ironImg, woodImg, foodImg) {
        this.rect = rect;
        this.iron = iron;
        this.wood = wood;
        this.food = food;
        this.ironImg = ironImg;
        this.woodImg = woodImg;
        this.foodImg = foodImg;
    }

    update(diff) {}

    draw(ctx) {
        let x = this.rect.x;
        let y = this.rect.y;
        let w = this.rect.w;
        let h = this.rect.h;

        // 外框
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "rgba(30, 60, 100, 1)";
        ctx.strokeRect(x, y, w, h);

        // 圖示 to do imgs....
        ctx.drawImage(this.ironImg, x - 0, y + 8, 40, 34);
        ctx.drawImage(this.woodImg, x - 1, y + 46, 40, 38);
        ctx.drawImage(this.foodImg, x - 3, y + 83, 44, 42);

        // 數量
        let ironTxt = `${this.iron}`;
        let woodTxt = `${this.wood}`;
        let foodTxt = `${this.food}`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        dynamicFitTextOnCanvas(ctx, '5', 'Comic Sans MS', 20);
        ctx.fillText(ironTxt, x + 45 + (3 - ironTxt.length) * 16, y + 10);
        ctx.strokeText(ironTxt, x + 45 + (3 - ironTxt.length) * 16, y + 10);
        ctx.fillText(woodTxt, x + 45 + (3 - woodTxt.length) * 16, y + 49);
        ctx.strokeText(woodTxt, x + 45 + (3 - woodTxt.length) * 16, y + 49);
        ctx.fillText(foodTxt, x + 45 + (3 - foodTxt.length) * 16, y + 87);
        ctx.strokeText(foodTxt, x + 45 + (3 - foodTxt.length) * 16, y + 87);
    }
}

class DrawQuestDashboard {
    constructor(rect, targetImg) {
        this.rect = rect;
        this.targetImg = targetImg;
    }

    update(diff) {}

    draw(ctx) {
        let x = this.rect.x;
        let y = this.rect.y;
        let w = this.rect.w;
        let h = this.rect.h;

        // 外框
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "rgba(30, 60, 100, 1)";
        ctx.strokeRect(x, y, w, h);

        // Quest Text
        let questTxt = 'Quest';
        dynamicFitTextOnCanvas(ctx, questTxt, 'Comic Sans MS', w * 0.7);
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillText(questTxt, x + w * 0.15, y + 2);
        ctx.strokeText(questTxt, x + w * 0.15, y + 2);

        // Quest Target
        let imgWidth = 65;
        let imgHeight = this.targetImg.height * imgWidth / this.targetImg.width;
        ctx.drawImage(this.targetImg, x + (w - imgWidth) * 0.5, y + 45, imgWidth, imgHeight);
    }
}