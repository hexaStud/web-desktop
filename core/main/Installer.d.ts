export declare class Installer {
    private static cbs;
    static onMessage(cb: {
        (msg: string): void;
    }): void;
    static send(msg: string): void;
    static install(dir: string): void;
}
//# sourceMappingURL=Installer.d.ts.map