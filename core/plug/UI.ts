import {ExtendedArray} from "code-database";
import {Font} from "./font";
import {runInNewContext} from "vm";

export namespace UI {
    export interface IWindowConstructor {
        maximizable: boolean;
    }

    export type WindowEvents = "close" | "destroy";

    export class Window {
        private events: Map<WindowEvents, Array<{ (): void }>>;
        private static windows: Window[] = [];
        private static processID: number = 0;
        private readonly id: number;
        private frame: HTMLElement | undefined;
        private iframe: HTMLIFrameElement;
        private destroyed: boolean;
        private option: IWindowConstructor;

        public constructor(option: IWindowConstructor = {
            maximizable: true
        }) {
            this.id = Window.processID;
            Window.processID++;

            this.events = new Map<UI.WindowEvents, Array<{ (): void }>>();

            this.option = option;
            this.frame = undefined;
            this.iframe = document.createElement("iframe");
            this.destroyed = false;
            Window.windows.push(this);
        }

        private draggable(header: HTMLElement): void {
            let pos1: number, pos2: number, pos3: number, pos4: number;
            pos1 = pos2 = pos3 = pos4 = 0;

            header.addEventListener("mousedown", (e) => {
                e.preventDefault();

                pos3 = e.clientX;
                pos4 = e.clientY;

                const up = (e: MouseEvent) => {
                    e.preventDefault();
                    header.removeEventListener("mouseup", up);
                    header.removeEventListener("mousemove", move);
                }

                const move = (e: MouseEvent) => {
                    e.preventDefault();

                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;

                    if (!!this.frame) {
                        this.frame.style.left = (this.frame.offsetLeft - pos1) + "px";
                        this.frame.style.top = (this.frame.offsetTop - pos2) + "px";
                    }
                }

                header.addEventListener("mouseup", up);
                header.addEventListener("mousemove", move);
            });
        }

        private emit(ev: WindowEvents) {
            if (this.events.has(ev)) {
                (<Array<{ (): void }>>this.events.get(ev)).forEach((value) => {
                    value();
                });
            }
        }


        private static createDefaultLink(): HTMLLinkElement {
            const link = document.createElement("link");
            link.href = "../front/style/default.css";
            link.rel = "stylesheet";

            return link;
        }

        public on(ev: WindowEvents, cb: {
            (): void
        }): void {
            if (this.events.has(ev)) {
                let event: Array<{ (): void }> = <Array<{ (): void }>>this.events.get(ev);
                event.push(cb);
                this.events.set(ev, event);
            } else {
                this.events.set(ev, [
                    cb
                ]);
            }
        }

        public open() {
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
            navbar.classList.add("navbar")

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
            maximizeBTNSpan.innerHTML = "[]"; // TODO add icon;
            if (this.option.maximizable) {
                maximizeBTNSpan.addEventListener("click", () => {
                    if (!!this.frame) {
                        this.frame.classList.toggle("maximized");
                    }
                });
            } else {
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
                this.iframe.contentDocument.head.appendChild(Font.buildFont());
                this.iframe.contentDocument.body.style.setProperty("--base-font", `"${Font.listFonts()[0].name}"`);
            }
        }

        public loadFile(src: string) {
            if (this.destroyed) {
                throw new Error("Cannot invoke function because the window is destroyed");
            }
            this.iframe.src = src;
        }

        public loadHTML(html: HTMLElement | string) {
            if (this.destroyed) {
                throw new Error("Cannot invoke function because the window is destroyed");
            }
            console.log(this.iframe.contentDocument);
            if (!!this.iframe.contentDocument) {
                if (typeof html === "string") {
                    this.iframe.contentDocument.body.innerHTML = html;
                } else {
                    this.iframe.contentDocument.body.innerHTML = "";
                    this.iframe.contentDocument.body.appendChild(html);
                }
            }
        }

        public loadAsset(asset: HTMLLinkElement | HTMLScriptElement | HTMLMetaElement | HTMLStyleElement) {
            if (this.destroyed) {
                throw new Error("Cannot invoke function because the window is destroyed");
            }

            if (this.isOpen() && !!this.iframe.contentDocument) {
                this.iframe.contentDocument.head.appendChild(asset);
            }
        }

        public close(): void {
            if (this.destroyed) {
                throw new Error("Cannot close destroyed window");
            }

            if (!!this.frame) {
                this.frame.remove();
                this.frame = undefined;
            }

            this.emit("close");
        }

        public isOpen(): boolean {
            return !!this.frame;
        }

        public isDestroyed(): boolean {
            return this.destroyed;
        }

        public destroy() {
            if (this.destroyed) {
                throw new Error("Cannot destroy destroyed window");
            }

            if (this.isOpen()) {
                this.close();
            }

            for (let i: number = 0; i < Window.windows.length; i++) {
                if (this.id === Window.windows[i].id) {
                    Window.windows = ExtendedArray.removeAt(Window.windows, i);
                }
            }

            this.destroyed = true;

            this.emit("destroy");
        }
    }

    export class QuestionDialog {
        private win: Window;
        private q: string;

        constructor(question: string) {
            this.win = new Window({
                maximizable: false
            });

            this.q = question;
        }

        public async await(): Promise<boolean> {
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
        }
    }
}
