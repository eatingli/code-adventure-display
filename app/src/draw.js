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


function drawBG(ctx, img) {
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.drawImage(img, -5, -5, img.width + 5, img.height + 5);
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
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

class Drawable {

    constructor() {

    }

    update() {

    }

    draw(ctx, view) {

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

// class RoleColerIcon {
//     constructor() {
//         color
//     }

//     update(diff) {}

//     draw(ctx) {
//         let colorX = bag ? rect.x + rect.w * 0.25 : rect.x + rect.w * 0.5;
//         let colorY = rect.y - rect.h * 0.2;
//         ctx.beginPath();
//         ctx.arc(colorX, colorY, rect.w * 0.22, 0, 2 * Math.PI);
//         ctx.closePath();
//         ctx.fillStyle = color;
//         ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
//         ctx.stroke();
//         ctx.fill();
//     }
// }

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
        ctx.fillStyle = "rgba(00, 180, 255, 0.8)";
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
        if (this.exp > 0) {
            let x = rx;
            let y = ry + 10;
            let w = width * this.exp;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, width, h);
        }
    }
}


function drawRoleColorIcon(ctx, rect, color, bag) {

    // Color Icon
    let colorX = bag ? rect.x + rect.w * 0.25 : rect.x + rect.w * 0.5;
    let colorY = rect.y - rect.h * 0.2;
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";

    // ctx.beginPath();
    // ctx.arc(colorX, colorY, rect.w * 0.22, 0, 2 * Math.PI);
    // ctx.closePath();
    // ctx.stroke();
    // ctx.fill();
    let width = rect.w * 0.44;
    let height = rect.w * 0.33;
    let x = rect.x + (rect.w - width) * 0.5;
    let y = rect.y - rect.h * 0.27
    if (bag) x -= width * 0.6
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
}

// drawRoleDashboard
function drawRoleDashboard(ctx, row, col, level, color, life, energy, exp, money, equips) {

    let space = 5;
    let width = (canvas.width - space * 7) / 6;
    let height = 65;

    let x = space + (space + width) * col;
    let y = space + (space + height) * row;

    // 外框
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(30, 60, 100, 1)";
    ctx.strokeRect(x, y, width, height);

    // 等級
    ctx.save();
    let levelTxt = `${level}`
    dynamicFitTextOnCanvas(ctx, '99', 'Comic Sans MS', width * 0.14);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(levelTxt, x + width * 0.08, y + height * 0.38);
    ctx.strokeText(levelTxt, x + width * 0.08, y + height * 0.38);
    ctx.restore();

    // 識別色
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(x + width * 0.03, y + height * 0.70, width * 0.09, height * 0.22);
    ctx.strokeRect(x + width * 0.03, y + height * 0.70, width * 0.09, height * 0.22);
    // ctx.roundRect(x + width * 0.03, y + height * 0.76, width * 0.09, height * 0.15, 1);
    // ctx.fill();

    // 生命、體力、經驗 條
    let xOffset = x + width * 0.17;
    let barWidth = width * 0.4;
    let barHeight = height * 0.2;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(xOffset, y + height * 0.1, barWidth * life, barHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(xOffset, y + height * 0.4, barWidth * energy, barHeight);
    ctx.fillStyle = "rgba(200, 255, 0, 0.5)";
    ctx.fillRect(xOffset, y + height * 0.7, barWidth * energy, barHeight);

    ctx.strokeStyle = "rgba(230, 230, 230, 0.8)";
    ctx.strokeRect(xOffset, y + height * 0.1, barWidth, barHeight);
    ctx.strokeRect(xOffset, y + height * 0.4, barWidth, barHeight);
    ctx.strokeRect(xOffset, y + height * 0.7, barWidth, barHeight);

    // Money
    let tmp = `     ${money}`;
    let moneyText = '$' + tmp.substr(tmp.length - 4);
    dynamicFitTextOnCanvas(ctx, 'E', 'Comic Sans MS', width * 0.055);
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    moneyText.split('').forEach((t, index) => {
        ctx.fillText(t, x + width * 0.6 + index * width * 0.08, y + height * 0.30);
        ctx.strokeText(t, x + width * 0.6 + index * width * 0.08, y + height * 0.30);
    });

    // Equip
    let levels = ['E', 'D', 'C', 'B', 'A', 'S'];
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    equips.map(e => levels[e]).forEach((eLevel, index) => {
        ctx.fillText(eLevel, x + width * 0.6 + index * width * 0.08, y + height * 0.77);
        ctx.strokeText(eLevel, x + width * 0.6 + index * width * 0.08, y + height * 0.77);

    });

}

// drawResourceDashboard
function drawResourceDashboard(ctx, iron, wood, food) {
    // let x = canvas.width * 0.01;
    // let y = canvas.height * 0.4;
    let x = 5;
    let y = 145;
    let width = 105;
    let height = 120;

    // 外框
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(30, 60, 100, 1)";
    ctx.strokeRect(x, y, width, height);

    // 圖示
    let imgWidth = 40;
    let imgHeight = 40;
    ctx.drawImage(imgs.get('dashboard/iron.svg'), x - 0, y + 8, 40, 34);
    ctx.drawImage(imgs.get('dashboard/wood.svg'), x - 1, y + 46, 40, 38);
    ctx.drawImage(imgs.get('dashboard/bread.svg'), x - 3, y + 83, 44, 42);

    // 數量
    let ironTxt = `${iron}`;
    let woodTxt = `${wood}`;
    let foodTxt = `${food}`;
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

// drawQuestDashboard
function drawQuestDashboard(ctx, targetImg) {

    let x = 5;
    let y = 270;
    let width = 105;
    let height = 95;

    // 外框
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(30, 60, 100, 1)";
    ctx.strokeRect(x, y, width, height);

    // Quest Text
    let questTxt = 'Quest';
    dynamicFitTextOnCanvas(ctx, questTxt, 'Comic Sans MS', width * 0.7);
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "rgba(255, 200, 100, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(questTxt, x + width * 0.15, y + 2);
    ctx.strokeText(questTxt, x + width * 0.15, y + 2);

    // Quest Target
    let imgWidth = 65;
    let imgHeight = targetImg.height * imgWidth / targetImg.width;
    ctx.drawImage(targetImg, x + (width - imgWidth) * 0.5, y + 45, imgWidth, imgHeight);
}