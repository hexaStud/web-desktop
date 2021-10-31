"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Font = void 0;
const fs = require("fs");
const path = require("path");
const env_1 = require("../env");
var Font;
(function (Font) {
    function buildFont() {
        const ele = document.createElement("style");
        fs.readdirSync(path.join(env_1.__root, env_1.DATA_NAME, "system", "fonts")).forEach((v) => {
            if (path.extname(v) === ".ttf") {
                ele.innerHTML += `
                    @font-face {
                        font-family: "${path.parse(v).name}";
                        src: url(../../${env_1.DATA_NAME}/system/fonts/${v});
                    }
                `;
            }
        });
        return ele;
    }
    Font.buildFont = buildFont;
    function listFonts() {
        let fonts = [];
        fs.readdirSync(path.join(env_1.__root, env_1.DATA_NAME, "system", "fonts")).forEach((v) => {
            if (path.extname(v) === ".ttf") {
                fonts.push({
                    path: path.join(env_1.__root, env_1.DATA_NAME, "system", "fonts", v),
                    name: path.parse(v).name
                });
            }
        });
        return fonts;
    }
    Font.listFonts = listFonts;
})(Font = exports.Font || (exports.Font = {}));
//# sourceMappingURL=font.js.map