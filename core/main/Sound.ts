import * as fs from "fs";
import {__root, DATA_NAME} from "../env";
import * as path from "path";

export class Sound {
    private file: string;
    private audio: HTMLAudioElement;


    private constructor(file: string) {
        this.file = file;
        this.audio = new Audio(this.file);
    }

    public play() {
        this.audio.play();
    }

    public static get(name: string): Sound | false {
        let filePath = path.join(__root, DATA_NAME, "system", "sounds", name)

        if (fs.existsSync(filePath)) {
            return new this(filePath);
        } else {
            return false
        }
    }
}
