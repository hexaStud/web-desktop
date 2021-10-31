import * as path from "path";
import {__root, DATA_NAME} from "../env";
import * as fs from "fs";

export class Image {
    private file: string;


    private constructor(file: string) {
        this.file = file;
    }

    public getPath() {
        return this.file;
    }


    public static get(name: string): Image | false {
        let filePath = path.join(__root, DATA_NAME, "system", "img", name)

        if (fs.existsSync(filePath)) {
            return new this(filePath);
        } else {
            return false
        }
    }
}
