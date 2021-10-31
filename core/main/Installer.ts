import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {Crypto} from "code-database";
import {USER_PSW} from "../env";
import {User} from "./User";

export class Installer {
    private static cbs: Array<{
        (msg: string): void
    }> = [];

    public static onMessage(cb: {
        (msg: string): void
    }) {
        this.cbs.push(cb);
    }

    public static send(msg: string) {
        for (const cb of this.cbs) {
            cb(msg);
        }
    }

    public static install(dir: string) {
        this.send("Create data structure...");
        fs.mkdirSync(dir);
        [
            "users",
            "system",
            "system/sounds",
            "system/fonts",
            "system/programs",
            "system/config",
            "system/config/background",
        ].forEach((value) => {
            this.send(`Create ${value}`);
            fs.mkdirSync(path.join(dir, value));
        });

        [
            {
                p: "system/config/user",
                v: Crypto.encode("[]", USER_PSW)
            }
        ].forEach((value) => {
            this.send(`Write ${value.p}`);
            fs.writeFileSync(path.join(dir, value.p), value.v);
        });

        this.send("Create first user");
        User.create(os.userInfo().username, true, (msg) => {
            this.send(msg);
        });
    }
}
