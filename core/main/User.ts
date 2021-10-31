import * as fs from "fs";
import {__root, DATA_NAME, USER_PSW} from "../env";
import * as path from "path";
import {IUser} from "./IUser";
import {Crypto} from "code-database";

export class User {
    public static create(username: string, admin: boolean, log: { (msg: string): void } = (msg) => {
    }): IUser {
        log(`Create user ${username}`);
        fs.mkdirSync(path.join(__root, DATA_NAME, "users", username));
        [
            "desktop",
            "documents",
            "programs",
            "cash",
            "cash/roaming"
        ].forEach((value) => {
            log(`Create ${value}`);
            fs.mkdirSync(path.join(__root, DATA_NAME, "users", username, value));
        });

        const user: IUser = {
            admin: admin,
            password: false,
            username: username,
            style: {
                background: "0000.png"
            }
        }
        log("Write user");
        const users: IUser[] = JSON.parse(Crypto.decode(fs.readFileSync(path.join(__root, DATA_NAME, "system", "config", "user"), "utf-8"), USER_PSW));
        users.push(user);
        fs.writeFileSync(path.join(__root, DATA_NAME, "system", "config", "user"), Crypto.encode(JSON.stringify(users), USER_PSW));

        log("Finished creating user");
        return user;
    }
}
