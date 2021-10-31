import {IUser} from "../../main/IUser";
import {Crypto} from "code-database";
import * as fs from "fs";
import * as path from "path";
import {__root, DATA_NAME, USER_PSW} from "../../env";

export namespace Login {
    export function getAllUsers(): IUser[] {
        return JSON.parse(Crypto.decode(fs.readFileSync(path.join(__root, DATA_NAME, "system", "config", "user"), "utf-8"), USER_PSW));
    }

    export function selectUserByName(username: string): IUser | false {
        const users: IUser[] = getAllUsers();
        for (const user of users) {
            if (user.username === username) {
                return user;
            }
        }

        return false
    }

    export function selectUserByIndex(index: number): IUser | false {
        const users: IUser[] = getAllUsers();
        if (index < 0 || index > users.length - 1) {
            return false
        }
        return users[index];
    }

    export function loadUser(usr: IUser) {
        document.body.style.setProperty("--bg-image", `url(../../../${DATA_NAME}/system/config/background/${usr.style.background})`);
        (<HTMLElement>document.getElementById("loginHeader")).innerHTML = usr.username;
        if (usr.password === false) {
            // @ts-ignore
            document.forms["loginForm"]["password"].disabled = "true";
            // @ts-ignore
            document.forms["loginForm"]["password"].style.opacity = "0";
        } else {
            // @ts-ignore
            document.forms["loginForm"]["password"].disabled = "false";
            // @ts-ignore
            document.forms["loginForm"]["password"].style.opacity = "1";
        }
    }
}
