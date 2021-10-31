"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const fs = require("fs");
const path = require("path");
class File {
    constructor(file) {
        let fp = path.parse(file);
        this.ext = fp.ext.substring(1);
        this.name = fp.name;
        this.dir = fp.dir;
    }
    static parse(file) {
        if (fs.existsSync(file)) {
            return new this(file);
        }
        return false;
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map