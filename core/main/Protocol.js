"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
const code_database_1 = require("code-database");
const fs = require("fs");
const path = require("path");
const env_1 = require("../env");
const Image_1 = require("./Image");
class Protocol {
    static getProtocol(usr) {
        return JSON.parse(code_database_1.Crypto.decode(fs.readFileSync(path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "system", "protocol"), "utf-8"), env_1.PROTOCOL_PSW));
    }
    static exec(usr, file) {
        const prs = Protocol.getProtocol(usr);
        for (const value of prs) {
            if (value.extension === file.ext) {
                return;
            }
        }
    }
    static getProtocolFromExtension(usr, file) {
        const prs = Protocol.getProtocol(usr);
        for (const value of prs) {
            if (value.extension === file.ext) {
                return value;
            }
        }
        return Protocol.defaultProtocol;
    }
}
exports.Protocol = Protocol;
Protocol.defaultProtocol = {
    exec: "",
    extension: "",
    icon: Image_1.Image.get("file.png").getPath()
};
//# sourceMappingURL=Protocol.js.map