import {IUser} from "../../main/IUser";
import * as path from "path";
import {__root, DATA_NAME, DESKTOP_PSW, TASKBAR_PSW, USER_PSW} from "../../env";
import {Crypto, ExtendedArray} from "code-database";
import * as fs from "fs";
import {Protocol} from "../../main/Protocol";
import {IProtocol} from "../../main/IProtocol";
import {File} from "../../main/File";
import {Window} from "../../main/Window";

export namespace Desktop {
    const windows: Window[] = [];

    export interface IDesktopIcon {
        position: number,
        file: string
    }

    export interface ITaskbar {
        position: number,
        file: string
    }

    function getTaskbar(usr: IUser): ITaskbar[] {
        let taskbar: string = path.join(__root, DATA_NAME, "users", usr.username, "system", "taskbar");
        return JSON.parse(Crypto.decode(fs.readFileSync(path.join(taskbar, "taskbar"), "utf-8"), TASKBAR_PSW));
    }

    function setTaskbar(usr: IUser, icons: ITaskbar[]): void {
        let taskbar: string = path.join(__root, DATA_NAME, "users", usr.username, "system", "taskbar");
        fs.writeFileSync(path.join(taskbar, "taskbar"), Crypto.encode(JSON.stringify(icons), TASKBAR_PSW));
    }

    function getDesktop(usr: IUser): IDesktopIcon[] {
        let desktop: string = path.join(__root, DATA_NAME, "users", usr.username, "desktop");
        return JSON.parse(Crypto.decode(fs.readFileSync(path.join(desktop, "desktop"), "utf-8"), DESKTOP_PSW));
    }

    function setDesktop(usr: IUser, icons: IDesktopIcon[]): void {
        let desktop: string = path.join(__root, DATA_NAME, "users", usr.username, "desktop");
        fs.writeFileSync(path.join(desktop, "desktop"), Crypto.encode(JSON.stringify(icons), DESKTOP_PSW));
    }

    function createIcon(usr: IUser, icon: IDesktopIcon, index: number): HTMLElement {
        const protocol: IProtocol = Protocol.getProtocolFromExtension(usr, <File>File.parse(path.join(__root, DATA_NAME, "users", usr.username, "desktop", icon.file)));

        let div = document.createElement("div");
        div.addEventListener("dblclick", () => {
            let filePath = path.join(__root, DATA_NAME, "users", usr.username, "desktop", icon.file);
            Protocol.exec(usr, <File>File.parse(filePath));
        });
        div.setAttribute("index", index.toString())
        div.draggable = true;
        div.id = "desktop-fft-icon-" + icon.position;
        div.addEventListener("dragstart", (e) => {
            let target: any = e.target;
            // @ts-ignore
            if (target.tagName === "IMG") {
                // @ts-ignore
                target = target.parentElement;
            }
            // @ts-ignore
            e.dataTransfer.setData("text", target.id);
        });
        div.addEventListener("dragend", () => {
            let elements = document.getElementsByClassName("dragHover");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("dragHover");
            }
        });

        let span = document.createElement("span");
        span.innerHTML = icon.file;

        let img = document.createElement("img");
        img.src = protocol.icon;

        div.appendChild(img);
        div.appendChild(span);

        return div;
    }

    export function load(usr: IUser) {
        const desktopEle: HTMLElement = <HTMLElement>document.getElementById("icons");
        const taskbarEle: HTMLElement = <HTMLElement>document.getElementById("taskbar");

        let desktop: string = path.join(__root, DATA_NAME, "users", usr.username, "desktop");
        let conf: IDesktopIcon[] = getDesktop(usr);

        console.log(conf);

        conf.forEach((value, index) => {
            if (!fs.existsSync(path.join(desktop, value.file))) {
                conf = ExtendedArray.removeAt(conf, index);
            }
        });

        setDesktop(usr, conf);

        let height = window.innerHeight - 50;
        let width = window.innerWidth;
        width = (width - (width % 120)) / 120;
        height = (height - (height % 65)) / 65;
        desktopEle.style.gridTemplateColumns = "120px ".repeat(width);
        desktopEle.style.gridTemplateRows = "65px ".repeat(height);
        for (let i = 0; i < width * height; i++) {
            let div = document.createElement("div");
            div.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            div.addEventListener("dragenter", () => {
                div.classList.add("dragHover");
            });
            div.addEventListener("dragleave", () => {
                div.classList.remove("dragHover");
            });
            div.addEventListener("drop", (e) => {
                e.preventDefault();
                // @ts-ignore
                let data = e.dataTransfer.getData("text");
                // @ts-ignore
                e.target.appendChild(document.getElementById(data));
                // @ts-ignore
                let pos: string = e.target.id.split("desktop-ffd-")[1];
                let icons = getDesktop(usr);
                for (let i = 0; i < icons.length; i++) {
                    if (icons[i].position === parseInt(<string>(<HTMLElement>document.getElementById(data)).getAttribute("index"))) {
                        icons[i].position = parseInt(pos);
                    }
                }

                setDesktop(usr, icons);
            });
            div.id = "desktop-ffd-" + i;
            desktopEle.appendChild(div);
        }

        const rest: IDesktopIcon[] = [];
        const pos: number[] = [];
        conf.forEach((value) => {
            let id: string = `desktop-ffd-${value.position}`;
            pos.push(value.position);
            let ele: HTMLElement | null;
            if (!!(ele = document.getElementById(id))) {
                ele.innerHTML = "";
                ele.appendChild(createIcon(usr, value, value.position));
            } else {
                rest.push(value);
            }
        });

        rest.forEach((value) => {
            for (let i = 0; i < height * width; i++) {
                if (pos.includes(i)) {
                    continue;
                }

                let id: string = `desktop-ffd-${i}`;
                let ele: HTMLElement | null;
                if (!!(ele = document.getElementById(id))) {
                    ele.innerHTML = "";
                    ele.appendChild(createIcon(usr, value, value.position));
                }
            }
        });

        taskbarEle.innerHTML = "";
        let tasks: ITaskbar[] = getTaskbar(usr);
        tasks.forEach((value) => {
            let taskbarPath = path.join(__root, DATA_NAME, "users", usr.username, "system", "taskbar");
            let div = document.createElement("div");
            let prt: IProtocol = Protocol.getProtocolFromExtension(usr, <File>File.parse(path.join(taskbarPath, value.file)));
            let img = document.createElement("img");
            img.src = prt.icon;

            div.appendChild(img);

            taskbarEle.appendChild(div);
        });

        let test = new Window();
        test.open();

    }
}
