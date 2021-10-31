"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const fs = require("fs");
const env_1 = require("../env");
const path = require("path");
const code_database_1 = require("code-database");
class User {
    static create(username, admin, log = (msg) => {
    }) {
        log(`Create user ${username}`);
        fs.mkdirSync(path.join(env_1.__root, env_1.DATA_NAME, "users", username));
        [
            "desktop",
            "documents",
            "programs",
            "cash",
            "cash/roaming"
        ].forEach((value) => {
            log(`Create ${value}`);
            fs.mkdirSync(path.join(env_1.__root, env_1.DATA_NAME, "users", username, value));
        });
        const user = {
            admin: admin,
            password: false,
            username: username,
            style: {
                background: "0000.png"
            }
        };
        log("Write user");
        const users = JSON.parse(code_database_1.Crypto.decode(fs.readFileSync(path.join(env_1.__root, env_1.DATA_NAME, "system", "config", "user"), "utf-8"), env_1.USER_PSW));
        users.push(user);
        fs.writeFileSync(path.join(env_1.__root, env_1.DATA_NAME, "system", "config", "user"), code_database_1.Crypto.encode(JSON.stringify(users), env_1.USER_PSW));
        log("Finished creating user");
        return user;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map