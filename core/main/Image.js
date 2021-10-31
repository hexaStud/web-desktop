"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const path = require("path");
const env_1 = require("../env");
const fs = require("fs");
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
exports.Image = Image;
//# sourceMappingURL=Image.js.map