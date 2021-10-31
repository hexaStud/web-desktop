import { IUser } from "./IUser";
import { File } from "./File";
import { IProtocol } from "./IProtocol";
export declare class Protocol {
    private static defaultProtocol;
    private static getProtocol;
    static exec(usr: IUser, file: File): void;
    static getProtocolFromExtension(usr: IUser, file: File): IProtocol;
}
//# sourceMappingURL=Protocol.d.ts.map