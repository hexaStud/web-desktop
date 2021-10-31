"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Installer = void 0;
const fs = require("fs");
const path = require("path");
const os = require("os");
const code_database_1 = require("code-database");
const env_1 = require("../env");
const User_1 = require("./User");
class Installer {
    static onMessage(cb) {
        this.cbs.push(cb);
    }
    static send(msg) {
        for (const cb of this.cbs) {
            cb(msg);
        }
    }
    static install(dir) {
        this.send("Create data structure...");
        fs.mkdirSync(dir);
        [
            "users",
            "system",
            "system/sounds",
            "system/img",
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
                v: code_database_1.Crypto.encode("[]", env_1.USER_PSW)
            }
        ].forEach((value) => {
            this.send(`Write ${value.p}`);
            fs.writeFileSync(path.join(dir, value.p), value.v);
        });
        this.send("Create first user");
        User_1.User.create(os.userInfo().username, true, (msg) => {
            this.send(msg);
        });
    }
}
exports.Installer = Installer;
Installer.cbs = [];
//# sourceMappingURL=Installer.js.map