Image.prototype.load = function (src) {
    return new Promise((resolve, reject) => {
        this.src = src;
        this.onload = resolve;
    })
}

Audio.prototype.load = function (src) {
    return new Promise((resolve, reject) => {
        this.src = src;
        this.onload = resolve;
    })
}

class Media {
    constructor(imgSrcs, soundSrcs) {
        this.imgPath = 'img/';
        this.imgSrcs = imgSrcs;
        this.imgs = new Map();

        this.soundPath = 'sound/';
        this.soundSrcs = soundSrcs;
        this.sounds = new Map();

        this.loadProgress = 0;
        this.targetProgress = this.imgSrcs.length + this.soundSrcs.length;
    }

    // private
    async loadImgs() {
        for (let src of this.imgSrcs) {
            let img = new Image();
            await img.load(this.imgPath + src);
            this.imgs.set(src, img);

            this.loadProgress++;
            console.log('Load Success: ' + src);
        }
    }

    // private
    async loadSounds() {
        for (let src of this.soundSrcs) {
            let sound = new Audio(this.soundPath + src);
            // await sound.load();
            // sound.onload(() => {
            //     this.loadProgress++;
            // });
            this.sounds.set(src, sound);

            this.loadProgress++;
            console.log('Load Success: ' + src);
        }
    }

    async init() {
        await this.loadImgs();
        await this.loadSounds();
    }
}



(async() => {
    let test = new Media(['dashboard/iron.svg', 'dashboard/wood.svg'], ['metalClick.ogg', 'footstep00.ogg']);
    await test.init();
    console.log('init');
    setInterval(() => {
        // audio2.cloneNode().play(); // 在高速時能重疊撥放
        test.sounds.get('footstep00.ogg').cloneNode().play();
    }, 500);
})();

