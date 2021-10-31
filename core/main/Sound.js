"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sound = void 0;
const fs = require("fs");
const env_1 = require("../env");
const path = require("path");
class Sound {
    constructor(file) {
        this.file = file;
        this.audio = new Audio(this.file);
    }
    play() {
        this.audio.play();
    }
    static get(name) {
        let filePath = path.join(env_1.__root, env_1.DATA_NAME, "system", "sounds", name);
        if (fs.existsSync(filePath)) {
            return new this(filePath);
        }
        else {
            return false;
        }
    }
}
exports.Sound = Sound;
//# sourceMappingURL=Sound.js.map