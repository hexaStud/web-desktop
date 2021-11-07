export declare namespace UI {
    interface IWindowConstructor {
        maximizable: boolean;
    }
    type WindowEvents = "close" | "destroy";
    class Window {
        private events;
        private static windows;
        private static processID;
        private readonly id;
        private frame;
        private iframe;
        private destroyed;
        private option;
        constructor(option?: IWindowConstructor);
        private draggable;
        private emit;
        private static createDefaultLink;
        on(ev: WindowEvents, cb: {
            (): void;
        }): void;
        open(): void;
        loadFile(src: string): void;
        loadHTML(html: HTMLElement | string): void;
        loadAsset(asset: HTMLLinkElement | HTMLScriptElement | HTMLMetaElement | HTMLStyleElement): void;
        close(): void;
        isOpen(): boolean;
        isDestroyed(): boolean;
        destroy(): void;
    }
    class QuestionDialog {
        private win;
        private q;
        constructor(question: string);
        await(): Promise<boolean>;
    }
}
//# sourceMappingURL=UI.d.ts.map