import * as fs from "fs";
import * as path from "path";
import {ParsedPath} from "path";

export class File {
    public readonly ext: string;
    public readonly name: string;
    public readonly dir: string;

    private constructor(file: string) {
        let fp: ParsedPath = path.parse(file);

        this.ext = fp.ext.substring(1);
        this.name = fp.name;
        this.dir = fp.dir

    }

    public static parse(file: string): File | false {
        if (fs.existsSync(file)) {
            return new this(file);
        }
        return false;
    }
}
