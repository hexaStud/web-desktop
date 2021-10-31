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

    public static exec(usr: IUser, file: File) {
        const prs: IProtocol[] = Protocol.getProtocol(usr);
        for (const value of prs) {
            if (value.extension === file.ext) {

                // TODO write executing

                return;
            }
        }
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
