import * as fs from "fs";
import * as path from "path";
import {__root, DATA_NAME} from "../env";

export namespace Font {
    export interface IFont {
        path: string,
        name: string
    }

    export function buildFont(): HTMLStyleElement {
        const ele = document.createElement("style");
        fs.readdirSync(path.join(__root, DATA_NAME, "system", "fonts")).forEach((v) => {
            if (path.extname(v) === ".ttf") {
                ele.innerHTML += `
                    @font-face {
                        font-family: "${path.parse(v).name}";
                        src: url(../../${DATA_NAME}/system/fonts/${v});
                    }
                `;
            }
        });

        return ele;
    }

    export function listFonts(): IFont[] {
        let fonts: IFont[] = [];
        fs.readdirSync(path.join(__root, DATA_NAME, "system", "fonts")).forEach((v) => {
            if (path.extname(v) === ".ttf") {
                fonts.push({
                    path: path.join(__root, DATA_NAME, "system", "fonts", v),
                    name: path.parse(v).name
                });
            }
        });

        return fonts;
    }
}
