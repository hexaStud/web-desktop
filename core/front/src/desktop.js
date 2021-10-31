"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Desktop = void 0;
const path = require("path");
const env_1 = require("../../env");
const code_database_1 = require("code-database");
const fs = require("fs");
const Protocol_1 = require("../../main/Protocol");
const File_1 = require("../../main/File");
var Desktop;
(function (Desktop) {
    function getDesktop(usr) {
        let desktop = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop");
        return JSON.parse(code_database_1.Crypto.decode(fs.readFileSync(path.join(desktop, "desktop"), "utf-8"), env_1.DESKTOP_PSW));
    }
    function setDesktop(usr, icons) {
        let desktop = path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop");
        fs.writeFileSync(path.join(desktop, "desktop"), code_database_1.Crypto.encode(JSON.stringify(icons), env_1.DESKTOP_PSW));
    }
    function createIcon(usr, icon) {
        const protocol = Protocol_1.Protocol.getProtocolFromExtension(usr, File_1.File.parse(path.join(env_1.__root, env_1.DATA_NAME, "users", usr.username, "desktop", icon.file)));
        let div = document.createElement("div");
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
            });
            div.id = "desktop-ffd-" + i;
            desktopEle.appendChild(div);
        }
        const rest = [];
        conf.forEach((value) => {
            let id = `desktop-ffd-${value.position}`;
            let ele;
            if (!!(ele = document.getElementById(id))) {
                ele.innerHTML = "";
                ele.appendChild(createIcon(usr, value));
            }
            else {
                rest.push(value);
            }
        });
    }
    Desktop.load = load;
})(Desktop = exports.Desktop || (exports.Desktop = {}));
//# sourceMappingURL=desktop.js.map