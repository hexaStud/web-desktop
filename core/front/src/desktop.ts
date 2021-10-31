import {IUser} from "../../main/IUser";
import * as path from "path";
import {__root, DATA_NAME, DESKTOP_PSW} from "../../env";
import {Crypto, ExtendedArray} from "code-database";
import * as fs from "fs";
import {Protocol} from "../../main/Protocol";
import {IProtocol} from "../../main/IProtocol";
import {File} from "../../main/File";

export namespace Desktop {
    export interface IDesktopIcon {
        position: number,
        file: string
    }

    function getDesktop(usr: IUser): IDesktopIcon[] {
        let desktop: string = path.join(__root, DATA_NAME, "users", usr.username, "desktop");
        return JSON.parse(Crypto.decode(fs.readFileSync(path.join(desktop, "desktop"), "utf-8"), DESKTOP_PSW));
    }

    function setDesktop(usr: IUser, icons: IDesktopIcon[]): void {
        let desktop: string = path.join(__root, DATA_NAME, "users", usr.username, "desktop");
        fs.writeFileSync(path.join(desktop, "desktop"), Crypto.encode(JSON.stringify(icons), DESKTOP_PSW));
    }

    function createIcon(usr: IUser, icon: IDesktopIcon): HTMLElement {
        const protocol: IProtocol = Protocol.getProtocolFromExtension(usr, <File>File.parse(path.join(__root, DATA_NAME, "users", usr.username, "desktop", icon.file)));

        let div = document.createElement("div");
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
            let elements =  document.getElementsByClassName("dragHover");
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
        let width = window.innerWidth
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
            });
            div.id = "desktop-ffd-" + i;
            desktopEle.appendChild(div);
        }

        const rest: IDesktopIcon[] = [];

        conf.forEach((value) => {
            let id: string = `desktop-ffd-${value.position}`;
            let ele: HTMLElement | null;
            if (!!(ele = document.getElementById(id))) {
                ele.innerHTML = "";
                ele.appendChild(createIcon(usr, value));
            } else {
                rest.push(value);
            }
        });
    }
}
