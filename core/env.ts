import * as path from "path";
import {Crypto} from "code-database";

export const __root: string = path.join(__dirname, "..");
export const __front: string = path.join(__root, "core", "front");

export const DATA_NAME: string = "data";
export const USER_PSW: string = Crypto.encode("user_data_web_desktop", "user_data_web_desktop"); // TODO hide password
export const DESKTOP_PSW: string = Crypto.encode("desktop_data_web_desktop", "desktop_data_web_desktop"); // TODO hide password
export const PROTOCOL_PSW: string = Crypto.encode("protocol_data_web_desktop", "protocol_data_web_desktop"); // TODO hide password
export const TASKBAR_PSW: string = Crypto.encode("taskbar_data_web_desktop", "taskbar_data_web_desktop"); // TODO hide password
