"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Desktop = void 0;
const path = require("path");
const electron_1 = require("electron");
const env_1 = require("../../env");
const code_database_1 = require("code-database");
const fs = require("fs");
const Protocol_1 = require("../../plug/Protocol");
const File_1 = require("../../main/File");
const UI_1 = require("../../plug/UI");
const Sound_1 = require("../../plug/Sound");
var Window = UI_1.UI.Window;
var Dialog = UI_1.UI.QuestionDialog;
var Sound = Sound_1.Assets.Sound;
var Desktop;
(function (Desktop) {
    function getTaskbar(usr) {
        let taskbar = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "system", "taskbar");
        return JSON.parse(code_database_1.Crypto.decode(fs.readFileSync(path.join(taskbar, "taskbar"), "utf-8"), env_1.TASKBAR_PSW));
    }
    function setTaskbar(usr, icons) {
        let taskbar = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "system", "taskbar");
        fs.writeFileSync(path.join(taskbar, "taskbar"), code_database_1.Crypto.encode(JSON.stringify(icons), env_1.TASKBAR_PSW));
    }
    function getDesktop(usr) {
        let desktop = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop");
        return JSON.parse(code_database_1.Crypto.decode(fs.readFileSync(path.join(desktop, "desktop"), "utf-8"), env_1.DESKTOP_PSW));
    }
    function setDesktop(usr, icons) {
        let desktop = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop");
        fs.writeFileSync(path.join(desktop, "desktop"), code_database_1.Crypto.encode(JSON.stringify(icons), env_1.DESKTOP_PSW));
    }
    function createIcon(usr, icon, index) {
        const protocol = Protocol_1.Protocol.getProtocolFromExtension(usr, File_1.File.parse(path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop", icon.file)));
        let div = document.createElement("div");
        div.addEventListener("dblclick", () => {
            let filePath = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop", icon.file);
            Protocol_1.Protocol.exec(usr, File_1.File.parse(filePath));
        });
        div.setAttribute("index", index.toString());
        div.draggable = true;
        div.id = "desktop-fft-icon-" + icon.position;
        div.addEventListener("dragstart", (e) => {
            let target = e.target;
            if (target.tagName === "IMG") {
                target = target.parentElement;
            }
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
    function load(usr) {
        const desktopEle = document.getElementById("desktopIcons");
        const taskbarEle = document.getElementById("taskbarIcons");
        let desktop = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop");
        let conf = getDesktop(usr);
        console.log(conf);
        conf.forEach((value, index) => {
            if (!fs.existsSync(path.join(desktop, value.file))) {
                conf = code_database_1.ExtendedArray.removeAt(conf, index);
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
                let data = e.dataTransfer.getData("text");
                e.target.appendChild(document.getElementById(data));
                let pos = e.target.id.split("desktop-ffd-")[1];
                let icons = getDesktop(usr);
                for (let i = 0; i < icons.length; i++) {
                    if (icons[i].position === parseInt(document.getElementById(data).getAttribute("index"))) {
                        icons[i].position = parseInt(pos);
                    }
                }
                setDesktop(usr, icons);
            });
            div.id = "desktop-ffd-" + i;
            desktopEle.appendChild(div);
        }
        const rest = [];
        const pos = [];
        conf.forEach((value) => {
            let id = `desktop-ffd-${value.position}`;
            pos.push(value.position);
            let ele;
            if (!!(ele = document.getElementById(id))) {
                ele.innerHTML = "";
                ele.appendChild(createIcon(usr, value, value.position));
            }
            else {
                rest.push(value);
            }
        });
        rest.forEach((value) => {
            for (let i = 0; i < height * width; i++) {
                if (pos.includes(i)) {
                    continue;
                }
                let id = `desktop-ffd-${i}`;
                let ele;
                if (!!(ele = document.getElementById(id))) {
                    ele.innerHTML = "";
                    ele.appendChild(createIcon(usr, value, value.position));
                }
            }
        });
        document.getElementById("taskbarMenuIcon").addEventListener("click", () => {
            document.getElementById("taskbarMenu").classList.toggle("active");
        });
        document.getElementById("taskbarMenuRestart").addEventListener("click", function () {
            if (!!this.dia) {
                let e;
                if (!!(e = Sound.get("error.mp3"))) {
                    e.play();
                }
                return;
            }
            const dialog = new Dialog("Do you want really restart the pc");
            this.dia = dialog;
            dialog.await().then((value) => {
                if (value) {
                    electron_1.ipcRenderer.send("restart", "");
                }
                this.dia = undefined;
            });
        });
        document.getElementById("taskbarMenuQuit").addEventListener("click", function () {
            if (!!this.dia) {
                let e;
                if (!!(e = Sound.get("error.mp3"))) {
                    e.play();
                }
                return;
            }
            const dialog = new Dialog("Do you want really shutdown the pc");
            this.dia = dialog;
            dialog.await().then((value) => {
                if (value) {
                    electron_1.ipcRenderer.send("shutdown", "");
                }
                this.dia = undefined;
            });
        });
        taskbarEle.innerHTML = "";
        let tasks = getTaskbar(usr);
        tasks.forEach((value) => {
            let taskbarPath = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "system", "taskbar");
            let div = document.createElement("div");
            let prt = Protocol_1.Protocol.getProtocolFromExtension(usr, File_1.File.parse(path.join(taskbarPath, value.file)));
            let img = document.createElement("img");
            img.src = prt.icon;
            div.appendChild(img);
            taskbarEle.appendChild(div);
        });
        let test = new Window();
        test.open();
    }
    Desktop.load = load;
})(Desktop = exports.Desktop || (exports.Desktop = {}));
//# sourceMappingURL=desktop.js.map