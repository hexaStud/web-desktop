"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI = void 0;
const code_database_1 = require("code-database");
const font_1 = require("./font");
var UI;
(function (UI) {
    class Window {
        constructor(option = {
            maximizable: true
        }) {
            this.id = Window.processID;
            Window.processID++;
            this.events = new Map();
            this.option = option;
            this.frame = undefined;
            this.iframe = document.createElement("iframe");
            this.destroyed = false;
            Window.windows.push(this);
        }
        draggable(header) {
            let pos1, pos2, pos3, pos4;
            pos1 = pos2 = pos3 = pos4 = 0;
            header.addEventListener("mousedown", (e) => {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                const up = (e) => {
                    e.preventDefault();
                    header.removeEventListener("mouseup", up);
                    header.removeEventListener("mousemove", move);
                };
                const move = (e) => {
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    if (!!this.frame) {
                        this.frame.style.left = (this.frame.offsetLeft - pos1) + "px";
                        this.frame.style.top = (this.frame.offsetTop - pos2) + "px";
                    }
                };
                header.addEventListener("mouseup", up);
                header.addEventListener("mousemove", move);
            });
        }
        emit(ev) {
            if (this.events.has(ev)) {
                this.events.get(ev).forEach((value) => {
                    value();
                });
            }
        }
        static createDefaultLink() {
            const link = document.createElement("link");
            link.href = "../front/style/default.css";
            link.rel = "stylesheet";
            return link;
        }
        on(ev, cb) {
            if (this.events.has(ev)) {
                let event = this.events.get(ev);
                event.push(cb);
                this.events.set(ev, event);
            }
            else {
                this.events.set(ev, [
                    cb
                ]);
            }
        }
        open() {
            if (this.destroyed) {
                throw new Error("Cannot open destroyed window");
            }
            this.frame = document.createElement("div");
            this.frame.classList.add("window");
            this.frame.addEventListener("mousedown", () => {
                let elements = document.getElementsByClassName(".window");
                for (let i = 0; i < elements.length; i++) {
                    elements[i].classList.remove("active");
                }
                if (!!this.frame) {
                    this.frame.classList.add("active");
                }
            });
            let navbar = document.createElement("div");
            navbar.classList.add("navbar");
            let closeBTN = document.createElement("div");
            closeBTN.classList.add("icon");
            closeBTN.addEventListener("click", () => {
                this.close();
            });
            let closeBTNSpan = document.createElement("span");
            closeBTNSpan.innerHTML = "x";
            let maximizeBTN = document.createElement("div");
            maximizeBTN.classList.add("icon");
            let maximizeBTNSpan = document.createElement("span");
            maximizeBTNSpan.innerHTML = "[]";
            if (this.option.maximizable) {
                maximizeBTNSpan.addEventListener("click", () => {
                    if (!!this.frame) {
                        this.frame.classList.toggle("maximized");
                    }
                });
            }
            else {
                maximizeBTNSpan.classList.add("muted");
            }
            let content = document.createElement("div");
            content.classList.add("content");
            content.appendChild(this.iframe);
            maximizeBTN.appendChild(maximizeBTNSpan);
            closeBTN.appendChild(closeBTNSpan);
            navbar.appendChild(maximizeBTN);
            navbar.appendChild(closeBTN);
            this.frame.appendChild(navbar);
            this.frame.appendChild(content);
            this.draggable(navbar);
            document.body.appendChild(this.frame);
            this.frame.style.top = ((window.innerHeight - this.frame.clientHeight) / 2) + "px";
            this.frame.style.left = ((window.innerWidth - this.frame.clientWidth) / 2) + "px";
            if (!!this.iframe.contentDocument) {
                this.iframe.contentDocument.head.appendChild(UI.Window.createDefaultLink());
                this.iframe.contentDocument.head.appendChild(font_1.Font.buildFont());
                this.iframe.contentDocument.body.style.setProperty("--base-font", `"${font_1.Font.listFonts()[0].name}"`);
            }
        }
        loadFile(src) {
            if (this.destroyed) {
                throw new Error("Cannot invoke function because the window is destroyed");
            }
            this.iframe.src = src;
        }
        loadHTML(html) {
            if (this.destroyed) {
                throw new Error("Cannot invoke function because the window is destroyed");
            }
            console.log(this.iframe.contentDocument);
            if (!!this.iframe.contentDocument) {
                if (typeof html === "string") {
                    this.iframe.contentDocument.body.innerHTML = html;
                }
                else {
                    this.iframe.contentDocument.body.innerHTML = "";
                    this.iframe.contentDocument.body.appendChild(html);
                }
            }
        }
        loadAsset(asset) {
            if (this.destroyed) {
                throw new Error("Cannot invoke function because the window is destroyed");
            }
            if (this.isOpen() && !!this.iframe.contentDocument) {
                this.iframe.contentDocument.head.appendChild(asset);
            }
        }
        close() {
            if (this.destroyed) {
                throw new Error("Cannot close destroyed window");
            }
            if (!!this.frame) {
                this.frame.remove();
                this.frame = undefined;
            }
            this.emit("close");
        }
        isOpen() {
            return !!this.frame;
        }
        isDestroyed() {
            return this.destroyed;
        }
        destroy() {
            if (this.destroyed) {
                throw new Error("Cannot destroy destroyed window");
            }
            if (this.isOpen()) {
                this.close();
            }
            for (let i = 0; i < Window.windows.length; i++) {
                if (this.id === Window.windows[i].id) {
                    Window.windows = code_database_1.ExtendedArray.removeAt(Window.windows, i);
                }
            }
            this.destroyed = true;
            this.emit("destroy");
        }
    }
    Window.windows = [];
    Window.processID = 0;
    UI.Window = Window;
    class QuestionDialog {
        constructor(question) {
            this.win = new Window({
                maximizable: false
            });
            this.q = question;
        }
        await() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    const root = document.createElement("div");
                    root.classList.add("root");
                    const titleBox = document.createElement("div");
                    titleBox.classList.add("titleBox");
                    const titleSpan = document.createElement("span");
                    titleSpan.innerHTML = this.q;
                    titleBox.appendChild(titleSpan);
                    const btnBox = document.createElement("div");
                    btnBox.classList.add("btnBox");
                    const btnYes = document.createElement("button");
                    btnYes.addEventListener("click", () => {
                        resolve(true);
                        this.win.destroy();
                    });
                    const btnYesSpan = document.createElement("span");
                    btnYesSpan.innerHTML = "Yes";
                    btnYes.appendChild(btnYesSpan);
                    const btnNo = document.createElement("button");
                    btnNo.addEventListener("click", () => {
                        resolve(false);
                        this.win.destroy();
                    });
                    const btnNoSpan = document.createElement("span");
                    btnNoSpan.innerHTML = "No";
                    btnNo.appendChild(btnNoSpan);
                    btnBox.appendChild(btnYes);
                    btnBox.appendChild(btnNo);
                    root.appendChild(titleBox);
                    root.appendChild(btnBox);
                    this.win.open();
                    this.win.loadHTML(root);
                    this.win.on("close", () => {
                        resolve(false);
                        if (!this.win.isDestroyed()) {
                            this.win.destroy();
                        }
                    });
                    let style = document.createElement("style");
                    style.innerHTML = `
                    .root {
                        height: 100vh;
                        font-family: var(--base-font);
                        display: grid;
                        grid-template-rows: auto 50px;
                    }
                
                    .titleBox {
                        padding: 5px;
                    }
                
                    .btnBox {
                        display: flex;
                        justify-content: space-evenly;
                    }
                `;
                    this.win.loadAsset(style);
                });
            });
        }
    }
    UI.QuestionDialog = QuestionDialog;
})(UI = exports.UI || (exports.UI = {}));
//# sourceMappingURL=UI.js.map