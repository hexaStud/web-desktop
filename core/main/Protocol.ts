import {IUser} from "./IUser";
import {File} from "./File";
import {IProtocol} from "./IProtocol";
import {Crypto} from "code-database";
import * as fs from "fs";
import * as path from "path";
import {__root, DATA_NAME, PROTOCOL_PSW} from "../env";
import {Image} from "./Image";

export class Protocol {
    private static defaultProtocol: IProtocol = {
        exec: "",
        extension: "",
        icon: (<Image>Image.get("file.png")).getPath()
    }

    private static getProtocol(usr: IUser): IProtocol[] {
        return JSON.parse(Crypto.decode(fs.readFileSync(path.join(__root, DATA_NAME, "users", usr.username, "system", "protocol"), "utf-8"), PROTOCOL_PSW));
    }

    private static executeProtocol(prt: IProtocol): void {
        console.log("TODO write executing");
        // TODO write executing
    }

    public static exec(usr: IUser, file: File): void {
        const prs: IProtocol[] = Protocol.getProtocol(usr);
        for (const value of prs) {
            if (value.extension === file.ext) {
                Protocol.executeProtocol(value);
                return;
            }
        }

        Protocol.executeProtocol(Protocol.defaultProtocol);
    }

    public static getProtocolFromExtension(usr: IUser, file: File): IProtocol {
        const prs: IProtocol[] = Protocol.getProtocol(usr);
        for (const value of prs) {
            if (value.extension === file.ext) {
                return value;
            }
        }

        return Protocol.defaultProtocol;
    }
}
