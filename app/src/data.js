// function randomPoint(rect) {
//     let x = rect.x + Math.floor(Math.random() * rect.w);
//     let y = rect.y + Math.floor(Math.random() * rect.h);
//     return new Point(x, y);
// }

function randomInt(int) {
    return Math.floor(Math.random() * int);
}

//-----------------------------------------------------

/**
 * Display 首次啟動，從伺服器取得初始資料
 */

// 範圍內不重複的隨機座標
class TestPoint {
    constructor(c, r) {
        this.allPoints = [];
        for (let r = 0; r < 18; r++)
            for (let c = 0; c < 26; c++) this.allPoints.push(new Point(c, r))
    }

    random(area, num) {
        let rectPoints = this.allPoints.filter((p) => {
            for (let rect of area.excludes)
                if (p.x >= rect.x && p.y >= rect.y && p.x < rect.x + rect.w && p.y < rect.y + rect.h) return false;
            for (let rect of area.includes)
                if (p.x >= rect.x && p.y >= rect.y && p.x < rect.x + rect.w && p.y < rect.y + rect.h) return true;
            return false;
        });

        if (num > rectPoints.length) throw Error('Not Enough Space')

        let result = [];
        for (let i = 0; i < num; i++) {
            let mask = randomInt(rectPoints.length)
            let p = rectPoints[mask];
            result.push(p)
            rectPoints.splice(mask, 1);
            this.allPoints.splice(this.allPoints.indexOf(p), 1);
        }
        return result;
    }
}

class TestDate {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.id = 0;
        this.roles = [];
        this.monsters = [];
        this.resources = [];
        this.buildings = [];
        this.storage = {
            iron: randomInt(1000),
            wood: randomInt(1000),
            food: randomInt(1000)
        };
        this.quest = {
            tartget: 1
        }
    }

    addRole() {
        let x = randomInt(this.col)
        let y = randomInt(this.row)
        let level = 1 + randomInt(30);
        let maxLife = 20;
        let life = randomInt(maxLife);
        let maxEnergy = 20;
        let energy = randomInt(maxEnergy);
        let maxExp = 20;
        let exp = randomInt(maxExp);
        let money = randomInt(1000)
        let equip = [randomInt(6), randomInt(6), randomInt(6), randomInt(6), randomInt(6)];
        let bag = Math.random() > 0.5;
        let rest = 0; // 待確認：時間校準問題
        this.roles.push({
            id: this.id++,
            x: x,
            y: y,
            level: level,
            maxLife: maxLife,
            life: life,
            maxEnergy: maxEnergy,
            energy: energy,
            maxExp: maxExp,
            exp: exp,
            money: money,
            equip: equip,
            bag: bag,
            rest: rest, 
        })
    }

    addMonster(c, p) {
        let maxLife = 20;
        let life = randomInt(maxLife);
        this.monsters.push({
            id: this.id++,
            c: c,
            x: p.x,
            y: p.y,
            maxLife: maxLife,
            life: life,
        })
    }

    addResource(c, p) {
        this.resources.push({
            id: this.id++,
            c: c,
            x: p.x,
            y: p.y,
        })
    }

    addBuilding(c, p) {
        let level = randomInt(6);
        let maxExp = 20;
        let exp = randomInt(maxExp);
        let building = {
            id: this.id++,
            x: p.x,
            y: p.y,
            c: c,
            level: level,
            maxExp: maxExp,
            exp: exp
        }
        this.buildings.push(building)
    }

    init() {

        let points = new TestPoint(this.col, this.row)

        /* Area */
        let a1 = new Area([new Rect(1, 0, 6, 5)], [new Rect(1, 1, 3, 2)]);
        let a2 = new Area([new Rect(8, 0, 5, 5)], []);
        let a3 = new Area([new Rect(14, 0, 5, 5)], []);
        let a4 = new Area([new Rect(20, 0, 6, 5)], [new Rect(21, 1, 3, 3)]);
        let a6 = new Area([new Rect(1, 6, 6, 4)], []);
        let a7 = new Area([new Rect(8, 6, 5, 4)], [])
        let a8 = new Area([new Rect(14, 6, 5, 5)], [])
        let a9 = new Area([new Rect(20, 6, 6, 4)], [])
        let a10 = new Area([new Rect(0, 11, 10, 7)], [])
        let a11 = new Area([new Rect(10, 11, 5, 7)], [])
        let a12 = new Area([new Rect(16, 12, 4, 5)], [])
        let a13 = new Area([new Rect(21, 11, 5, 6)], [])

        /* Role */
        for (let i = 0; i < 12; i++) this.addRole();

        /* Resources */
        let r1 = points.random(a4, 10)
        let r2_0 = points.random(a13, 5)
        let r2_1 = points.random(a13, 5)
        let r2_2 = points.random(a13, 10)
        let r3 = points.random(a1, 13)
        let r4 = points.random(a11, 12)
        let r5 = points.random(a8, 12)

        r1.forEach((p) => this.addResource(1, p))
        r2_0.forEach((p) => this.addResource(20, p))
        r2_1.forEach((p) => this.addResource(21, p))
        r2_2.forEach((p) => this.addResource(22, p))
        r3.forEach((p) => this.addResource(3, p))
        r4.forEach((p) => this.addResource(4, p))
        r5.forEach((p) => this.addResource(5, p))

        /* Monster */
        let m1 = points.random(a6, 10)
        let m2 = points.random(a7, 9)
        let m3 = points.random(a12, 8)
        let m4 = points.random(a2, 8)
        let m5 = points.random(a9, 8)
        let m6 = points.random(a3, 8)
        let m7 = new Point(2, 2)
        let m8 = new Point(25, 17)
        let m9 = new Point(22, 2)

        m1.forEach((p) => this.addMonster(1, p))
        m2.forEach((p) => this.addMonster(2, p))
        m3.forEach((p) => this.addMonster(3, p))
        m4.forEach((p) => this.addMonster(4, p))
        m5.forEach((p) => this.addMonster(5, p))
        m6.forEach((p) => this.addMonster(6, p))
        this.addMonster(7, m7)
        this.addMonster(8, m8)
        this.addMonster(9, m9)

        /* Building */
        this.addBuilding(1, new Point(1, 12))
        this.addBuilding(2, new Point(1, 16))
        this.addBuilding(3, new Point(5, 16))
        this.addBuilding(4, new Point(5, 12))
        this.addBuilding(5, new Point(8, 14))
    }
}

// 裝所有資料
// 提供介面，讓伺服器資料輸入
// 提供介面，讓繪圖取得所需資料