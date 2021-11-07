"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const fs = require("fs");
const env_1 = require("../env");
const path = require("path");
var Assets;
(function (Assets) {
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
    Assets.Sound = Sound;
    class Image {
        constructor(file) {
            this.file = file;
        }
        getPath() {
            return this.file;
        }
        static get(name) {
            let filePath = path.join(env_1.__root, env_1.DATA_NAME, "system", "img", name);
            if (fs.existsSync(filePath)) {
                return new this(filePath);
            }
            else {
                return false;
            }
        }
    }
    Assets.Image = Image;
})(Assets = exports.Assets || (exports.Assets = {}));
//# sourceMappingURL=Assets.js.map