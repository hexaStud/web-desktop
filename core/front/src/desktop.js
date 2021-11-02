"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Desktop = void 0;
const path = require("path");
const env_1 = require("../../env");
const code_database_1 = require("code-database");
const fs = require("fs");
const Protocol_1 = require("../../main/Protocol");
const File_1 = require("../../main/File");
const Window_1 = require("../../main/Window");
var Desktop;
(function (Desktop) {
    const windows = [];
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
        const desktopEle = document.getElementById("icons");
        const taskbarEle = document.getElementById("taskbar");
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
        let test = new Window_1.Window();
        test.open();
    }
    Desktop.load = load;
})(Desktop = exports.Desktop || (exports.Desktop = {}));
//# sourceMappingURL=desktop.js.map